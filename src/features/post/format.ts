// Shared formatting helpers for post metadata, reused by the post list and the
// post-header byline.

/** Format an ISO date ('YYYY-MM-DD') as e.g. "March 26, 2026" (UTC, stable). */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Parse a markdown-link author string `[text](url)` into its parts. */
export function parseAuthor(author: string): { text: string; url?: string } {
  const match = author.match(/\[(.+)\]\((.+)\)/);
  return match ? { text: match[1], url: match[2] } : { text: author };
}
