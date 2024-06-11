import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  slug: CollectionEntry<"log">["slug"];
  frontmatter: CollectionEntry<"log">["data"];
  secHeading?: boolean;
}

export default function LogCard({
  href,
  slug,
  frontmatter,
  secHeading = true,
}: Props) {
  const { title, description } = frontmatter;

  const pubDatetime = new Date(slug.split("/").join("-"));

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime pubDatetime={pubDatetime} modDatetime={null} skipTime />
      <p>{description}</p>
    </li>
  );
}
