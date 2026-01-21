export type RecipeType = {
  id: string; // Indexed from 0
  uid: string; // Ex: 'mashed-potatoes'

  // form fields
  title: string; // Ex: 'Mashed Potatoes'
  description: string; // Markdown
  ingredients: string; // Markdown
  instructions: string; // Markdown
  reference: string;
  tags: string[];
  date: string; // ISO string format (YYYY-MM-DD)
  isPinned: boolean;
  cookCount: string;
};

// When creating a recipe from the frontend.
// The server fills in `id`, `PK`, `SK`, GSI keys automatically.
export type CreateRecipeRequest = {
  title: string; // Ex: 'Mashed Potatoes'
  description: string; // Markdown
  ingredients: string; // Markdown
  instructions: string; // Markdown
  reference: string;
  tags: string[];
  date: string; // ISO string format (YYYY-MM-DD)
  isPinned: boolean;
  cookCount: string;
};

// What createRecipe receives on the server, AFTER we inject the id
export interface CreateRecipeInput extends CreateRecipeRequest {
  id: string; // server assigned
}

// For PATCH / updating
export type UpdateRecipeInput = Partial<CreateRecipeRequest>;
