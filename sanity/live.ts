import { defineLive } from "next-sanity/live";
import { client } from "./lib/client";

const serverToken = process.env.SANITY_VIEWER_TOKEN;
const browserToken = process.env.NEXT_PUBLIC_SANITY_VIEWER_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken,
  browserToken,
});
