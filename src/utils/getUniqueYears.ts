import { type CollectionEntry } from "astro:content";

export default function getUniqueYears(logs: CollectionEntry<"log">[]) {
  return logs
    .reduce((acc, { slug }) => {
      const year = Number(slug.split("/")[0]);
      if (!acc.includes(year)) {
        acc.push(year);
      }

      return acc;
    }, [] as number[])
    .sort((a, b) => Number(b) - Number(a));
}
