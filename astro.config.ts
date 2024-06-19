import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import remarkTwoslash from "remark-shiki-twoslash";
import mdx from "@astrojs/mdx";
import { remarkInvertImages } from "./src/utils/remarkInvertImages";
import AutoImport from "astro-auto-import";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react({ include: "**/react/*" }),
    sitemap(),
    AutoImport({
      imports: [
        {
          "./src/components/react/Stackblitz.tsx": ["StackBlitz"],
        },
        {
          "./src/components/Code.astro": [["default", "Code"]],
        },
      ],
    }),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [
      remarkToc,
      remarkInvertImages,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
      [
        remarkTwoslash.default,
        {
          themes: ["dark-plus", "light-plus"],
          addTryButton: true,
        },
      ],
    ],
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  scopedStyleStrategy: "where",
});
