/**
 * Tags server page
 */
import TagsClientPage from './TagsClientPage';

export default async function TagsPage() {
  // recipes and tags are prefetched in layout.tsx
  // no page-level prefetch needed
  // render the client page directly
  return <TagsClientPage />;
}
