import type { MetadataRoute } from "next";
import { getProjectList } from "@/lib/payload";

const baseUrl = "https://zmarino.com";

// Built from published projects, so new ones show up without code changes.
// Re-rendered on publish along with everything else.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectList();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
