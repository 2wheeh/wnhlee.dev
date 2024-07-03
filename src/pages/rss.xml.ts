import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";
import getSortedLogs from "@utils/getSortedLogs";

const PREFIX_MAP = {
  blog: "posts",
  log: "logs",
};

function generateRSSItems(
  type: "blog" | "log",
  content: CollectionEntry<"blog" | "log">[]
) {
  const prefix = PREFIX_MAP[type];

  return content.map(({ data, slug }) => ({
    link: `${prefix}/${slug}/`,
    title: data.title,
    description: data.description,
    pubDate: new Date(data.modDatetime ?? data.pubDatetime),
  }));
}

export async function GET() {
  const posts = await getCollection("blog");
  const logs = await getCollection("log");

  const sortedPosts = getSortedPosts(posts);
  const sortedLogs = getSortedLogs(logs);

  const postItems = generateRSSItems("blog", sortedPosts);
  const logItems = generateRSSItems("log", sortedLogs);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: [...postItems, ...logItems],
  });
}
