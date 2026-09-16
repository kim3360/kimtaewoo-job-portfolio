export type ProjectFeature = {
  title: string
  description: string
}

export type ProjectDetails = {
  Problem: string
  Cause: string
  Solution: string
  Result: string
}

export type ProjectBase = {
  slug: string
  type: "web" | "mobile" | string
  thumbnail: string
  logo?: string
  image: string[]
  title: string
  description: string
  Projectdescription?: string
  tags: string[]
  link: string
  liveDemo?: string
  github?: string
  period?: string
  members?: string
  pdf?: string
  features?: ProjectFeature[]
  responsibilities?: string[]
  achievements?: string[]
  details?: ProjectDetails
}
