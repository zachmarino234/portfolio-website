import type { Block } from "payload";

export const EmbedBlock: Block = {
  slug: "embed",
  interfaceName: "EmbedBlock",
  labels: { singular: "Embed (iframe)", plural: "Embeds" },
  fields: [
    {
      name: "title",
      type: "text",
      admin: { description: "Short label, e.g. “Demo video”." },
    },
    {
      name: "url",
      type: "text",
      required: true,
      admin: {
        description:
          "Embed URL (e.g. https://www.youtube.com/embed/…, a Figma embed). Not the full <iframe> HTML.",
      },
      validate: (value: string | null | undefined) => {
        if (!value) return "An embed URL is required.";
        try {
          const { protocol } = new URL(value);
          return protocol === "https:" || protocol === "http:"
            ? true
            : "Use an http(s) URL.";
        } catch {
          return "Enter a valid URL.";
        }
      },
    },
  ],
};
