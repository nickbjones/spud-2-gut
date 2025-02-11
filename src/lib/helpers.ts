// Function to generate a slug from the title
export const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric characters
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
