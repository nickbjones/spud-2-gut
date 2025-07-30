export type TagType = {
  id: string; // Indexed from 0
  uid: string; // Ex: 'spicy'
  title: string; // Ex: 'Spicy'
  description?: string; // Markdown
  color?: string; // #ef00ef
  date: string; // ISO string format (YYYY-MM-DD)
};
