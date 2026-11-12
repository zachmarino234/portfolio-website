# Sanity → Payload migration

This branch replaces Sanity with Payload 3, running inside the same Next.js app
on Vercel, with Neon Postgres for data and Vercel Blob for images and videos.
The admin lives at `/admin`. Publishing a project re-renders the affected pages
right away, so no more pushing a commit to see new content.

The site looks and behaves the same: same components, same classes, same
ordering. Only the data source changed.

> **Not yet run.** This code was written without network access, so it hasn't
> been through `npm install`, a type-check or a build. Expect a few type fixes
> in step 3. Most likely spots: `components/RichText.tsx` (Lexical converter
> types) and `lib/payload.ts`.

## What changed

| Before (Sanity) | After (Payload) |
| --- | --- |
| `sanity/schemas/*` | `payload/collections/*`, `payload/blocks/*` |
| Portable Text + `PortableTextRenderer` | Lexical rich text + `components/RichText.tsx` |
| `sanityFetch` / GROQ in each component | `lib/payload.ts` (Local API) |
| Hotspot + `urlFor().width()` | Focal point + generated sizes (`card` 1800×840, `xl` 2000w) |
| `cardColor.hsl` | `cardColor` hex; hue derived in `lib/projectTheme.ts` |
| Orderable document list | `orderable: true` (drag rows in the admin list) |
| Draft mode / Presentation tool | Payload drafts (save without publishing) |
| Hardcoded sitemap | Sitemap built from published projects |

The site's routes moved to `app/(frontend)/`. `app/(payload)/` holds the admin
and the API. Both are route groups, so URLs don't change.

New field: **Client work** (sidebar checkbox) for the `/freelance` page.
Nothing reads it yet.

## Steps

### 1. Dependencies

```bash
npm uninstall sanity next-sanity @sanity/color-input @sanity/image-url \
  @sanity/orderable-document-list @sanity/vision @portabletext/react styled-components

npm install payload @payloadcms/next @payloadcms/richtext-lexical \
  @payloadcms/db-postgres @payloadcms/storage-vercel-blob sharp
```

Keep every `payload` / `@payloadcms/*` package on the same version. The site
is on Next 16, so use a current Payload 3 release.

### 2. Databases and env

- In the Vercel project for zmarino.com: **Storage → connect Neon** and
  **Storage → create a Blob store**. Both set their env vars automatically.
- Add `PAYLOAD_SECRET` (`openssl rand -hex 32`) and `NEXT_PUBLIC_SERVER_URL`
  for each environment.
- In Neon, create a `dev` branch of the database and put its connection
  string in `.env.local` as `DATABASE_URL`. In development, Payload changes
  the database schema automatically ("push" mode). The branch keeps that away
  from production.
- `vercel env pull .env.local` gets you the Blob token, then swap in the dev
  `DATABASE_URL`. See `.env.example`.

### 3. Generate files and check it compiles

```bash
npm run generate:importmap   # registers the Blob client-upload handler
npm run generate:types       # writes payload-types.ts (commit it)
npx tsc --noEmit
```

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000/admin and create your user. The tables are created
on first boot.

### 5. Migrate content into the dev database

```bash
npm run migrate:sanity
```

This reads published projects from Sanity (`4hlhry87` / `production`), uploads
every image and video to Blob, converts the rich text and saves each project.
You can re-run it: media is matched by Sanity asset id and projects by slug,
so nothing gets duplicated. Any project that fails validation (e.g. a required
field was empty in Sanity) is saved as a **draft** and flagged in the summary
table.

Then check every project page against the live site. Pay most attention to
links, lists, carousels, the columns blocks, and the card crops. If a crop is
off, adjust the image's focal point in **Media**.

### 6. Production

```bash
npx payload migrate:create initial   # commit the generated /migrations folder
```

- Set the Vercel **Build Command** to `npm run ci`. It runs
  `payload migrate && next build`, so production gets its schema from
  migrations instead of push mode.
- Deploy the branch as a preview. Then run the content migration against the
  **production** database:
  `DATABASE_URL="<prod connection string>" npm run migrate:sanity`
- Log into the preview's `/admin`, create your production user, and check the
  site. Then merge.

### 7. Clean up after a week or so

- Remove the `SANITY_*` / `NEXT_PUBLIC_SANITY_*` env vars from Vercel.
- Undeploy the Sanity Studio (`*.sanity.studio`) and archive the project.
- Delete the `sanityAssetId` field from `Media` and `scripts/` if you like
  (needs a `payload migrate:create`).

## Day-to-day

- **Edit content:** `/admin` → Projects. Use *Save draft* to work in progress,
  then *Publish* to go live. The home page, footer, sitemap and that project's
  page re-render within seconds.
- **Reorder projects:** drag rows in the Projects list.
- **Schema changes:** edit `payload/…`, run `npm run generate:types`, then
  `npx payload migrate:create <name>` before deploying.
