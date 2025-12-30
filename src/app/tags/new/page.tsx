/**
 * New Tag server page
 */
import NewTagClientPage from './NewTagClientPage';

export default async function NewTagPage() {
  // recipes and tags are prefetched in layout.tsx
  // no page-level prefetch needed
  // render the client page directly
  return <NewTagClientPage />;
}
