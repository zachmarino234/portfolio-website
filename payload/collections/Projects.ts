import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
  FieldHook,
} from "payload";
import { revalidatePath } from "next/cache";

import { contentEditor, defaultEditor, onePagerEditor } from "../editors";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

// Fill the slug from the title when it's left empty.
const formatSlug: FieldHook = ({ value, data }) => {
  if (typeof value === "string" && value.trim()) return slugify(value);
  if (typeof data?.title === "string") return slugify(data.title);
  return value;
};

// Publishing (or unpublishing) a project re-renders the pages that show it:
// the home grid, every page footer, the sitemap, and the project page itself.
// This is what replaces "push a commit to see new content".
const revalidateProject = (slugs: (string | null | undefined)[]) => {
  revalidatePath("/", "layout");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/projects/${slug}`);
  }
};

const afterChange: CollectionAfterChangeHook = ({ doc, previousDoc, context }) => {
  if (context.disableRevalidate) return doc;
  const touchesLiveSite =
    doc._status === "published" || previousDoc?._status === "published";
  if (touchesLiveSite) revalidateProject([doc.slug, previousDoc?.slug]);
  return doc;
};

const afterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  if (!context.disableRevalidate) revalidateProject([doc?.slug]);
  return doc;
};

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Project", plural: "Projects" },
  // Drag-and-drop ordering in the admin list (replaces
  // @sanity/orderable-document-list). Read back with `sort: "_order"`.
  orderable: true,
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "deliverableName", "clientWork", "_status", "updatedAt"],
  },
  access: {
    // The public site only ever asks for published projects (see lib/payload.ts).
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Shown in the one-pager and on the home page project card.",
      },
    },
    {
      name: "deliverableName",
      type: "text",
      required: true,
      admin: {
        description:
          "Short name of the final deliverable (e.g. “Fantasy Sportsball”). Used in the footer.",
      },
    },

    // ---- Sidebar ----
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "URL: /projects/<slug>. Filled from the title if left empty.",
      },
      hooks: { beforeValidate: [formatSlug] },
    },
    {
      name: "clientWork",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Client work also appears on the /freelance page.",
      },
    },
    {
      name: "cardColor",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          "Hex color for the home page card, e.g. #2b3a67. Its hue also tints the project page. Leave blank for the default dark card.",
      },
      validate: (value: string | null | undefined) =>
        !value || /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
          ? true
          : "Use a hex color like #2b3a67.",
    },

    {
      type: "tabs",
      tabs: [
        {
          label: "Card",
          fields: [
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: {
                description:
                  "Full-bleed background on the project page and the image on the home page card. Set a focal point to control the card crop.",
              },
            },
            {
              name: "hoverVideo",
              type: "upload",
              relationTo: "media",
              filterOptions: { mimeType: { contains: "video" } },
              admin: {
                description:
                  "Optional. Plays on the home page card on hover. Keep it short, muted and light (a looping mp4).",
              },
            },
            {
              name: "cardTags",
              type: "text",
              hasMany: true,
              minRows: 3,
              maxRows: 3,
              admin: { description: "Exactly three short tags for the card." },
            },
            {
              name: "shortDescription",
              type: "textarea",
              admin: {
                description:
                  "Shown on the home page card and used as the SEO description.",
              },
            },
          ],
        },
        {
          label: "One-pager",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "timeline",
                  type: "text",
                  required: true,
                  admin: { description: "e.g. “6 weeks”.", width: "50%" },
                },
                {
                  name: "team",
                  type: "text",
                  hasMany: true,
                  admin: {
                    description: "e.g. “Zach Marino — Creator”.",
                    width: "50%",
                  },
                },
              ],
            },
            {
              name: "context",
              type: "richText",
              required: true,
              editor: defaultEditor,
              admin: { description: "Where and when the project took place." },
            },
            {
              name: "toolsAndMethods",
              type: "array",
              labels: { singular: "Group", plural: "Groups" },
              admin: {
                description:
                  "Shown as pills. Each group's items become pills; a group with no items shows its category instead.",
              },
              fields: [
                { name: "category", type: "text", required: true },
                { name: "items", type: "text", hasMany: true },
              ],
            },
            {
              name: "brief",
              type: "richText",
              required: true,
              editor: onePagerEditor,
            },
            {
              name: "insights",
              type: "richText",
              required: true,
              editor: onePagerEditor,
            },
            {
              name: "deliverables",
              type: "richText",
              required: true,
              editor: onePagerEditor,
            },
          ],
        },
        {
          label: "Page content",
          fields: [
            {
              name: "content",
              type: "richText",
              editor: contentEditor,
              admin: {
                description:
                  "Everything below the one-pager. Use the + menu for images, carousels, two-column layouts and embeds.",
              },
            },
          ],
        },
      ],
    },
  ],
};
