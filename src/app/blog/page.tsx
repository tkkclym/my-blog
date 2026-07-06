import { BlogList } from "@/components/blog/blog-list";
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const categories = getAllCategories();

  return <BlogList posts={posts} tags={tags} categories={categories} />;
}
