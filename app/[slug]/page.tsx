import { notFound } from "next/navigation";

import { getPostBySlug, getAllPosts, Post } from "@/lib/posts";

type BlogPostParams = {
  slug: string,
};

export async function generateStaticParams(): Promise<Array<BlogPostParams>> {
  const postsResult = await getAllPosts();

  return postsResult.match(
    (posts) => posts.map((post) => ({ slug: post.slug })),
    () => [],
  );
}

export default async function BlogPost({ params }: { params: Promise<BlogPostParams> }) {
  const { slug } = await params;

  return getPostBySlug(slug)
    .then((postResult) => postResult.match(
      (post) => renderBlogPost(post),
      () => notFound(),
    ));
}

function renderBlogPost(post: Post) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600">
          {post.date} • {post.readingTime}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">{post.content}</div>
    </article>
  );
}
