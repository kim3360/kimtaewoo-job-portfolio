import { projects } from "../model/projects"

export type { ProjectDetails, ProjectFeature, ProjectBase } from "../model/projectTypes"

export type Project = (typeof projects)[number]

export function getProjectPath(slug: string) {
  return `/projects/${slug}`
}

export function findProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
