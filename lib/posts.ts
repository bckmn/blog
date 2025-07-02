import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { Result, fromThrowable } from "neverthrow";
import readingTime from "reading-time";
import { z } from "zod";

const postsDirectory = path.join(process.cwd(), "content/posts");

const PostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  published: z.boolean().default(true),
});

export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  published: boolean;
};

export async function getAllPosts(): Promise<
  Result<Array<PostMetadata>, string>
  > {
  return safeReadDir(postsDirectory).map((filenames) => {
    const postResults = filenames
      .filter((filename) => filename.endsWith(".mdx"))
      .map(processPostFile);

    postResults
      .filter((post) => post.isErr())
      .forEach((post) => console.error(post.error));

    return postResults
      .filter((result) => result.isOk())
      .map((result) => result.value)
      .filter((post) => post.published === true)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  });
}

function processPostFile(filename: string): Result<PostMetadata, string> {
  const slug = filename.replace(".mdx", "");
  const fullpath = path.join(postsDirectory, filename);

  return safeReadFile(fullpath, "utf8")
    .andThen((fileContents) => safeMatter(fileContents))
    .andThen(({ data, content }) =>
      safeParseSchema(data).map((parsedData) => {
        return {
          slug,
          ...parsedData,
          readingTime: readingTime(content).text,
        } satisfies PostMetadata;
      }),
    );
}

function safeReadDir(path: string) {
  return fromThrowable(
    () => fs.readdirSync(path),
    (error) => `Failed to read directory: ${error}`,
  )();
}

const safeReadFile = fromThrowable(
  fs.readFileSync,
  (error) => `Failed to read file: ${error}`,
);

const safeMatter = fromThrowable(
  matter,
  (error) => `Failed to parse frontmatter: ${error}`,
);

const safeParseSchema = fromThrowable(
  PostFrontmatterSchema.parse,
  (error) => `Invalid format of MDX file metadata: ${error}`,
);
