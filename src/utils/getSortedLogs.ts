import type { CollectionEntry } from "astro:content";

const getSortedLogs = (logs: CollectionEntry<"log">[]) => {
  return logs
    .filter(log => !log.data.draft)
    .sort(
      (a, b) =>
        new Date(b.slug.split("/").join("-")).getTime() -
        new Date(a.slug.split("/").join("-")).getTime()
    );
};

export default getSortedLogs;
