import { supabase } from '../config/supabase';
import { Recipe, Ingredient, RecipeIngredient } from '../types';

/**
 * Fetch all recipes from Supabase
 */
export async function getAllRecipes(): Promise<Recipe[]> {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .select(`
        *,
        recipe_ingredients (
          quantity,
          optional,
          ingredient:ingredients (
            id,
            name,
            category
          )
        )
      `)
            .order('name');

        if (error) throw error;

        // Transform the data to match our Recipe type
        const recipes: Recipe[] = data.map((recipe: any) => ({
            id: String(recipe.id),
            name: String(recipe.name),
            cuisine: recipe.cuisine,
            mealTypes: Array.isArray(recipe.meal_types) ? recipe.meal_types : [],
            prepTime: Number(recipe.prep_time) || 0,
            cookTime: Number(recipe.cook_time) || 0,
            servings: Number(recipe.servings) || 1,
            difficulty: recipe.difficulty,
            instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
            macros: {
                protein: Number(recipe.macros?.protein) || 0,
                carbs: Number(recipe.macros?.carbs) || 0,
                fats: Number(recipe.macros?.fats) || 0,
                calories: Number(recipe.macros?.calories) || 0,
            },
            imageUrl: recipe.image_url || undefined,
            tags: Array.isArray(recipe.tags) ? recipe.tags : [],
            ingredients: Array.isArray(recipe.recipe_ingredients)
                ? recipe.recipe_ingredients.map((ri: any) => ({
                    ingredient: {
                        id: String(ri.ingredient?.id || ''),
                        name: String(ri.ingredient?.name || ''),
                        category: ri.ingredient?.category || 'other',
                    },
                    quantity: String(ri.quantity || ''),
                    optional: Boolean(ri.optional),
                }))
                : [],
        }));

        return recipes;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

/**
 * Fetch recipes by meal type
 */
export async function getRecipesByMealType(mealType: string): Promise<Recipe[]> {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .select(`
        *,
        recipe_ingredients (
          quantity,
          optional,
          ingredient:ingredients (
            id,
            name,
            category
          )
        )
      `)
            .contains('meal_types', [mealType])
            .order('name');

        if (error) throw error;

        const recipes: Recipe[] = data.map((recipe: any) => ({
            id: String(recipe.id),
            name: String(recipe.name),
            cuisine: recipe.cuisine,
            mealTypes: Array.isArray(recipe.meal_types) ? recipe.meal_types : [],
            prepTime: Number(recipe.prep_time) || 0,
            cookTime: Number(recipe.cook_time) || 0,
            servings: Number(recipe.servings) || 1,
            difficulty: recipe.difficulty,
            instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
            macros: {
                protein: Number(recipe.macros?.protein) || 0,
                carbs: Number(recipe.macros?.carbs) || 0,
                fats: Number(recipe.macros?.fats) || 0,
                calories: Number(recipe.macros?.calories) || 0,
            },
            imageUrl: recipe.image_url || undefined,
            tags: Array.isArray(recipe.tags) ? recipe.tags : [],
            ingredients: Array.isArray(recipe.recipe_ingredients)
                ? recipe.recipe_ingredients.map((ri: any) => ({
                    ingredient: {
                        id: String(ri.ingredient?.id || ''),
                        name: String(ri.ingredient?.name || ''),
                        category: ri.ingredient?.category || 'other',
                    },
                    quantity: String(ri.quantity || ''),
                    optional: Boolean(ri.optional),
                }))
                : [],
        }));

        return recipes;
    } catch (error) {
        console.error('Error fetching recipes by meal type:', error);
        return [];
    }
}

/**
 * Fetch a single recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
    try {
        const { data, error } = await supabase
            .from('recipes')
            .select(`
        *,
        recipe_ingredients (
          quantity,
          optional,
          ingredient:ingredients (
            id,
            name,
            category
          )
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;

        const recipe: Recipe = {
            id: String(data.id),
            name: String(data.name),
            cuisine: data.cuisine,
            mealTypes: Array.isArray(data.meal_types) ? data.meal_types : [],
            prepTime: Number(data.prep_time) || 0,
            cookTime: Number(data.cook_time) || 0,
            servings: Number(data.servings) || 1,
            difficulty: data.difficulty,
            instructions: Array.isArray(data.instructions) ? data.instructions : [],
            macros: {
                protein: Number(data.macros?.protein) || 0,
                carbs: Number(data.macros?.carbs) || 0,
                fats: Number(data.macros?.fats) || 0,
                calories: Number(data.macros?.calories) || 0,
            },
            imageUrl: data.image_url || undefined,
            tags: Array.isArray(data.tags) ? data.tags : [],
            ingredients: Array.isArray(data.recipe_ingredients)
                ? data.recipe_ingredients.map((ri: any) => ({
                    ingredient: {
                        id: String(ri.ingredient?.id || ''),
                        name: String(ri.ingredient?.name || ''),
                        category: ri.ingredient?.category || 'other',
                    },
                    quantity: String(ri.quantity || ''),
                    optional: Boolean(ri.optional),
                }))
                : [],
        };

        return recipe;
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        return null;
    }
}

/**
 * Get all unique ingredients
 */
export async function getAllIngredients(): Promise<Ingredient[]> {
    try {
        const { data, error } = await supabase
            .from('ingredients')
            .select('*')
            .order('name');

        if (error) throw error;

        return data as Ingredient[];
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }
}
