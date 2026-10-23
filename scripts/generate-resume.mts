import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects as sourceProjects } from "../client/src/entities/project/model/projects.ts";
import type { ProjectBase } from "../client/src/entities/project/model/projectTypes.ts";
import {
  profile,
  awards,
  activities,
  internships,
} from "../client/src/entities/profile/model/profile.ts";
import { coverLetterItems } from "../client/src/entities/profile/model/coverLetter.ts";
import { education } from "../client/src/entities/education/model/education.ts";
import { landingSkillGroups } from "../client/src/entities/skill/model/landingSkills.ts";

const projects: readonly ProjectBase[] = sourceProjects;
const previews: Record<
  string,
  {
    title: string;
    problem: string;
    cause: string;
    solution: string;
    result: string;
  }
> = {
  plimap: {
    title: "모바일 첫 음악 재생 문제 개선",
    problem:
      "첫 재생이 지연되고, 음악이 나오기 전에 UI가 재생 중으로 표시됐습니다.",
    cause:
      "클릭 이후 플레이어를 초기화하고, 실제 재생과 다른 시점에 UI와 타이머를 갱신했습니다.",
    solution:
      "플레이어를 미리 준비하고, PLAYING 이벤트를 기준으로 UI와 타이머를 동기화했습니다.",
    result:
      "준비된 상태에서 클릭 즉시 재생을 요청하고, 화면 표시가 실제 재생 상태를 따르도록 개선했습니다.",
  },
  dvely: {
    title: "AI 에이전트 워크스페이스 구조 설계",
    problem: "프로젝트·대화·코드·배포 화면을 연결하는 MVP 구조가 필요했습니다.",
    cause:
      "여러 작업 화면과 서버·클라이언트 상태를 일관되게 관리해야 했습니다.",
    solution:
      "TanStack Router로 화면을 나누고, TanStack Query·Zustand로 상태를 분리했습니다.",
    result:
      "인증부터 프로젝트 생성, 대화·미리보기·diff 확인까지 이어지는 MVP 화면을 구현했습니다.",
  },
  "myform-reform": {
    title: "결제 완료 후 주문 상태 불일치 해결",
    problem:
      "PG 결제 성공 후 주문이 결제 대기로 남거나 결제창이 중복으로 열렸습니다.",
    cause: "결제 콜백과 서버 승인·주문 갱신 사이에 비동기 시차가 있었습니다.",
    solution:
      "결제 단계를 분리하고, 승인 API·주문 상태 polling·중복 클릭 방어를 적용했습니다.",
    result: "결제 완료 후 주문 상태 불일치와 중복 PG 호출 문제를 해결했습니다.",
  },
  seobom: {
    title: "토큰 갱신 후 실시간 알림 연결 복구",
    problem:
      "로그인 상태에서도 SSE 연결이 끊겨 새로운 알림이 도착하지 않았습니다.",
    cause:
      "토큰 갱신 이후에도 알림 연결이 새로운 인증 상태를 따르지 못했습니다.",
    solution:
      "SSE 연결을 전역으로 관리하고, 토큰 갱신 시 재연결하도록 변경했습니다.",
    result: "로그인 유지 중 발생하던 알림 누락 문제를 해결했습니다.",
  },
  "wait-it": {
    title: "모바일 저장소 분리와 앱 구조 정리",
    problem:
      "웹·모바일 코드가 한 저장소에 있어 충돌과 빌드 설정 문제가 반복됐습니다.",
    cause:
      "플랫폼별 코드와 환경 설정이 함께 관리되어 모바일 작업이 영향을 받았습니다.",
    solution:
      "모바일 전용 저장소로 분리하고, API·타입·상태·화면 계층을 정리했습니다.",
    result:
      "모바일 개발의 독립성을 확보하고, 관심사를 분리해 유지보수성을 개선했습니다.",
  },
};
const highlights = [
  {
    label: "웹과 모바일 UI",
    paragraphs: [
      "React·TypeScript 기반 웹 UI와 React Native 앱을 구현합니다. 공통 컴포넌트와 반응형 화면으로 사용자 흐름을 연결합니다.",
    ],
  },
  {
    label: "상태와 데이터 흐름",
    paragraphs: [
      "TanStack Query·Zustand로 서버·클라이언트 상태를 나누고, API 연동과 로딩·오류 처리를 함께 설계합니다.",
    ],
  },
  {
    label: "문제 해결과 협업",
    paragraphs: [
      "기획·디자인·백엔드와 협업하며 미디어 재생·PG 결제·SSE 알림의 비동기 문제를 해결했습니다.",
    ],
  },
];
const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s|19|restful/g, (match) => (match === "restful" ? "rest" : ""));
const skillNames = [
  "React",
  "TypeScript",
  "React Native",
  "TanStack Query",
  "Zustand",
  "Vite",
  "Tailwind CSS",
  "Axios",
  "React Router",
  "SSE",
  "Storybook",
  "Zod",
];
const skillItems = skillNames.map((name) => ({
  name,
  projects: projects.filter((p) =>
    p.tags.some((tag) => normalize(tag) === normalize(name)),
  ).length,
}));
const additionalSkills = [
  ...new Set(landingSkillGroups.flatMap((group) => [...group.skills])),
].filter(
  (name) => !skillNames.some((skill) => normalize(name) === normalize(skill)),
);
const experience = projects.map((project, i) => ({
  id: project.slug,
  order: i + 1,
  company: project.description,
  companyShort: project.title,
  period: {
    start: String(i + 1).padStart(2, "0"),
    end: "",
    current: false,
    label: project.period?.replace("ing", "진행 중") ?? "팀 프로젝트",
  },
  duration: project.type === "mobile" ? "모바일 앱" : "웹 애플리케이션",
  featureCount: project.features?.length ?? 0,
  cardTitle: "Frontend Developer",
  titles: [{ label: "역할", text: "Frontend Developer" }],
  jobFunction: "프론트엔드 개발",
  summary: project.Projectdescription ?? project.description,
  preview: previews[project.slug],
  projects: [
    {
      no: 1,
      name: project.title,
      role: "Frontend Developer",
      tech: project.tags,
      achievements: project.responsibilities ?? [],
    },
  ],
}));
const cases = projects.map((project, i) => {
  const preview = previews[project.slug];
  const details = project.details;
  return {
    id: `${project.slug}-1`,
    company: project.slug,
    no: i + 1,
    title: details?.title ?? preview.title,
    role: "Frontend Developer",
    featured: project.slug === "plimap",
    oneLine: { text: project.description },
    tech: project.tags,
    blocks: [
      {
        key: "problem",
        label: "문제와 원인",
        items: [
          details?.Problem ?? preview.problem,
          details?.Cause ?? preview.cause,
        ].map((text) => ({ text })),
      },
      {
        key: "solution",
        label: "해결과 구현",
        items: (details
          ? [details.Solution, ...(details.SolutionSteps ?? [])]
          : (project.responsibilities ?? [preview.solution])
        ).map((text) => ({ text })),
      },
      {
        key: "result",
        label: "결과",
        items: (details
          ? [details.Result]
          : (project.achievements ?? [preview.result])
        ).map((text) => ({ text })),
      },
    ],
    viz: {
      type: "flow",
      nodes: [
        { id: "input", t: "사용자 동작", sub: project.title, c: 0, r: 0, s: 0 },
        {
          id: "state",
          t: "상태와 요청 관리",
          sub: project.tags.slice(0, 2).join(" · "),
          c: 0,
          r: 1,
          s: 1,
        },
        {
          id: "result",
          t: "화면 상태 반영",
          sub: "응답과 이벤트 기준 갱신",
          c: 0,
          r: 2,
          s: 2,
        },
      ],
      edges: [
        { a: "input", b: "state", s: 1 },
        { a: "state", b: "result", s: 2 },
      ],
      hl: ["result"],
    },
  };
});
const data = {
  meta: { derivedFrom: "client/src/entities", personalized: true },
  basics: {
    name: profile.name,
    headline: "화면과 데이터의 흐름을 연결하는 프론트엔드 개발자",
    email: profile.contact.email,
  },
  overview: {
    career: {
      total: `프로젝트 ${projects.length}개`,
      currentCompany: "웹과 모바일 서비스 구현",
      status: "",
    },
    education: { school: education[0].school, level: education[0].degree },
  },
  summary: { title: "간략 소개", paragraphs: [profile.bioShort], highlights },
  coreCompetencies: {
    title: "핵심 역량",
    items: highlights.map((item) => item.paragraphs[0]),
  },
  skills: { title: "나의 스킬", items: [...skillNames, ...additionalSkills] },
  skillStats: {
    measure: `막대는 전체 ${projects.length}개 프로젝트의 기술 목록에 기재된 사용 횟수입니다.`,
    items: [
      ...skillItems,
      ...additionalSkills.map((name) => ({ name, projects: 0 })),
    ],
  },
  experience,
  portfolio: {
    title: "프로젝트와 문제 해결",
    intro:
      "웹과 모바일 프로젝트에서 맡은 역할과 문제 해결 과정을 정리했습니다.",
    cases,
  },
  education: education.map((item) => ({
    period: item.period,
    school: item.school,
    schoolType: "",
    major: item.degree,
    status: "",
  })),
  activities: {
    title: "활동과 실무 경험",
    items: [...internships, ...activities].map((item) => ({
      period: item.period,
      name: item.title.trim(),
      description: [item.subtitle],
    })),
  },
  certifications: {
    title: "수상",
    items: awards.map((item) => ({
      date: item.period,
      name: item.title,
      status: item.honor,
      issuer: item.subtitle,
    })),
  },
  coverLetter: {
    title: "자기소개서",
    headline: "화면과 데이터의 흐름을 연결하는 개발자",
    paragraphs: [
      profile.bio,
      ...coverLetterItems.map((item) => `${item.title}\n\n${item.body}`),
    ],
  },
  hero: {
    bars: [
      {
        label: "프로젝트",
        count: projects.length,
        value: `${projects.length}개`,
      },
      {
        label: "Web application",
        count: projects.filter((p) => p.type === "web").length,
        value: `${projects.filter((p) => p.type === "web").length}개`,
      },
      {
        label: "Mobile application",
        count: projects.filter((p) => p.type === "mobile").length,
        value: `${projects.filter((p) => p.type === "mobile").length}개`,
      },
    ],
    barMeasure: "막대 = 전체 프로젝트 수 대비 비중",
    awards: awards.length,
  },
};
writeFileSync(
  fileURLToPath(
    new URL("../client/public/resume-reference/js/data.js", import.meta.url),
  ),
  `/* Generated from repository profile/project data. Run: node --import tsx scripts/generate-resume.mts */\nwindow.RESUME = ${JSON.stringify(data, null, 2)};\n`,
);
console.log(
  `Generated resume: ${projects.length} projects, ${awards.length} awards.`,
);
