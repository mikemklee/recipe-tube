export interface RecipeIngredient {
    quantity: string | number | null; // e.g., "1", "1/2", "pinch"
    unit: string | null; // e.g., "cup", "tbsp", "clove", "g", "ml"
    name: string; // e.g., "flour", "garlic", "olive oil"
    preparation?: string; // e.g., "chopped", "minced", "melted"
  }
  
  export interface RecipeInstruction {
    step: number;
    description: string;
  }
  
  export interface Recipe {
    title: string;
    description?: string; // Optional description
    prepTime?: string; // e.g., "15 minutes"
    cookTime?: string; // e.g., "30 minutes"
    totalTime?: string; // e.g., "45 minutes"
    servings?: string; // e.g., "4 servings"
    ingredients: RecipeIngredient[];
    instructions: RecipeInstruction[];
    sourceUrl: string; // Original YouTube URL
    videoTitle?: string; // Title fetched from YouTube (optional)
  }

  export interface SavedRecipe extends Recipe {
    id: string;
    savedAt: string;
  }
  
  export interface ApiError {
    message: string;
  }