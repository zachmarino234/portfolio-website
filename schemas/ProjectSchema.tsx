import Script from 'next/script'

interface ProjectSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  dateCreated?: string
  keywords?: string[]
  organization?: string
  role?: string
}

export function ProjectSchema({
  name,
  description,
  url,
  image,
  dateCreated,
  keywords = [],
  organization,
  role,
}: ProjectSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    creator: {
      '@type': 'Person',
      name: 'Zach Marino',
      url: 'https://zmarino.com',
    },
    ...(image && { image }),
    ...(dateCreated && { dateCreated }),
    ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
    ...(organization && {
      sourceOrganization: {
        '@type': 'Organization',
        name: organization,
      },
    }),
    ...(role && { 
      contributor: {
        '@type': 'Person',
        name: 'Zach Marino',
        jobTitle: role,
      }
    }),
  }

  return (
    <Script
      id="project-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}