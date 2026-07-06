// Blog post loader (Astro Content Collections style).
// One zod schema is the single source of truth for post frontmatter: the `Post`
// type is derived from it via z.infer, and every post's frontmatter is validated
// at load/build time so a missing `title`, malformed `date`, etc. fails loudly.
//
// Posts live directly under src/pages and are routed by vocs at /<slug>. Each
// post is either a single file (<slug>.mdx) or a folder (<slug>/index.mdx) —
// both are scanned below. index.mdx (the home/listing page) is excluded.
//
// Runs in Node inside the remark plugin (dev server and llms/markdown-twin
// builds), so posts are read with fs rather than vite's import.meta.glob.

import * as fs from 'node:fs';
import * as path from 'node:path';

import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

export const PostFrontmatter = z.object({
  title: z.string(),
  date: z.iso.date(), // 'YYYY-MM-DD'
  description: z.string().optional(),
  author: z.string().optional(),
});

export type Post = z.infer<typeof PostFrontmatter> & {
  slug: string;
  /** Route path, e.g. `/gm`. */
  href: string;
};

function readFrontmatter(filePath: string): unknown {
  const source = fs.readFileSync(filePath, 'utf-8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parseYaml(match[1]) : {};
}

export function getPosts(pagesDir: string): Post[] {
  const files: { filePath: string; slug: string }[] = [];
  for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.mdx') && entry.name !== 'index.mdx') {
      files.push({ filePath: path.join(pagesDir, entry.name), slug: entry.name.replace(/\.mdx$/, '') });
    } else if (entry.isDirectory()) {
      const indexPath = path.join(pagesDir, entry.name, 'index.mdx');
      if (fs.existsSync(indexPath)) files.push({ filePath: indexPath, slug: entry.name });
    }
  }
  return files
    .map(({ filePath, slug }) => {
      const parsed = PostFrontmatter.safeParse(readFrontmatter(filePath));
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in ${filePath}:\n${z.prettifyError(parsed.error)}`);
      }
      return { slug, href: `/${slug}`, ...parsed.data };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
