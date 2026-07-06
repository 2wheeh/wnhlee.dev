// Remark plugin implementing the `::blog-posts` and `::authors` leaf directives
// (a revival of vocs v1's built-ins, but at the MDX-source level so BOTH vocs
// output pipelines work from one source):
//
// Each directive is replaced by a single mdast node carrying two representations:
// - its regular mdast children — what remark-stringify emits for the markdown
//   twin (`/assets/md/*.md`) and llms.txt;
// - `data.hName`/`data.hProperties`/`data.hChildren` — the exact HTML the React
//   page renders, styled by the classes in src/pages/_root.css. hChildren
//   replaces the generated children wholesale, so the card markup is free-form.
//
// `remark-directive` (registered alongside this plugin in vocs.config.ts) only
// parses the `::name` syntax into `leafDirective` nodes; this plugin defines
// what those names expand to.

import * as path from 'node:path';

import { parse as parseYaml } from 'yaml';

import { formatDate, parseAuthor } from './format';
import { getPosts, type Post } from './posts';

type Hast =
  | { type: 'text'; value: string }
  | { type: 'element'; tagName: string; properties: Record<string, unknown>; children: Hast[] };

type Mdast = { type: string; [key: string]: unknown };

const text = (value: string): Hast => ({ type: 'text', value });
const el = (tagName: string, properties: Record<string, unknown>, children: Hast[]): Hast => ({
  type: 'element',
  tagName,
  properties,
  children,
});

/** Author frontmatter (`[text](url)` or plain text) as mdast phrasing content. */
function authorPhrasing(author: string): Mdast {
  const parsed = parseAuthor(author);
  return parsed.url
    ? { type: 'link', url: parsed.url, children: [{ type: 'text', value: parsed.text }] }
    : { type: 'text', value: parsed.text };
}

function blogPostsNode(posts: Post[]): Mdast {
  const cards: Hast[] = [];
  posts.forEach((post, index) => {
    const author = post.author ? parseAuthor(post.author) : null;
    cards.push(
      // The whole post is a single <a>, so the entire card (whitespace included)
      // is clickable with a pointer cursor.
      el('a', { className: ['vocs-blog-post'], href: post.href }, [
        // div, not h2: styling is class-based so it looks identical, and it keeps
        // rehype-slug/autolink-headings from injecting an anchor inside the card link.
        el('div', { className: ['vocs-blog-post-title'] }, [text(post.title)]),
        el('div', { className: ['vocs-blog-post-meta'] }, [
          text(formatDate(post.date)),
          ...(author
            ? [text(' by '), el('span', { className: ['vocs-blog-post-authors'] }, [text(author.text)])]
            : []),
        ]),
        ...(post.description
          ? [
              el('p', { className: ['vocs-blog-post-description'] }, [
                text(`${post.description} `),
                el('span', { className: ['vocs-blog-post-readmore'] }, [text('[→]')]),
              ]),
            ]
          : []),
      ]),
    );
    if (index < posts.length - 1) cards.push(el('hr', { className: ['vocs-blog-post-divider'] }, []));
  });

  return {
    type: 'list',
    ordered: false,
    spread: false,
    children: posts.map((post) => ({
      type: 'listItem',
      spread: false,
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'link', url: post.href, children: [{ type: 'text', value: post.title }] },
            { type: 'text', value: ` — ${formatDate(post.date)}` },
            ...(post.author ? [{ type: 'text', value: ' by ' }, authorPhrasing(post.author)] : []),
            ...(post.description ? [{ type: 'text', value: ` — ${post.description}` }] : []),
          ],
        },
      ],
    })),
    data: { hName: 'div', hProperties: { className: ['vocs-blog-posts'] }, hChildren: cards },
  };
}

function authorsNode(frontmatter: Record<string, unknown>): Mdast | null {
  const author = typeof frontmatter['author'] === 'string' ? frontmatter['author'] : undefined;
  const date = typeof frontmatter['date'] === 'string' ? frontmatter['date'] : undefined;
  if (!author && !date) return null;
  const parsed = author ? parseAuthor(author) : null;

  const mdChildren: Mdast[] = [];
  const hChildren: Hast[] = [];
  if (date) {
    mdChildren.push({ type: 'text', value: formatDate(date) });
    hChildren.push(text(formatDate(date)));
  }
  if (author && parsed) {
    const lead = date ? ' by ' : 'By ';
    mdChildren.push({ type: 'text', value: lead }, authorPhrasing(author));
    hChildren.push(
      text(lead),
      parsed.url
        ? el('a', { href: parsed.url, target: '_blank', rel: ['noopener', 'noreferrer'] }, [text(parsed.text)])
        : text(parsed.text),
    );
  }

  return {
    type: 'paragraph',
    children: mdChildren,
    data: { hName: 'div', hProperties: { className: ['vocs-authors'] }, hChildren },
  };
}

/** Page frontmatter, wherever the current pipeline put it: the react pipeline
 * keeps the yaml node in the tree; the txt (llms/markdown twin) pipeline strips
 * it but sets `file.data.frontmatter` instead. */
function getFrontmatter(
  tree: { children: Mdast[] },
  file: { data?: Record<string, unknown> },
): Record<string, unknown> {
  const yamlNode = tree.children.find((node) => node.type === 'yaml');
  if (yamlNode && typeof yamlNode['value'] === 'string') return parseYaml(yamlNode['value']) ?? {};
  const fromFile = file.data?.['frontmatter'];
  return fromFile && typeof fromFile === 'object' ? (fromFile as Record<string, unknown>) : {};
}

export function remarkPostDirectives() {
  return (tree: { children: Mdast[] }, file: { cwd?: string; data?: Record<string, unknown> }) => {
    const pagesDir = path.resolve(file.cwd ?? process.cwd(), 'src/pages');
    const frontmatter = getFrontmatter(tree, file);

    const transform = (children: Mdast[]) => {
      for (let i = children.length - 1; i >= 0; i--) {
        const node = children[i];
        if (node.type === 'leafDirective' && node['name'] === 'blog-posts') {
          children.splice(i, 1, blogPostsNode(getPosts(pagesDir)));
        } else if (node.type === 'leafDirective' && node['name'] === 'authors') {
          const replacement = authorsNode(frontmatter);
          if (replacement) children.splice(i, 1, replacement);
          else children.splice(i, 1);
        } else if (Array.isArray(node['children'])) {
          transform(node['children'] as Mdast[]);
        }
      }
    };
    transform(tree.children);
  };
}
