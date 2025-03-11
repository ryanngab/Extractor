import { getAllTags } from "@/lib/markdown";
import { TagsList } from "./tags-list";

export default async function TagsPage() {
  const tags = await getAllTags();
  return <TagsList tags={tags} />;
}
