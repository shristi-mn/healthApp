/**
 * Recipe Generator Script
 * Uses Google Gemini AI to generate high-protein recipes
 * Run with: npx ts-node scripts/generateRecipes.ts
 */

import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Gemini AI
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

interface GeneratedRecipe {
    name: string;
    cuisine: 'indian' | 'western';
    mealTypes: string[];
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
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

async function generateRecipes(count: number, cuisine: 'indian' | 'western'): Promise<GeneratedRecipe[]> {
    const prompt = `Generate ${count} high-protein ${cuisine} recipes suitable for health-conscious adults.

Requirements:
- Each recipe should have at least 25g of protein per serving
- Mix of breakfast, lunch, and dinner options
- Include both vegetarian and non-vegetarian options
- Simple ingredients commonly found in home kitchens
- Clear, step-by-step instructions
- Accurate macro calculations (protein, carbs, fats, calories)

For each recipe, provide:
1. Name (appealing and descriptive)
2. Meal types (breakfast/lunch/dinner/snack)
3. Prep time and cook time (in minutes)
4. Servings
5. Difficulty (easy/medium/hard)
6. Detailed ingredients with quantities
7. Step-by-step instructions
8. Macros per serving (protein, carbs, fats, calories)
9. Tags (e.g., high-protein, low-carb, vegetarian, quick, etc.)

Return the response as a valid JSON array of recipe objects with this exact structure:
{
  "name": "Recipe Name",
  "cuisine": "${cuisine}",
  "mealTypes": ["breakfast"],
  "prepTime": 10,
  "cookTime": 15,
  "servings": 2,
  "difficulty": "easy",
  "instructions": ["Step 1", "Step 2"],
  "ingredients": [
    {
      "name": "chicken breast",
      "category": "protein",
      "quantity": "200g",
      "optional": false
    }
  ],
  "macros": {
    "protein": 30,
    "carbs": 20,
    "fats": 10,
    "calories": 280
  },
  "tags": ["high-protein", "low-carb"]
}

Generate exactly ${count} recipes. Return ONLY the JSON array, no additional text.`;

    console.log(`🤖 Generating ${count} ${cuisine} recipes with AI...`);

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract JSON from response (sometimes AI adds markdown code blocks)
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
    }

    const recipes = JSON.parse(jsonText);
    console.log(`✅ Generated ${recipes.length} ${cuisine} recipes`);

    return recipes;
}

async function main() {
    console.log('🚀 Starting recipe generation...\n');

    try {
        // Generate Indian recipes
        const indianRecipes = await generateRecipes(15, 'indian');
        console.log(`✅ Generated ${indianRecipes.length} Indian recipes\n`);

        // Wait a bit to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate Western recipes
        const westernRecipes = await generateRecipes(15, 'western');
        console.log(`✅ Generated ${westernRecipes.length} Western recipes\n`);

        // Combine all recipes
        const allRecipes = [...indianRecipes, ...westernRecipes];

        // Save to JSON file
        const outputPath = path.join(process.cwd(), 'data', 'generated_recipes.json');
        const outputDir = path.dirname(outputPath);

        // Create data directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(allRecipes, null, 2));

        console.log(`\n✅ Success! Generated ${allRecipes.length} recipes`);
        console.log(`📁 Saved to: ${outputPath}`);
        console.log('\n📊 Recipe Breakdown:');
        console.log(`   - Indian: ${indianRecipes.length}`);
        console.log(`   - Western: ${westernRecipes.length}`);
        console.log(`   - Total: ${allRecipes.length}`);

        // Show sample recipe
        console.log('\n📝 Sample Recipe:');
        console.log(JSON.stringify(allRecipes[0], null, 2));

    } catch (error) {
        console.error('❌ Error generating recipes:', error);
        process.exit(1);
    }
}

// Run the script
main();
