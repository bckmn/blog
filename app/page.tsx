import Link from "next/link";

import { getAllPosts, PostMetadata } from "@/lib/posts";

export default async function BlogPage() {
  const result = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {
          result.match(
            (posts) => renderPosts(posts),
            (error) => renderErrorPage(error),
          )
        }
      </div>
    </div>
  );
}

function renderPosts(posts: Array<PostMetadata>) {
  return posts.map((post) => (
    <article key={post.slug} className="border-b pb-6">
      <Link href={`/${post.slug}`}>
        <h2 className="text-2xl font-semibold hover:text-blue-600 mb-2">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-2">{post.excerpt}</p>
      <div className="text-sm text-gray-500">
        {post.date} • {post.readingTime}
      </div>
    </article>
  ));
}

function renderErrorPage(errorMessage: string) {
  return (
    <div>{errorMessage}</div>
  );
}
