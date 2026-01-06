/**
 * Upload Recipes to Supabase
 * Reads generated recipes and uploads them to the database
 * Run with: npx ts-node scripts/uploadRecipes.ts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface RecipeData {
    name: string;
    cuisine: string;
    mealTypes: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: string;
    instructions: string[];
    ingredients: Array<{
        name: string;
        category: string;
        quantity: string;
        optional: boolean;
    }>;
    macros: {
        protein: number;
        carbs: number;
        fats: number;
        calories: number;
    };
    tags: string[];
}

async function uploadRecipes() {
    console.log('🚀 Starting recipe upload to Supabase...\n');

    try {
        // Read generated recipes
        const recipesPath = path.join(process.cwd(), 'data', 'generated_recipes.json');

        if (!fs.existsSync(recipesPath)) {
            console.error('❌ Recipe file not found. Run generateRecipes.ts first.');
            process.exit(1);
        }

        const recipesData: RecipeData[] = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));
        console.log(`📖 Loaded ${recipesData.length} recipes from file\n`);

        let successCount = 0;
        let errorCount = 0;

        for (const recipe of recipesData) {
            try {
                console.log(`📝 Processing: ${recipe.name}...`);

                // 1. Insert or get ingredients
                const ingredientIds: { [key: string]: string } = {};

                for (const ingredient of recipe.ingredients) {
                    // Check if ingredient exists
                    const { data: existingIngredient } = await supabase
                        .from('ingredients')
                        .select('id')
                        .eq('name', ingredient.name.toLowerCase())
                        .single();

                    if (existingIngredient) {
                        ingredientIds[ingredient.name] = existingIngredient.id;
                    } else {
                        // Insert new ingredient
                        const { data: newIngredient, error } = await supabase
                            .from('ingredients')
                            .insert({
                                name: ingredient.name.toLowerCase(),
                                category: ingredient.category
                            })
                            .select('id')
                            .single();

                        if (error) throw error;
                        ingredientIds[ingredient.name] = newIngredient.id;
                    }
                }

                // 2. Insert recipe
                const { data: insertedRecipe, error: recipeError } = await supabase
                    .from('recipes')
                    .insert({
                        name: recipe.name,
                        cuisine: recipe.cuisine,
                        meal_types: recipe.mealTypes,
                        prep_time: recipe.prepTime,
                        cook_time: recipe.cookTime,
                        servings: recipe.servings,
                        difficulty: recipe.difficulty,
                        instructions: recipe.instructions,
                        macros: recipe.macros,
                        tags: recipe.tags
                    })
                    .select('id')
                    .single();

                if (recipeError) throw recipeError;

                // 3. Insert recipe-ingredient relationships
                const recipeIngredients = recipe.ingredients.map(ingredient => ({
                    recipe_id: insertedRecipe.id,
                    ingredient_id: ingredientIds[ingredient.name],
                    quantity: ingredient.quantity,
                    optional: ingredient.optional
                }));

                const { error: relationError } = await supabase
                    .from('recipe_ingredients')
                    .insert(recipeIngredients);

                if (relationError) throw relationError;

                console.log(`   ✅ Uploaded successfully`);
                successCount++;

            } catch (error) {
                console.error(`   ❌ Error uploading ${recipe.name}:`, error);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Upload Summary:');
        console.log(`   ✅ Successful: ${successCount}`);
        console.log(`   ❌ Failed: ${errorCount}`);
        console.log(`   📝 Total: ${recipesData.length}`);
        console.log('='.repeat(50));

        if (successCount > 0) {
            console.log('\n🎉 Recipes uploaded successfully!');
            console.log('🔗 View in Supabase: ' + supabaseUrl + '/project/default/editor');
        }

    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
uploadRecipes();
