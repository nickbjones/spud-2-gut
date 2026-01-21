export type TagType = {
  id: string; // Indexed from 0
  uid: string; // Ex: 'spicy'

  // form fields
  title: string; // Ex: 'Spicy'
  description: string; // Markdown
  color: string; // #ef00ef
  date: string; // ISO string format (YYYY-MM-DD)
};

// When creating a tag from the frontend.
// The server fills in `id`, `PK`, `SK`, GSI keys automatically.
export type CreateTagRequest = {
  title: string; // Ex: 'Spicy'
  description: string; // Markdown
  color: string; // #ef00ef
};

// What createTag receives on the server, AFTER we inject the id
export interface CreateTagInput extends CreateTagRequest {
  id: string; // server assigned
}

// For PATCH / updating
export type UpdateTagInput = Partial<CreateTagRequest>;
