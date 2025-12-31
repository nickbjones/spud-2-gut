import { RecipeType } from '@/types/recipe';
import { TagType } from '@/types/tag';

export const dateToday = new Date().toISOString().split('T')[0];

export const defaultTagColor = '#ffffff';

export const initialRecipeValues: RecipeType = {
  id: '',
  uid: '',
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  reference: '',
  tags: [],
  date: dateToday,
  isPinned: false,
  cookCount: '0',
};

export const initialTagValues: TagType = {
  id: '',
  uid: '',
  title: '',
  description: '',
  color: defaultTagColor,
  date: dateToday,
};
