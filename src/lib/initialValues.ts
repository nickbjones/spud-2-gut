import { RecipeType } from '@/types/recipe';
import { TagType } from '@/types/tag';

export const dateToday = new Date().toISOString().split('T')[0];

export const defaultTagColor = '#ffffff';

export const initialRecipeValues: RecipeType = {
  id: '',
  title: '',
  uid: '',
  tags: [],
  date: dateToday,
  description: '',
  ingredients: '',
  instructions: '',
  reference: '',
  isPinned: false,
};

export const initialTagValues: TagType = {
  id: '',
  uid: '',
  title: '',
  description: '',
  color: defaultTagColor,
  date: dateToday,
};
