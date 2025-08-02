import { RecipeType } from "@/types/recipe";
import { TagType } from "@/types/tag";
import { defaultTagColor, initialTagValues } from "../initialValues";

export const uidRules = /[^a-z0-9 ]/g;

export const generateUid = (title: string, objects: (RecipeType | TagType)[]): string => {
  // generate a new uid from the title
  const base = title
    .toLowerCase()
    .replace(uidRules, '') // remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with hyphens

  // return blank if everything gets filtered out (including Japanese characters), and let the frontend handle it
  if (!base) return '';

  // check if the UID already exists in the recipes
  const existingUids = new Set(objects.map(r => r.uid));
  if (!existingUids.has(base)) return base;

  let suffix = 1;
  let newUid = `${base}-${suffix}`;
  while (existingUids.has(newUid)) {
    suffix++;
    newUid = `${base}-${suffix}`;
  }
  return newUid;
};

export const getNewId = (prefix: string, data: { id: string }[]): string => {
  const maxId = data.reduce((max, item) => {
    const num = parseInt(item.id.replace(`${prefix}#`, ''), 10);
    return num > max ? num : max;
  }, 0);

  const nextId = (maxId + 1).toString().padStart(3, '0');
  return `${prefix}#${nextId}`;
}

export const getTagByUid = (uid: string | null | undefined, list: TagType[]): TagType => {
  if (!uid || !list || list.length === 0) return initialTagValues;
  return list.find(item => item.uid === uid) || initialTagValues;
};

// replace with getTagByUid?
export const getTitleByUid = (uid: string | null | undefined, list: TagType[]): string => {
  if (!uid || !list || list.length === 0) return '';
  return list.find(item => item.uid === uid)?.title || uid;
};

export const getRecipesByTag = (recipes: RecipeType[], tag: string): RecipeType[] => {
  return recipes.filter((recipe) => recipe.tags.includes(tag));
}

export const getTextColorForBackground = (hex: string = defaultTagColor): 'black' | 'white' => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Standard luminance formula
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 186 ? 'black' : 'white'; // Threshold tweakable
}

export const getTagColor = (color: string) => {
  return {
    backgroundColor: color,
    color: getTextColorForBackground(color),
  };
}

export function doesTagTitleExist(tags: TagType[] = [], titleToFind: string): boolean {
  return tags.some(tag => tag.title === titleToFind);
}
