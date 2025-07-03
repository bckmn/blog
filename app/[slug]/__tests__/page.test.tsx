import { render, screen } from "@testing-library/react";
import { ok, err } from "neverthrow";
import { notFound } from "next/navigation";

import BlogPost, { generateStaticParams } from "../page";

import { getPostBySlug, getAllPosts, Post, PostMetadata } from "@/lib/posts";

jest.mock("@/lib/posts");
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

const mockedGetPostBySlug = jest.mocked(getPostBySlug);
const mockedGetAllPosts = jest.mocked(getAllPosts);
const mockedNotFound = jest.mocked(notFound);

const mockPost: Post = {
  slug: "test-post",
  title: "Test Post",
  content: "# Test Content\n\nThis is a test post content.",
  date: "2024-01-01",
  excerpt: "This is a test post excerpt",
  tags: ["react", "testing"],
  readingTime: "5 min read",
  published: true,
};

const mockPosts: PostMetadata[] = [
  {
    slug: "test-post-1",
    title: "Test Post 1",
    date: "2024-01-01",
    excerpt: "This is the first test post excerpt",
    tags: ["react", "testing"],
    readingTime: "5 min read",
    published: true,
  },
  {
    slug: "test-post-2",
    title: "Test Post 2",
    date: "2024-01-02",
    excerpt: "This is the second test post excerpt",
    tags: ["nextjs", "jest"],
    readingTime: "3 min read",
    published: true,
  },
];

describe("BlogPost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders post when getPostBySlug returns success", async () => {
    mockedGetPostBySlug.mockResolvedValue(ok(mockPost));

    render(await BlogPost({ params: Promise.resolve({ slug: "test-post" }) }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Post");
    expect(screen.getByText("2024-01-01 • 5 min read")).toBeInTheDocument();
    expect(screen.getByText(/Test Content/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test post content/)).toBeInTheDocument();
  });

  it("calls notFound when getPostBySlug returns error", async () => {
    mockedGetPostBySlug.mockResolvedValue(err("Post not found"));

    await BlogPost({ params: Promise.resolve({ slug: "nonexistent" }) });

    expect(mockedNotFound).toHaveBeenCalled();
  });

  it("renders post content in prose container", async () => {
    mockedGetPostBySlug.mockResolvedValue(ok(mockPost));

    render(await BlogPost({ params: Promise.resolve({ slug: "test-post" }) }));

    const proseContainer = screen.getByText(/Test Content/).closest("div");
    expect(proseContainer).toHaveClass("prose", "prose-lg", "max-w-none");
  });

  it("renders post within article element", async () => {
    mockedGetPostBySlug.mockResolvedValue(ok(mockPost));

    render(await BlogPost({ params: Promise.resolve({ slug: "test-post" }) }));

    const article = screen.getByRole("article");
    expect(article).toHaveClass("max-w-4xl", "mx-auto", "px-4", "py-8");
  });
});

describe("generateStaticParams", () => {
  it("returns static params when getAllPosts returns success", async () => {
    mockedGetAllPosts.mockResolvedValue(ok(mockPosts));

    const result = await generateStaticParams();

    expect(result).toEqual([
      { slug: "test-post-1" },
      { slug: "test-post-2" },
    ]);
  });

  it("returns empty array when getAllPosts returns error", async () => {
    mockedGetAllPosts.mockResolvedValue(err("Failed to load posts"));

    const result = await generateStaticParams();

    expect(result).toHaveLength(0);
  });

  it("returns empty array when no posts exist", async () => {
    mockedGetAllPosts.mockResolvedValue(ok([]));

    const result = await generateStaticParams();

    expect(result).toEqual([]);
  });
});
