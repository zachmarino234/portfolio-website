// sanity/lib/image.ts
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Install these packages:
// npm install @portabletext/react @sanity/image-url next-sanity

// Add to .env.local:
// NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
// NEXT_PUBLIC_SANITY_DATASET=production