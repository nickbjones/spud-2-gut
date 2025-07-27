import { RecipeType } from "@/types/recipe";
import { TagType } from "@/types/tag";

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

export const getTitleByUid = (uid: string | null | undefined, list: TagType[]): string => {
  if (!uid || !list || list.length === 0) return '';
  return list.find(item => item.uid === uid)?.title || uid;
};
