export const SERVICES = ["Frontend Development", "React / TypeScript", "React Native", "UI Implementation", "REST API Integration", "State Management", "Performance Optimization", "Responsive Design"] as const

export const EXPERTISE_FIELDS = ["React Development", "TypeScript", "React Native", "UI / UX", "Design Systems", "REST API", "Accessibility", "Performance"] as const

export const TOOLS = [
  { name: "React", desc: "UI Library" },
  { name: "TypeScript", desc: "Type Safety" },
  { name: "Tailwind CSS", desc: "Styling" },
  { name: "GitHub", desc: "Version Control" },
  { name: "Figma", desc: "Design Tool" },
  { name: "Vite", desc: "Build Tool" },
] as const

export const PORTFOLIO_CATEGORIES = [
  {
    id: "web",
    label: "WEB",
    description: "Explore my journey in Web",
    projects: ["Dvely", "내폼리폼", "밍글링", "DASOM", "써봄"],
  },
  {
    id: "mobile",
    label: "MOBILE",
    description: "Explore my journey in Mobile",
    projects: ["WAIT:IT", "자료요정"],
  },
] as const
