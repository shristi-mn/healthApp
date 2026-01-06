// Recipe Types
export interface Macros {
    protein: number; // grams
    carbs: number; // grams
    fats: number; // grams
    calories: number;
}

export interface Ingredient {
    id: string;
    name: string;
    category: 'protein' | 'vegetable' | 'grain' | 'dairy' | 'spice' | 'herb' | 'condiment' | 'fat' | 'oil' | 'legume' | 'nut' | 'fruit' | 'other';
}

export interface RecipeIngredient {
    ingredient: Ingredient;
    quantity: string; // e.g., "2 cups", "100g"
    optional: boolean;
}

export type CuisineType = 'indian' | 'western';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Recipe {
    id: string;
    name: string;
    cuisine: CuisineType;
    mealTypes: MealType[];
    prepTime: number; // minutes
    cookTime: number; // minutes
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    instructions: string[];
    ingredients: RecipeIngredient[];
    macros: Macros;
    imageUrl?: string;
    tags: string[]; // e.g., ['high-protein', 'low-carb', 'vegetarian']
}

// Recipe Matching
export interface RecipeMatch {
    recipe: Recipe;
    matchScore: number; // 0-1, 1 being perfect match
    missingIngredients: Ingredient[];
    availableIngredients: Ingredient[];
    aiReasoning?: string; // AI explanation for why this recipe is recommended
}

// AI Recommendation Request
export interface RecommendationRequest {
    availableIngredients: string[];
    mealType?: MealType;
    preferHighProtein?: boolean;
    maxPrepTime?: number;
    cuisine?: CuisineType;
}

// Navigation Types
export type RootStackParamList = {
    Home: undefined;
    RecipeList: {
        mealType?: MealType;
        ingredients?: string[];
    };
    RecipeDetail: {
        recipeId: string;
    };
    IngredientSelector: undefined;
    Favorites: undefined;
};
