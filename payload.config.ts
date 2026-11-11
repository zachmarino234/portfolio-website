import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Projects } from "./payload/collections/Projects";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { defaultEditor } from "./payload/editors";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  secret: process.env.PAYLOAD_SECRET || "",

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · zmarino.com",
    },
  },

  collections: [Projects, Media, Users],
  editor: defaultEditor,

  // The site reads content through the Local API (server components), so the
  // GraphQL endpoint isn't needed.
  graphQL: { disable: true },

  db: postgresAdapter({
    migrationDir: path.resolve(dirname, "migrations"),
    pool: {
      // The Vercel <> Neon integration sets DATABASE_URL (pooled) and
      // POSTGRES_URL; either works.
      connectionString:
        process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
    },
  }),

  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        // Serve files straight from the Blob CDN instead of proxying them
        // through Payload's /api/media/file route.
        media: { disablePayloadAccessControl: true },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Upload from the browser directly to Blob. Without this, uploads go
      // through a Vercel function and anything over ~4.5MB (hover videos)
      // fails.
      clientUploads: true,
    }),
  ],

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
