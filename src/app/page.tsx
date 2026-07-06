import { Hero } from "@/components/home/hero";
import { Skills } from "@/components/home/skills";
import { Timeline } from "@/components/home/timeline";
import { LatestPosts } from "@/components/home/latest-posts";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <>
      <Hero />
      <Skills />
      <Timeline />
      <LatestPosts posts={posts} />
    </>
  );
}
