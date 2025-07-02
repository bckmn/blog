import { ok, Result } from "neverthrow";

export type PostMetadata = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: string
  published: boolean
};

export async function getAllPosts(): Promise<Result<Array<PostMetadata>, string>> {
  const allPosts: Array<PostMetadata> = [];
  return ok(allPosts);
}
