import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import aboutOgImage from "./og-templates/about";
import fs from "fs/promises";

const fontPath = (
  fileName: TemplateStringsArray,
  ...interpolations: string[]
) => `src/assets/fonts/${String.raw(fileName, ...interpolations)}`;

const fetchFonts = async () => {
  // Regular Font
  const monoFileRegular = await fetch(
    "https://www.1001fonts.com/download/font/ibm-plex-mono.regular.ttf"
  );
  const monoRegular: ArrayBuffer = await monoFileRegular.arrayBuffer();

  // Bold Font
  const monoFileBold = await fetch(
    "https://www.1001fonts.com/download/font/ibm-plex-mono.bold.ttf"
  );
  const monoBold: ArrayBuffer = await monoFileBold.arrayBuffer();

  // Fallback Font (Pretendard) for Korean
  const pretendardRegular = await fs.readFile(fontPath`PretendardRegular.ttf`);
  const pretendardBold = await fs.readFile(fontPath`PretendardBold.ttf`);

  return { monoRegular, monoBold, pretendardRegular, pretendardBold };
};

const { monoRegular, monoBold, pretendardRegular, pretendardBold } =
  await fetchFonts();

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "IBM Plex Mono",
      data: monoRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Mono",
      data: monoBold,
      weight: 600,
      style: "normal",
    },
    {
      name: "Pretendard",
      data: pretendardRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "Pretendard",
      data: pretendardBold,
      weight: 600,
      style: "normal",
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForAbout() {
  const svg = await satori(aboutOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
