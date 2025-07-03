# Blog

A modern, type-safe blog built with Next.js and TypeScript that reads MDX files from a content directory.

## Features

- 📝 MDX-based blog posts with frontmatter support
- 🎨 Tailwind CSS styling
- 📊 Reading time estimation
- 🏷️ Tag support
- 🔒 Type-safe with Zod validation
- 🚀 Static generation for optimal performance
- ✅ Comprehensive Jest test coverage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### Creating Posts

Create MDX files in the `content/posts/` directory with the following frontmatter:

```yaml
---
title: "Your Post Title"
date: "2024-01-01"
excerpt: "A brief description of your post"
tags: ["tag1", "tag2"]
published: true
---
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
├── app/
│   ├── [slug]/          # Dynamic blog post pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page (blog listing)
├── lib/
│   └── posts.ts         # Post processing utilities
├── content/
│   └── posts/           # MDX blog posts
└── public/              # Static assets
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Content**: MDX with gray-matter
- **Validation**: Zod
- **Error Handling**: neverthrow
- **Testing**: Jest + React Testing Library
- **TypeScript**: Full type safety
