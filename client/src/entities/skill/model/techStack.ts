export const stackIntro = {
  eyebrow: "Skills",
  lead: "사용자 경험을 만드는 프론트엔드",
  summary:
    "React·TypeScript로 웹과 모바일 UI를 구현하고, API 연동·상태 관리·배포까지 제품 흐름에 맞게 연결합니다.",
} as const;

export const stackPrimary = [
  { name: "React · React Native", subtitle: "웹 & 모바일 UI" },
  { name: "TypeScript", subtitle: "타입 안전 개발" },
  { name: "Next.js", subtitle: "라우팅·웹 앱" },
  { name: "TanstackQuery", subtitle: "서버 상태·캐시" },
  { name: "Figma", subtitle: "시안 → 코드" },
  { name: "GitHub", subtitle: "협업·PR·배포" },
] as const;

export const stackCategories = [
  {
    id: "ui",
    title: "UI · 화면",
    items: [
      {
        headline: "반응형 웹",
        tags: "React · TypeScript · Tailwind CSS",
      },
      {
        headline: "모바일 앱",
        tags: "React Native · Expo · WebView",
      },
      {
        headline: "UX 디테일",
        tags: "로딩·에러 처리 · Storybook · 접근성",
      },
    ],
  },
  {
    id: "logic",
    title: "로직 · 데이터",
    items: [
      {
        headline: "API 연동",
        tags: "REST · TanStack Query · Zod",
      },
      {
        headline: "상태 관리",
        tags: "Zustand · React Router · 폼 UX",
      },
      {
        headline: "안정성",
        tags: "타입 검증 · SSE · 에러 핸들링",
      },
    ],
  },
  {
    id: "workflow",
    title: "협업 · 배포",
    items: [
      {
        headline: "개발 환경",
        tags: "Vite · pnpm · VS Code · Cursor",
      },
      {
        headline: "팀 워크플로",
        tags: "Git · GitHub · Figma · Notion",
      },
      {
        headline: "배포",
        tags: "Vercel · CI/CD · 코드 리뷰",
      },
    ],
  },
] as const;

/** @deprecated stackPrimary 사용 */
export const stackTools = stackPrimary;
