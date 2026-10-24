import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects as sourceProjects } from "../client/src/entities/project/model/projects.ts";
import type { ProjectBase, ProjectDetails } from "../client/src/entities/project/model/projectTypes.ts";
import {
  profile,
  awards,
  activities,
  internships,
  certifications,
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
    title: "마크다운 렌더러 지연 로딩으로 초기 JS 전송량 13.8% 감소",
    problem: "랜딩 방문자도 대화 화면 전용 마크다운 라이브러리를 내려받았습니다.",
    cause:
      "정적 import로 연결된 렌더러가 초기 JS 번들에 포함돼 있었습니다.",
    solution:
      "렌더러를 별도 청크로 분리하고, 대화 패널 진입 시 미리 로드했습니다.",
    result:
      "변경 당시 측정 기록에서 초기 JS가 gzip 344.31kB → 296.82kB로 감소했습니다.",
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
function dvelyFlow(index: number) {
  if (index === 0) return {
    type: "flow",
    title: "초기 로딩과 대화 렌더러 로딩 분리",
    caption: "렌더러를 별도 청크로 분리해 대화 패널 진입 시 미리 로드합니다. 초기 전송량은 변경 당시 gzip 측정 기록 기준입니다.",
    ariaLabel: "랜딩 페이지에서는 마크다운 렌더러가 제외된 초기 JS만 다운로드합니다. 대화 패널 진입 시 메시지 조회와 렌더러 동적 import를 함께 시작하고, 로딩 중에는 원문을 표시합니다. 렌더러가 준비되면 마크다운으로 표시합니다.",
    gapY: 38,
    nodes: [
      { id: "landing", t: "랜딩 페이지 방문", sub: "대화 기능 미사용", c: 0, r: 0, s: 0 },
      { id: "initial", t: "초기 JS만 다운로드", sub: "렌더러 제외 · gzip 296.82kB", c: 0, r: 1, s: 2 },
      { id: "panel", t: "대화 패널 진입", sub: "실제 기능 사용 시점", c: 1, r: 0, s: 1 },
      { id: "load", t: "메시지 조회 + 동적 import", sub: "React.lazy · 별도 렌더러 청크", c: 1, r: 1, s: 1 },
      { id: "raw", t: "로딩 중 메시지 원문 표시", sub: "대화 내용 읽기 유지", c: 1, r: 2, s: 1 },
      { id: "markdown", t: "마크다운 렌더링", sub: "렌더러 준비 후 표시", c: 1, r: 3, s: 2 },
    ],
    edges: [
      { a: "landing", b: "initial", s: 2 },
      { a: "landing", b: "panel", s: 1, k: "dash" },
      { a: "panel", b: "load", s: 1 },
      { a: "load", b: "raw", s: 1 },
      { a: "raw", b: "markdown", s: 2 },
    ],
    hl: ["initial", "markdown"],
  };
  return {
    type: "flow",
    title: "목록 캐시 유지와 서버 재조회 분리",
    caption: "일반 쿼리는 5분간 보관하고, staleTime·재조회 정책은 유지합니다. 발급마다 토큰이 회전하는 미리보기 열람 권한은 보관 대상에서 제외합니다.",
    ariaLabel: "목록 데이터를 조회한 뒤 상세 화면으로 이동해도 일반 쿼리는 5분간 캐시를 보관합니다. 회전형 미리보기 권한은 보관 대상에서 제외합니다. 뒤로가기로 목록에 복귀하면 캐시로 카드를 즉시 표시하고 기존 정책에 따라 서버 데이터를 재조회합니다.",
    gapY: 34,
    nodes: [
      { id: "list", t: "프로젝트 목록 조회", sub: "카드 데이터 수신", c: 0.5, r: 0, s: 0 },
      { id: "detail", t: "상세 화면으로 이동", sub: "목록 쿼리 구독 해제", c: 0.5, r: 1, s: 0 },
      { id: "cache", t: "일반 쿼리 캐시 5분 보관", sub: "gcTime: 0 → 5분", c: 0, r: 2, s: 1 },
      { id: "permission", t: "미리보기 열람 권한 제외", sub: "회전하는 토큰 재사용 방지", c: 1, r: 2, s: 1 },
      { id: "back", t: "복귀 즉시 기존 카드 표시", sub: "스켈레톤 0개 · 카드 11개", c: 0, r: 3, s: 2 },
      { id: "refetch", t: "기존 정책대로 서버 재조회", sub: "staleTime·재조회 정책 유지", c: 0, r: 4, s: 2 },
    ],
    edges: [
      { a: "list", b: "detail", s: 0 },
      { a: "detail", b: "cache", s: 1, route: "vertical" },
      { a: "cache", b: "permission", s: 1, k: "dash" },
      { a: "cache", b: "back", s: 2 },
      { a: "back", b: "refetch", s: 2 },
    ],
    hl: ["back", "refetch"],
  };
}
function projectCase(project: ProjectBase, i: number, details: ProjectDetails | undefined, issueIndex: number) {
  const preview = previews[project.slug];
  return {
    id: `${project.slug}-${issueIndex + 1}`,
    company: project.slug,
    no: i + 1,
    title: details?.title ?? preview.title,
    role: "Frontend Developer",
    featured: project.slug === "plimap",
    oneLine: { text: project.description },
    tech: project.tags,
    metrics: project.slug === "dvely"
      ? issueIndex === 0
        ? [{ value: 13.8, unit: "%", label: "초기 JS 전송량 감소 · 변경 당시 gzip 측정" }]
        : [
            { value: 0, unit: "개", label: "복귀 직후 스켈레톤 · 기존 30개" },
            { value: 11, unit: "개", label: "복귀 직후 카드 · 기존 0개" },
          ]
      : undefined,
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
    viz:
      project.slug === "dvely"
        ? dvelyFlow(issueIndex)
        : project.slug === "plimap"
        ? {
            type: "flow",
            title: "재생 준비와 실제 재생 상태 분리",
            caption:
              "준비된 플레이어는 클릭 이벤트 안에서 재사용합니다. UI와 타이머는 초기화 완료가 아닌 실제 PLAYING 이벤트를 기준으로 갱신합니다.",
            ariaLabel:
              "화면 진입 시 YouTube API를 로드하고 플레이어를 미리 초기화합니다. 초기화 Promise를 공유해 중복 생성을 방지합니다. 플레이어가 준비된 경우 재생 버튼 클릭 이벤트 안에서 loadVideoById와 playVideo를 호출합니다. 실제 PLAYING 이벤트를 받으면 재생 UI를 변경하고 구간 종료 타이머를 시작합니다.",
            gapY: 38,
            nodes: [
              {
                id: "enter",
                t: "화면 진입",
                sub: "YouTube API 로딩",
                c: 0,
                r: 0,
                s: 1,
              },
              {
                id: "ready",
                t: "플레이어 사전 초기화",
                sub: "Promise 공유 · 중복 생성 방지",
                c: 0,
                r: 1,
                s: 1,
              },
              {
                id: "click",
                t: "재생 버튼 클릭",
                sub: "사용자가 곡 선택",
                c: 1,
                r: 0,
                s: 0,
              },
              {
                id: "play",
                t: "클릭 안에서 재생 요청",
                sub: "준비 시 loadVideoById · playVideo",
                c: 1,
                r: 1,
                s: 1,
              },
              {
                id: "playing",
                t: "PLAYING 이벤트 수신",
                sub: "실제 재생 시작 확인",
                c: 0.5,
                r: 2,
                s: 2,
              },
              {
                id: "ui",
                t: "재생 UI 갱신",
                sub: "실제 재생 상태 반영",
                c: 0,
                r: 3,
                s: 2,
              },
              {
                id: "timer",
                t: "구간 종료 타이머 시작",
                sub: "실제 재생 시작 시점 기준",
                c: 1,
                r: 3,
                s: 2,
              },
            ],
            edges: [
              { a: "enter", b: "ready", s: 1 },
              { a: "ready", b: "play", s: 1 },
              { a: "click", b: "play", s: 1 },
              { a: "play", b: "playing", s: 2, route: "vertical" },
              { a: "playing", b: "ui", s: 2, route: "vertical" },
              { a: "playing", b: "timer", s: 2, route: "vertical" },
            ],
            hl: ["ui", "timer"],
          }
        : project.slug === "seobom"
        ? {
            type: "flow",
            title: "SSE 연결과 토큰 갱신",
            caption:
              "로그아웃·비로그인 시에는 기존 연결을 정리하고 알림을 비활성화합니다.",
            ariaLabel:
              "로그인 상태 확인 후 전역 SSE 연결을 생성하고, 알림 이벤트 수신 시 알림 UI와 연결 상태를 반영합니다. 토큰 갱신 시 기존 연결을 정리하고 새 인증 상태로 재연결합니다. 로그아웃 시 연결을 종료합니다.",
            gapY: 38,
            nodes: [
              {
                id: "auth",
                t: "로그인 상태 확인",
                sub: "인증된 사용자만 연결",
                c: 0,
                r: 0,
                s: 0,
              },
              {
                id: "connect",
                t: "전역 SSE 연결",
                sub: "페이지와 분리해 관리",
                c: 0,
                r: 1,
                s: 1,
              },
              {
                id: "event",
                t: "알림 이벤트 수신",
                sub: "서버 → 클라이언트",
                c: 0,
                r: 2,
                s: 2,
              },
              {
                id: "ui",
                t: "알림 UI 반영",
                sub: "헤더에 연결 상태 표시",
                c: 0,
                r: 3,
                s: 2,
              },
              {
                id: "refresh",
                t: "토큰 갱신 감지",
                sub: "인증 상태가 바뀐 경우",
                c: 1,
                r: 1,
                s: 1,
              },
              {
                id: "cleanup",
                t: "기존 연결 정리",
                sub: "이전 인증 연결 종료",
                c: 1,
                r: 2,
                s: 1,
              },
              {
                id: "reconnect",
                t: "새 인증으로 재연결",
                sub: "전역 SSE 연결 교체",
                c: 1,
                r: 3,
                s: 1,
              },
            ],
            edges: [
              { a: "auth", b: "connect", s: 1 },
              { a: "connect", b: "event", s: 2 },
              { a: "event", b: "ui", s: 2 },
              { a: "connect", b: "refresh", s: 1, k: "dash" },
              { a: "refresh", b: "cleanup", s: 1 },
              { a: "cleanup", b: "reconnect", s: 1 },
              {
                a: "reconnect",
                b: "connect",
                s: 1,
                route: "return-above",
                t: "재연결",
              },
            ],
            hl: ["ui", "reconnect"],
          }
        : project.slug === "myform-reform"
          ? {
              type: "flow",
              title: "결제 승인과 주문 상태 동기화",
              caption:
                "완료 화면은 서버의 주문 완료 상태를 확인한 뒤 표시합니다. 요청 중에는 버튼을 비활성화해 중복 PG 호출을 방지합니다.",
              ariaLabel:
                "결제 버튼을 누르면 로딩과 비활성화로 중복 요청을 방지합니다. PG 결제창의 성공 리다이렉트 이후 서버 결제 승인 API를 호출하고 주문 상태를 반복 조회합니다. 서버의 완료 상태를 확인하면 완료 화면을 표시합니다. 승인 실패나 타임아웃 시에는 결제 대기 상태를 유지하고 재시도를 안내합니다.",
              gapY: 34,
              nodes: [
                {
                  id: "request",
                  t: "결제 요청",
                  sub: "버튼 비활성화·중복 방지",
                  c: 0.5,
                  r: 0,
                  s: 0,
                },
                {
                  id: "pg",
                  t: "PG 결제창",
                  sub: "성공 리다이렉트 수신",
                  c: 0.5,
                  r: 1,
                  s: 0,
                },
                {
                  id: "approve",
                  t: "서버 결제 승인 API",
                  sub: "React Query mutation",
                  c: 0.5,
                  r: 2,
                  s: 1,
                },
                {
                  id: "poll",
                  t: "주문 상태 polling",
                  sub: "완료 확인까지 refetch",
                  c: 0,
                  r: 3,
                  s: 1,
                },
                {
                  id: "complete",
                  t: "완료 화면 반영",
                  sub: "서버의 완료 상태 확인",
                  c: 0,
                  r: 4,
                  s: 2,
                },
                {
                  id: "failure",
                  t: "승인 실패·타임아웃",
                  sub: "승인·조회 오류 처리",
                  c: 1,
                  r: 3,
                  s: 1,
                },
                {
                  id: "pending",
                  t: "결제 대기 유지",
                  sub: "재시도 안내 표시",
                  c: 1,
                  r: 4,
                  s: 1,
                },
              ],
              edges: [
                { a: "request", b: "pg", s: 0 },
                { a: "pg", b: "approve", s: 1 },
                { a: "approve", b: "poll", s: 1, route: "vertical", t: "승인" },
                { a: "poll", b: "complete", s: 2, t: "완료" },
                {
                  a: "approve",
                  b: "failure",
                  s: 1,
                  k: "dash",
                  route: "vertical",
                  t: "실패",
                },
                { a: "poll", b: "failure", s: 1, k: "dash" },
                { a: "failure", b: "pending", s: 1 },
              ],
              hl: ["complete"],
            }
          : {
              type: "flow",
              nodes: [
                {
                  id: "input",
                  t: "사용자 동작",
                  sub: project.title,
                  c: 0,
                  r: 0,
                  s: 0,
                },
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
}
const cases = projects.flatMap((project, i) =>
  (project.troubleshooting ?? [project.details]).map((details, issueIndex) =>
    projectCase(project, i, details, issueIndex),
  ),
);
const periodStart = (period: string) => {
  const match = period.match(/^(\d{4})(?:\.(\d{2}))?/);
  return match ? Number(match[1]) * 100 + Number(match[2] ?? "01") : 0;
};
const data = {
  meta: { derivedFrom: "client/src/entities", personalized: true },
  basics: {
    name: profile.name,
    headline: "화면과 데이터의 흐름을 연결하는 프론트엔드 개발자",
    email: profile.contact.email,
    github: {
      label: profile.contact.github,
      url: `https://github.com/${profile.contact.github.replace(/^@/, "")}`,
    },
  },
  overview: {
    career: {
      total: `프로젝트 ${projects.length}개`,
      currentCompany: "웹과 모바일 서비스 구현",
      status: "",
    },
    education: { school: education[0].school, level: education[0].degree },
  },
  summary: { title: "Resume", paragraphs: profile.resumeSummary, highlights },
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
    items: [...internships, ...activities]
      .sort((a, b) => periodStart(b.period) - periodStart(a.period))
      .map((item) => ({
        period: item.period,
        name: item.title.trim(),
        description: [item.subtitle],
      })),
  },
  awards: {
    title: "수상",
    items: awards.map((item) => ({
      date: item.period,
      name: item.title,
      status: item.honor,
      issuer: item.subtitle,
    })),
  },
  certifications: {
    title: "자격",
    items: certifications,
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
