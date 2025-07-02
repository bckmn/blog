import { render, screen } from "@testing-library/react";
import { ok, err } from "neverthrow";

import BlogPage from "../page";

import { getAllPosts, PostMetadata } from "@/lib/posts";

jest.mock("@/lib/posts");

const mockedGetAllPosts = jest.mocked(getAllPosts);

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

describe("BlogPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the blog title", async () => {
    mockedGetAllPosts.mockResolvedValue(ok(mockPosts));

    render(await BlogPage());

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Blog");
  });

  it("renders posts when getAllPosts returns success", async () => {
    mockedGetAllPosts.mockResolvedValue(ok(mockPosts));

    render(await BlogPage());

    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    expect(screen.getByText("This is the first test post excerpt")).toBeInTheDocument();
    expect(screen.getByText("This is the second test post excerpt")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01 • 5 min read")).toBeInTheDocument();
    expect(screen.getByText("2024-01-02 • 3 min read")).toBeInTheDocument();
  });

  it("renders post links correctly", async () => {
    mockedGetAllPosts.mockResolvedValue(ok(mockPosts));

    render(await BlogPage());

    const link1 = screen.getByRole("link", { name: "Test Post 1" });
    const link2 = screen.getByRole("link", { name: "Test Post 2" });

    expect(link1).toHaveAttribute("href", "/test-post-1");
    expect(link2).toHaveAttribute("href", "/test-post-2");
  });

  it('renders "No posts available" when posts array is empty', async () => {
    mockedGetAllPosts.mockResolvedValue(ok([]));

    render(await BlogPage());

    expect(screen.getByText("No posts available")).toBeInTheDocument();
  });

  it("renders error message when getAllPosts returns error", async () => {
    const errorMessage = "Failed to load posts";
    mockedGetAllPosts.mockResolvedValue(err(errorMessage));

    render(await BlogPage());

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
