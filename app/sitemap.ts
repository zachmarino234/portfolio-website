import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zmarino.com'

  const projects = [
    'no-pool-productions',
    'dow-jones',
    'catalog8h',
    'pitch',
    'abacus',
  ]

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...projectUrls,
  ]
}