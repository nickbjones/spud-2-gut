export const uidRules = /[^a-z0-9 ]/g;

// Function to generate a slug from the title
export const generateUid = (text: string): string =>
  text
    .toLowerCase()
    .replace(uidRules, '') // Remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
