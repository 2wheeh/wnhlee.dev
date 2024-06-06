import type { APIRoute } from "astro";
import { generateOgImageForAbout } from "@utils/generateOgImages";

export const GET: APIRoute = async () =>
  new Response(await generateOgImageForAbout(), {
    headers: { "Content-Type": "image/png" },
  });
