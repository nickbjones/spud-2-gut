export const uidRules = /[^a-z0-9 ]/g;

export const generateUid = (title: string, objects: any[]): string => {
  // generate a new uid from the title
  const base = title
    .toLowerCase()
    .replace(uidRules, '') // remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-'); // replace spaces with hyphens

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
