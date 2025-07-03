import fs from "fs";

import { getAllPosts, PostMetadata } from "../posts";

jest.mock("fs");
const mockFs = fs as jest.Mocked<typeof fs> & {
  readdirSync: jest.MockedFunction<(path: string) => string[]>;
};

describe("posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllPosts", () => {
    it("should return empty array when no mdx files exist", async () => {
      mockFs.readdirSync.mockReturnValue(["README.md", "config.json"]);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toEqual([]);
      }
    });

    it("should return error when directory cannot be read", async () => {
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error("Permission denied");
      });

      const result = await getAllPosts();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toContain("Failed to read directory");
      }
    });

    it("should filter out unpublished posts", async () => {
      mockFs.readdirSync.mockReturnValue(["published.mdx", "unpublished.mdx"]);

      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Published Post"
date: "2023-01-01"
excerpt: "This is published"
tags: ["test"]
published: true
---
# Published content`)
        .mockReturnValueOnce(`---
title: "Unpublished Post"
date: "2023-01-02"
excerpt: "This is unpublished"
tags: ["test"]
published: false
---
# Unpublished content`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]!.title).toBe("Published Post");
      }
    });

    it("should sort posts by date (newest first)", async () => {
      mockFs.readdirSync.mockReturnValue(["old.mdx", "new.mdx"]);

      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Old Post"
date: "2023-01-01"
excerpt: "Old post"
tags: ["test"]
---
# Old content`)
        .mockReturnValueOnce(`---
title: "New Post"
date: "2023-01-02"
excerpt: "New post"
tags: ["test"]
---
# New content`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0]!.title).toBe("New Post");
        expect(result.value[1]!.title).toBe("Old Post");
      }
    });

    it("should include reading time calculation", async () => {
      mockFs.readdirSync.mockReturnValue(["post.mdx"]);

      mockFs.readFileSync.mockReturnValue(`---
title: "Test Post"
date: "2023-01-01"
excerpt: "Test excerpt"
tags: ["test"]
---
# Test Content
This is a test post with some content that should have a reading time calculated.`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]!.readingTime).toBeDefined();
        expect(typeof result.value[0]!.readingTime).toBe("string");
      }
    });

    it("should generate correct slug from filename", async () => {
      mockFs.readdirSync.mockReturnValue(["my-awesome-post.mdx"]);

      mockFs.readFileSync.mockReturnValue(`---
title: "My Awesome Post"
date: "2023-01-01"
excerpt: "Test excerpt"
tags: ["test"]
---
# Content`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]!.slug).toBe("my-awesome-post");
      }
    });

    it("should handle posts with default published value", async () => {
      mockFs.readdirSync.mockReturnValue(["post.mdx"]);

      mockFs.readFileSync.mockReturnValue(`---
title: "Test Post"
date: "2023-01-01"
excerpt: "Test excerpt"
tags: ["test"]
---
# Content`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]!.published).toBe(true);
      }
    });

    it("should handle invalid frontmatter gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockFs.readdirSync.mockReturnValue(["valid.mdx", "invalid.mdx"]);

      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Valid Post"
date: "2023-01-01"
excerpt: "Valid excerpt"
tags: ["test"]
---
# Valid content`)
        .mockReturnValueOnce(`---
title: 123
date: "invalid-date"
excerpt: null
tags: "not-an-array"
---
# Invalid content`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]!.title).toBe("Valid Post");
      }
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle file read errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockFs.readdirSync.mockReturnValue(["valid.mdx", "error.mdx"]);

      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Valid Post"
date: "2023-01-01"
excerpt: "Valid excerpt"
tags: ["test"]
---
# Valid content`)
        .mockImplementation((filepath) => {
          if (filepath.toString().includes("error.mdx")) {
            throw new Error("File not found");
          }
          throw new Error("Unexpected call");
        });

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(1);
        expect(result.value[0]!.title).toBe("Valid Post");
      }
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should return PostMetadata with correct structure", async () => {
      mockFs.readdirSync.mockReturnValue(["post.mdx"]);

      mockFs.readFileSync.mockReturnValue(`---
title: "Test Post"
date: "2023-01-01"
excerpt: "Test excerpt"
tags: ["javascript", "testing"]
published: true
---
# Test Content`);

      const result = await getAllPosts();

      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const post = result.value[0];
        expect(post).toEqual({
          slug: "post",
          title: "Test Post",
          date: "2023-01-01",
          excerpt: "Test excerpt",
          tags: ["javascript", "testing"],
          published: true,
          readingTime: expect.any(String),
        } satisfies PostMetadata);
      }
    });
  });
});
