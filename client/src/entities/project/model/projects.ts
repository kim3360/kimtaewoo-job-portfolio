export const projects = [
  // 디벨리 프로젝트
  {
    slug: "dvely",
    type: "web",
    thumbnail: "../assets/Dvely/Dvely_Thumbnail.png",
    logo: "../assets/Dvely/Logo.png",
    image: ["../assets/Dvely/1.png", "../assets/Dvely/2.png", "../assets/Dvely/3.png"],

    period: "2026.03 - ing",
    title: "Dvely",
    description: "AI Agent 기반 웹서비스 운영 자동화 플랫폼",
    members: "프론트엔드 2명, 백엔드 2명",

    Projectdescription:
      "Dvely는 AI로 만든 웹 결과물이 실제 운영 가능한 서비스가 되기까지의 전체 흐름을 연결하는 플랫폼입니다. GitHub OAuth로 로그인한 뒤 저장소를 불러와 프로젝트를 생성하고, 자연어 대화로 UI·기능을 수정하는 AI 에이전트 워크스페이스에서 사이트 미리보기와 코드 diff를 확인할 수 있습니다. 배포 파이프라인 UI를 통해 GitHub Pages 등 정적 사이트 배포까지 이어지는 MVP를 목표로 개발 중입니다.",

    tags: ["React 19", "TypeScript", "Vite", "TanStack Router", "TanStack Query", "Zustand", "Axios", "Zod", "Tailwind CSS", "shadcn/ui", "Radix UI", "i18next", "OAuth", "GitHub", "ESLint", "Prettier"],
    link: "#",
    github: "https://github.com/Dvely",

    features: [
      {
        title: "인증",
        description: "GitHub OAuth 단일 로그인을 지원합니다. 콜백 처리, 연동 상태 확인, 연동 해제가 가능하며 서비스 세션과 GitHub 토큰을 분리해 관리합니다.",
      },
      {
        title: "프로젝트 관리",
        description: "프로젝트 목록·상세·개요 화면을 제공합니다. 새 프로젝트 생성, GitHub 저장소 불러오기, 프로젝트 설정, 활동 로그, 커밋 이력, 저장소 상태 조회를 지원합니다.",
      },
      {
        title: "AI 에이전트 워크스페이스",
        description: "/project/$slug/agent 경로에서 자연어 대화로 UI·기능 수정을 요청합니다. 대화 목록·이어하기, 사이트 미리보기 패널, 삭제된 대화 휴지통 복구를 제공합니다.",
      },
      {
        title: "코드·변경 확인",
        description: "/project/$slug/code에서 코드 탐색기와 Side-by-side diff 뷰로 AI가 제안한 변경 사항을 비교·검토할 수 있습니다.",
      },
      {
        title: "배포 파이프라인",
        description: "/project/$slug/pipeline에서 배포 워크플로·파이프라인 관련 UI를 제공합니다. MVP 목표는 GitHub Pages 등 정적 사이트 배포입니다.",
      },
      {
        title: "기타 화면",
        description: "랜딩(서비스 소개), 홈(프로젝트·템플릿), 설정(계정·GitHub 연동·자동 승인 정책), 도움말, 분석, 휴지통 화면을 포함합니다.",
      },
    ],
    responsibilities: [
      "React 19 + Vite 8 기반 프론트엔드 아키텍처 구성 — TanStack Router 파일 기반 라우트, 레이아웃·가드 설계",
      "TanStack Query·Zustand로 서버·클라이언트 상태 분리, Axios + Zod 기반 API 연동·폼 검증",
      "shadcn/ui·Radix UI 컴포넌트로 프로젝트 관리·설정·에이전트 워크스페이스 UI 구현",
      "GitHub OAuth 연동 흐름(콜백·연동 상태·해제) 및 세션·토큰 분리 관리 UI",
      "AI 에이전트 워크스페이스 — 대화 목록, 미리보기 패널, 휴지통 복구 UX",
      "코드 탐색기·Side-by-side diff 뷰, 배포 파이프라인 화면 구현",
      "i18next 기반 한국어 우선 다국어(i18n) 적용, Geist·Pretendard 폰트 시스템 구성",
    ],
    achievements: ["파일 기반 TanStack Router로 프로젝트·에이전트·코드·파이프라인 등 다중 워크스페이스 라우트 구조 정립", "GitHub OAuth부터 프로젝트 생성·저장소 연동까지 핵심 온보딩 플로우 MVP 구현", "AI 에이전트 대화 + 미리보기 + diff 확인이 한 화면에서 이어지는 워크스페이스 UX 설계"],
  },

  // 내폼리폼 프로젝트
  {
    slug: "myform-reform",
    type: "web",
    thumbnail: "../assets/MyformReform/Myform_Reform_Thumbnail.jpg",
    logo: "../assets/MyformReform/Logo.png",
    image: ["../assets/MyformReform/Myform_Reform1.png", "../assets/MyformReform/Myform_Reform2.png", "../assets/MyformReform/Myform_Reform3.png", "../assets/MyformReform/Myform_Reform4.png", "../assets/MyformReform/Myform_Reform5.png", "../assets/MyformReform/Myform_Reform6.png"],

    title: "내폼리폼",
    description: "스포츠 유니폼 리폼 구매자와 리폼러 연결 통합 플랫폼",

    Projectdescription:
      "내폼리폼은 스포츠 유니폼·굿즈 리폼을 원하는 사용자와 리폼러를 연결하는 웹 플랫폼입니다. 기존에는 SNS, 당근, 카페 등에 정보가 흩어져 가격·후기 비교가 어렵고, 리폼러는 팔로워 없이 고객을 확보하기 힘든 구조였습니다.사용자는 리폼 요청을 등록하고 여러 리폼러의 견적을 받아 비교할 수 있으며, 리폼러는 작업물 판매·포트폴리오·후기를 한곳에서 관리합니다. 채팅으로 수거→작업→발송 단계를 공유해 진행 상황을 확인할 수 있습니다.",

    tags: ["React", "TypeScript", "Tailwind CSS", "REST API", "WebSocket", "PG 결제", "Zustand", "Storybook", "ZOD", "SSE", "TanstackQuery"],
    link: "#",
    liveDemo: "https://myform-reform.vercel.app",
    github: "https://github.com/UMC-9th-project/myform-reform-FE",
    period: "2025.12 - 2026.02",

    members: "PM 1명, 디자이너 2명, 프론트엔드 3명, 백엔드 5명",
    features: [
      {
        title: "리폼 작업물 마켓",
        description: "리폼러가 등록한 작업물을 탐색·구매할 수 있는 마켓 플레이스. 상품 상세, 옵션 선택, 장바구니 담기까지 이어지는 구매 흐름을 제공합니다.",
      },
      {
        title: "리폼 요청 & 견적 제안",
        description: "사용자가 사진·설명과 함께 리폼 요청을 등록하고, 여러 리폼러로부터 견적을 받아 가격·스타일·납기를 비교할 수 있습니다.",
      },
      {
        title: "리폼러 프로필 & 포트폴리오",
        description: "리폼러별 작업물, 후기, 평점을 한곳에서 확인해 신뢰할 수 있는 제작자를 선택할 수 있습니다.",
      },
      {
        title: "실시간 채팅",
        description: "요청·주문 건별 채팅방에서 문의와 진행 상황(수거 → 작업 → 발송)을 실시간으로 공유합니다.",
      },
      {
        title: "장바구니 & PG 결제",
        description: "다중 상품 선택·수량 조절·배송비 포함 결제 금액 계산 후 PG 연동 결제를 지원합니다.",
      },
    ],
    responsibilities: ["마켓·장바구니·결제 페이지 UI 및 상태 흐름 설계·구현", "PG SDK 연동, 결제 승인 API 호출 및 주문 상태 polling 처리", "TanStack Query 기반 서버 상태 관리, Zustand 클라이언트 상태 분리", "Zod 폼 검증, Storybook 공통 컴포넌트 문서화", "SSE 기반 채팅 메시지 수신 및 UI 반영"],
    achievements: ["결제 완료 후 주문 상태 불일치·중복 PG 호출 이슈 해결", "리폼 요청 → 견적 → 결제까지 핵심 사용자 플로우 MVP 구현"],
    details: {
      Problem: "리폼 작업물·견적 확정 후 PG 결제를 진행하면, 결제창에서는 성공으로 보이는데 주문 상세는 '결제 대기'로 남거나 결제 완료 화면으로 넘어가지 않는 경우가 있었습니다. 또 결제 버튼을 빠르게 연타하면 PG 창이 중복으로 열리는 이슈도 발생했습니다.",
      Cause: "프론트에서 PG SDK의 success 콜백만으로 결제 완료를 처리했고, 실제 주문 상태 갱신은 백엔드 webhook·승인 API 이후에 이루어지는 구조였습니다. success redirect 시점과 서버 반영 시점 사이에 race condition이 생겼고, 결제 요청 중 버튼 비활성화·중복 요청 방어 로직이 없어 연타 시 orderId가 여러 번 생성될 수 있었습니다.",
      Solution: "결제 플로우를 'PG 창 호출 → success redirect → 서버 결제 승인 API 호출 → 주문 상태 polling' 순으로 분리했습니다. 결제 버튼 클릭 시 즉시 loading/disabled 처리하고, React Query mutation으로 승인 API를 호출한 뒤 완료 상태를 확인할 때까지 주문 상세를 refetch했습니다. 실패·타임아웃 시에는 재시도 안내와 함께 결제 대기 상태를 유지하도록 fallback UI를 추가했습니다.",
      Result: "결제 완료 후 주문 상태 불일치 케이스를 줄였고, 버튼 연타로 인한 중복 PG 호출도 방지했습니다. 사용자는 결제 → 승인 → 완료까지 한 화면에서 진행 상황을 확인할 수 있게 되어, 리폼 작업물 구매·견적 결제 흐름을 안정적으로 마무리할 수 있었습니다.",
    },
  },

  // 스위프 웹 12기 밍글링 프로젝트
  {
    slug: "mingling",
    type: "web",
    thumbnail: "../assets/Mingling/Mingling_Thubnail.png",
    logo: "../assets/Mingling/Logo.png",
    image: ["../assets/Mingling/1.png", "../assets/Mingling/2.png", "../assets/Mingling/3.png", "../assets/Mingling/4.png", "../assets/Mingling/5.png", "../assets/Mingling/6.png"],

    title: "밍글링",
    description: "모임 참석자 위치 기반 최적 중간 지점·장소 추천 서비스",

    Projectdescription:
      "Mingling(밍글링)은 모임 참석자들의 출발 위치를 바탕으로 가장 공평하고 이동이 편리한 중간 지점을 찾아주는 서비스입니다. 지인들과 약속 장소를 정할 때 어디서 만날까? 라는 고민과 위치 선정의 불공평함을 해결하기 위해 기획되었습니다. 단순한 물리적 중간 거리가 아닌 실제 지하철 이동 시간과 환승 횟수를 고려하여 서울 내 최적의 번화가와 모임의 목적(식당, 카페, 놀거리 등)에 맞는 장소를 추천해 줍니다.",
    features: [
      {
        title: "모임 생성",
        description: "모임 이름·목적(회의/친목)·세부 카테고리, 참여 인원(미정 가능), 출발지 입력 마감일을 설정해 모임을 생성하고 모임 페이지로 이동합니다.",
      },
      {
        title: "모임 참여",
        description: "공유 링크(/join/[id])로 닉네임 입력 후 참여합니다. 재촉 링크(?view=nudge) 지원으로 OG 이미지·문구를 분기해 미입력 멤버를 유도합니다.",
      },
      {
        title: "출발지 입력·관리",
        description: "역 검색으로 출발지 선택·등록·수정·삭제, 참여 현황 확인, 카카오맵 참여자 위치 시각화. 전원 입력 완료 시 결과보기가 활성화됩니다.",
      },
      {
        title: "중간지점 결과",
        description: "Top3 중간지점 추천, 평균 이동시간·밍글링 추천 순위 표시. 후보 선택 시 지도에 경로·중간지점 표시, 환승 경로 모달, 주변 장소 추천·결과 공유.",
      },
      {
        title: "주변 장소 추천",
        description: "중간지점 기준 주변 장소 리스트 조회, 식당·카페·놀거리 등 카테고리 필터. 장소 선택 시 지도 연동 및 카카오맵 외부 링크로 상세 확인.",
      },
      {
        title: "공유·재촉",
        description: "모임 초대 링크 공유, 출발지 미입력 멤버 재촉하기, 결과 페이지에서 산출 결과 공유를 지원합니다.",
      },
      {
        title: "부가 기능",
        description: "랜딩 페이지(서비스 소개·CTA), 이용약관/개인정보/피드백 모달. GA/GTM으로 계산·후보 조회·장소 클릭·외부 지도 등 이벤트 트래킹.",
      },
    ],
    responsibilities: [
      "서비스 랜딩·메인 페이지 UI 및 반응형·모바일 레이아웃 구현",
      "모임 생성·참여 API 연동 및 Zod 폼 검증 — 백엔드 스키마·엔드포인트 협의",
      "중간지점 결과 페이지 전담 — Top3 후보·평균 이동시간·추천 순위 UI, Kakao Map SDK 경로·마커 시각화",
      "환승 경로 상세 모달 구현 및 결과보기 UX 개선",
      "주변 장소 추천 — 모임 목적별 카테고리 필터, 장소 리스트↔지도 선택 연동 및 마커 표시",
      "TanStack Query 기반 중간지점·장소 추천 데이터 연동, 로딩·에러·재조회 UX 처리",
      "GA/GTM 전환 퍼널 이벤트 설계·적용 (중간지점 계산 → 후보 조회 → 장소 탐색 → 외부 지도 이동)",
    ],
    achievements: ["장소 리스트·지도 선택 상태 불일치 해결 — 양방향 연동을 단일 상태로 통합", "중간지점 결과·주변 장소 추천 핵심 플로우 프론트 전담 구현", "GA 전환 퍼널 이벤트 정의로 서비스 핵심 행동(계산→조회→탐색) 추적 체계화"],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "REST API", "Kakao Map SDK", "Google Analytics", "Zustand", "Storybook", "ZOD", "TanstackQuery(ReactQuery)"],
    link: "#",
    liveDemo: "https://www.mingling.kr/",
    github: "https://github.com/SWYP-mingling/Frontend",
    period: "2025.12 - 2026.02",
    members: "PM 1명, 디자이너 1명, 프론트엔드 3명, 백엔드 3명",
    details: {
      Problem: "주변 장소 추천에서 리스트에서 장소를 선택해도 지도 마커·포커스가 갱신되지 않거나, 지도에서 고른 장소가 리스트 하이라이트와 어긋나는 경우가 있었습니다. 카테고리 필터를 바꾼 뒤에는 이전에 선택한 장소가 그대로 강조되기도 했습니다.",
      Cause: "장소 리스트와 Kakao Map 마커 상태가 컴포넌트별로 분리되어 있어, API 재조회·필터 변경 시 선택값이 초기화되지 않았습니다. TanStack Query로 목록은 갱신됐지만 지도 overlay를 먼저 제거하지 않아 마커가 중복되거나 이전 위치가 남는 문제도 있었습니다.",
      Solution: "선택된 placeId를 상위 단일 상태로 올리고, 리스트 클릭·지도 마커 클릭이 같은 setter를 쓰도록 통일했습니다. 카테고리·좌표별 queryKey를 분리하고, refetch 완료 후 기존 overlay를 제거한 뒤 새 마커를 그리도록 effect 의존성을 맞췄습니다. 필터 변경 시 선택 상태도 함께 reset하도록 처리했습니다.",
      Result: "리스트↔지도 양방향 선택이 한 흐름으로 동작하게 되었고, 필터 전환 후 잘못된 장소가 강조되던 케이스를 줄였습니다. QA 과정에서 지도·리스트 불일치 관련 이슈가 크게 줄어 결과 탐색 UX가 안정화되었습니다.",
    },
  },

  // 스위프 웹 11기 써봄 프로젝트
  {
    slug: "seobom",
    type: "mobile",
    thumbnail: "../assets/Subom/subom_Thumbnail.png",
    logo: "../assets/Subom/Title_Logo.png",
    image: ["../assets/Subom/Subom_Login.png", "../assets/Subom/2.png", "../assets/Subom/3.png", "../assets/Subom/4.png", "../assets/Subom/5.png", "../assets/Subom/6.png", "../assets/Subom/7.png"],

    title: "써봄",
    description: "대학생 대상 AI 피드백 기반 글쓰기 루틴",

    Projectdescription: "써봄은 대학생들의 글쓰기 습관을 돕는 서비스입니다. 사용자가 글을 작성하면 AI가 피드백을 제공하고, 루틴 형태로 꾸준히 글쓰기를 이어갈 수 있도록 설계되었습니다.",
    features: [
      {
        title: "온보딩 & 인증",
        description: "카카오 OAuth 로그인, 닉네임 설정, 서비스 소개·가이드 화면을 제공합니다. 비회원(게스트)도 일부 기능을 이용할 수 있습니다.",
      },
      {
        title: "홈 & 주제 선택",
        description: "오늘의 주제 캐러셀, 카테고리별 주제 탐색, 인기 글·배너, PWA 설치 안내를 홈에서 확인하고 주제 선택 후 글쓰기로 이동합니다.",
      },
      {
        title: "글쓰기",
        description: "선택한 주제에 대해 100~700자 의견을 작성합니다. 단계별 가이드, 임시저장·이어쓰기를 지원하며, 작성 완료 후 AI 피드백을 요청합니다.",
      },
      {
        title: "AI 피드백",
        description: "AI가 글에 대한 피드백·보완 제안을 제공하고, 피드백·보완 페이지에서 확인할 수 있습니다. 별점 평가로 만족도를 남길 수 있습니다.",
      },
      {
        title: "피드 (커뮤니티)",
        description: "다른 사용자 글을 열람하고, 주제별·과거 주제별로 모아볼 수 있습니다. 좋아요 등 반응과 글 상세 보기를 지원합니다.",
      },
      {
        title: "캘린더",
        description: "월별 글쓰기 기록을 시각화하고, 주간 챌린지·월간 훈련 현황을 확인합니다. 날짜별 작성 글을 조회할 수 있습니다.",
      },
      {
        title: "마이페이지",
        description: "내 정보 관리, 작성 글·반응한 글 목록, 과거 AI 피드백 다시 보기 등 개인 활동 기록을 한곳에서 관리합니다.",
      },
      {
        title: "알림",
        description: "SSE(Server-Sent Events) 실시간 알림을 지원합니다. 알림 목록 페이지에서 확인·관리할 수 있으며, 로그인 상태에 따라 연결이 자동 관리됩니다.",
      },
      {
        title: "관리자",
        description: "관리자 로그인 후 주제(질문) 등록·승인·예약, 카테고리별 주제 관리, 다음날 요일 자동 등록, 주제 수정·상태 변경을 처리합니다.",
      },
    ],
    responsibilities: [
      "프로젝트 초기 세팅 — 타이포·레이아웃, Storybook, 공통 Button·Header, Vercel 배포",
      "온보딩·인증 전담 — 카카오 OAuth, 가이드 UI, Zustand 인증 상태, 리프레시 토큰 자동 재발급, 로그아웃·탈퇴 API",
      "캘린더·마이페이지 UI 전체 구현 — 월별 기록·챌린지, 프로필·작성글·반응글, 이름 변경 API",
      "SSE 실시간 알림 — 알림 API 연동, 전역 연결·토큰 갱신 재연결, 비로그인 비활성화",
      "어드민 페이지 UI·API 전체 구현 — 주제 승인·예약·수정, AI 토픽 자동생성, React.memo·캐시 업데이트 최적화",
      "GA4 이벤트 유틸 설계·전 서비스 퍼널 적용 — 온보딩·글쓰기·피드·캘린더 등, 중복 이벤트 방지",
      "비회원(게스트) UX — 캘린더·프로필 진입, 작성 유도 바텀시트, 이탈 시 상태 초기화",
      "글 반응 API·에러 페이지 등 기타 기능 보완",
    ],
    achievements: ["온보딩·인증 플로우 프론트 전담 — 카카오 로그인·토큰 갱신·가이드 UX 전 과정 구현", "SSE 전역 연결·토큰 갱신 재연결로 로그인 유지 중 알림 누락 이슈 해결", "어드민 페이지 React.memo·캐시 직접 업데이트로 목록 렌더링 최적화"],
    tags: ["React 19", "TypeScript", "Vite", "TanStack Query", "Zustand", "Axios", "React Router", "Tailwind CSS", "Framer Motion", "SSE", "PWA", "OAuth", "GA4", "Sentry", "Vercel"],
    link: "#",
    liveDemo: "https://seobom.site",
    github: "https://github.com/SWYP-SUBOM",
    period: "2025.10 - 2025.11",
    members: "PM 1명, 디자이너 1명, 프론트엔드 3명, 백엔드 3명",
    pdf: "../assets/Subom/SWYP_Subom.pdf",
    details: {
      Problem: "로그인 상태를 유지한 채 서비스를 사용하다 보면 SSE 알림 연결이 끊기고, 재로그인하기 전까지 새 알림이 오지 않는 경우가 있었습니다. 토큰 갱신 직후에도 알림이 복구되지 않는 케이스가 반복됐습니다.",
      Cause: "SSE 연결이 페이지·컴포넌트 단위로 관리되어 토큰 refresh 이후 재연결 로직이 없었습니다. 비로그인·타임아웃·연결 상태 표시 처리도 화면마다 분산되어 인증 상태와 알림 연동이 어긋났습니다.",
      Solution: "SSE 연결을 전역에서 관리하고, 토큰 갱신 시 기존 연결을 정리한 뒤 자동 재연결하도록 구현했습니다. 알림 API 연동과 함께 비로그인 시 알림 비활성화, 연결 타임아웃·활성화 아이콘을 헤더와 통합해 상태를 한곳에서 보이게 했습니다.",
      Result: "로그인 유지 중 알림 누락 케이스를 줄였고, 인증·알림 흐름이 안정화되었습니다. 이후 온보딩·어드민 등 다른 영역 작업 시에도 동일한 인증·이벤트 패턴을 재사용할 수 있는 기반이 되었습니다.",
    },
  },

  //  WAIT:IT 프로젝트
  {
    slug: "wait-it",
    type: "mobile",
    thumbnail: "../assets/Wait/Group.png",
    logo: "../assets/Wait/Logo.png",
    image: ["../assets/Wait/1.png", "../assets/Wait/2.png", "../assets/Wait/3.png", "../assets/Wait/4.png"],

    title: "WAIT:IT",
    description: "오프라인 공간에서 줄서기를 간편하게 만들어주는 웨이팅 시스템",

    features: [
      {
        title: "매장 탐색",
        description: "홈에서 배너·매장 목록을 API로 불러와 카드 형태로 표시합니다. react-native-maps 지도로 주변 매장 위치를 확인하고, 대기 인원·예상 시간이 포함된 매장 리스트와 키워드 검색을 지원합니다.",
      },
      {
        title: "대기열 (줄서기)",
        description: "매장 상세에서 대기번호를 발급하고, 내 대기번호·앞 대기 인원·예상 시간을 확인합니다. Zustand로 대기 정보를 로컬에 저장·유지하며, POST /queue/{storeId} API로 대기를 등록합니다.",
      },
      {
        title: "매장 상세",
        description: "매장 이미지, 주소, 운영시간, 지도 마커 등 상세 정보를 제공합니다. GET /stores, GET /stores/{id} API로 매장 데이터를 조회합니다.",
      },
      {
        title: "회원·인증",
        description: "로그인·회원가입, 로그아웃, 회원 탈퇴를 지원합니다. AsyncStorage 기반 토큰 관리와 스플래시 화면 후 인증 여부에 따른 화면 분기를 처리합니다.",
      },
      {
        title: "마이페이지 및 부가 기능",
        description: "프로필 수정, 쿠폰함, 통계, 설정을 제공합니다. 알림·공지, 고객센터, 줄 선 장소·호스트 장소 등 활동 내역을 확인할 수 있습니다.",
      },
    ],
    responsibilities: [
      "앱 아키텍처 설계 — 모노레포→모바일 전용 레포 분리, API·Store·Screen·Component 계층 구조",
      "TypeScript 타입 정의 및 도메인별 API 모듈 분리",
      "인증 시스템 구현 — 로그인·회원가입, JWT 토큰 플로우, Zustand+AsyncStorage 자동 로그인",
      "React Navigation Stack·Bottom Tab 2단계 네비게이션, 인증 분기·타입 안전 라우팅",
      "핵심 기능 개발 — 홈(배너·매장 목록), 매장 상세(Google Maps), 대기열 발급·상태 영속화",
      "마이페이지 — 프로필, 설정, 공지사항, 로그아웃·회원탈퇴",
      "Axios REST API 연동 — 병렬 호출·부분 실패 예외 처리로 화면 정상 렌더링",
      "네이티브 환경 설정 — iOS/Android Google Maps API Key, 환경변수 기반 엔드포인트 분리",
    ],
    achievements: [
      "팀 3명 규모에서 모바일 클라이언트 단독 담당 (전체 커밋 35%, 78개+) — 환경 셋업부터 API 연동까지 E2E 개발",
      "모노레포를 모바일 단독 레포로 분리해 팀원 간 충돌을 줄이고 모바일 개발 독립성 확보",
      "API·타입·화면 계층 분리로 관심사 분리 원칙 적용, 유지보수성 개선",
      "JWT 인증 구현 및 AuthContext→Zustand 전환, AsyncStorage 기반 자동 로그인 처리",
      "react-native-maps + CocoaPods 네이티브 연동, 매장 상세 Google Maps 마커 표시",
      "홈 배너·매장 API Promise.allSettled 병렬 호출 — 부분 장애 시에도 화면 정상 렌더링",
      "getImageUrl() 유틸로 절대/상대 URL 혼용 문제 해결, 이미지 깨짐 방지",
      "Zustand persist + AsyncStorage로 대기 상태 영속화 — 앱 재시작 후에도 대기 정보 유지",
    ],
    tags: ["React Native", "TypeScript", "React Navigation", "Zustand", "AsyncStorage", "Axios", "REST API", "react-native-maps", "Google Maps SDK"],
    link: "#",
    github: "https://github.com/DMU-Capstone",
    period: "2025.03 - 2025.10",
    members: "프론트엔드 2명, 백엔드 1명",

    details: {
      Problem: "웹(어드민/유저)과 모바일이 한 레포에 있어 모바일 작업 시 웹 코드와 충돌하고, 빌드 설정이 꼬이는 문제가 반복됐습니다.",
      Cause: "web/, mobile/, packages/shared/ 경로가 뒤섞여 import가 깨졌고, Expo 기반 mobile/ 폴더와 RN CLI 앱이 공존하던 시기에 구조가 더 복잡해졌습니다. 삭제·이동 범위가 커 한 번 잘못 수정하면 전체 빌드가 실패하는 위험도 있었습니다.",
      Solution: "모바일 전용 레포로 분리하고 웹 관련 파일을 전량 제거했습니다. 이후 src/apis/, src/types/ 중심으로 폴더 구조를 재정리해 API·타입·화면 책임을 분리했습니다.",
      Result: "모바일 개발이 웹 코드와 분리되어 팀원 간 충돌과 빌드 이슈가 줄었고, 이후 인증·홈·매장 기능을 독립된 모바일 레포에서 안정적으로 이어갈 수 있는 기반이 마련됐습니다.",
    },
  },

  // 자료요정
  {
    slug: "data-fairy",
    type: "mobile",
    thumbnail: "../assets/DataFairy/Data_Fairy_Thumbnail.png",
    logo: "../assets/DataFairy/Logo.png",
    image: ["../assets/DataFairy/1.png", "../assets/DataFairy/2.png", "../assets/DataFairy/3.png", "../assets/DataFairy/4.png"],

    title: "자료요정",
    description: "스크린샷 OCR + AI 요약·분류로 자료를 자동 정리하는 모바일 앱",

    Projectdescription: "많은 사용자들이 스마트폰으로 강의자료, 회의 내용, 설정 정보 등을 스크린샷으로 저장하지만, 나중에 다시 확인하려고 할 때 어떤 내용인지 기억하기 어렵고, 정리되지 않아 찾기 힘든 문제가 발생합니다. 스크린샷 이미지 안의 텍스트를 자동으로 추출하고, OpenAI를 활용해 요약 + 카테고리 분류 + 폴더 저장까지 자동화합니다.",
    features: [
      {
        title: "이미지 등록",
        description: "갤러리·카메라에서 스크린샷을 선택하거나 촬영해 자료 등록을 시작합니다. 업로드 전 리사이즈·압축으로 대용량 이미지도 안정적으로 전송합니다.",
      },
      {
        title: "OCR 텍스트 추출",
        description: "등록한 이미지에서 OCR(광학 문자 인식)으로 텍스트를 자동 추출합니다. 강의자료·회의 캡처 등 다양한 스크린샷에서 본문을 뽑아냅니다.",
      },
      {
        title: "AI 요약·자동 분류",
        description: "추출된 텍스트를 OpenAI API로 요약하고, 카테고리(강의·회의·메모 등)별로 자동 분류합니다. 제목·요약·태그를 생성해 한눈에 파악할 수 있습니다.",
      },
      {
        title: "폴더·자료 관리",
        description: "분류된 자료를 폴더 단위로 저장·조회합니다. 카테고리별 목록과 상세 화면에서 원본 이미지·추출 텍스트·AI 요약을 함께 확인합니다.",
      },
      {
        title: "검색",
        description: "키워드 검색으로 저장한 자료를 빠르게 찾습니다. 제목·요약·태그 기준으로 필터링해 필요한 스크린샷 자료에 접근합니다.",
      },
    ],
    responsibilities: ["Expo React Native 앱 단독 개발 — 화면·네비게이션·공통 UI 전체", "이미지 선택·업로드 UI 및 multipart REST API 연동", "OCR → AI 요약·분류 파이프라인 결과 화면, 단계별 로딩·에러·재시도 UX", "Styled Components 기반 공통 컴포넌트·화면 스타일 구성", "자료 목록·폴더·키워드 검색 API 연동", "고해상도 스크린샷 업로드 전 리사이즈·압축 처리"],
    achievements: ["1인 프론트로 스크린샷 → OCR → AI 분류 → 저장 E2E 플로우 MVP 구현", "업로드→OCR→AI 단계별 진행 UI로 처리 대기 중 중복 요청·이탈 감소", "이미지 압축·업로드 최적화로 대용량 스크린샷 전송 안정화"],
    tags: ["React Native", "Expo", "TypeScript", "Styled Components", "REST API", "OpenAI"],
    link: "#",

    github: "https://github.com/Zerotone-ClearShot",
    period: "2025.03 - 2025.03",
    members: "PM 1명, 프론트엔드 1명, 백엔드 2명",
    pdf: "../assets/DataFairy/CLEARSHOT.pdf",
    details: {
      Problem: "고해상도 스크린샷 업로드 시 요청 타임아웃·실패가 잦았고, OCR·AI 요약 처리(10초 이상) 대기 중 사용자가 버튼을 반복 클릭해 중복 자료가 저장되는 문제가 있었습니다.",
      Cause: "갤러리 원본 이미지를 그대로 multipart 업로드해 payload가 커졌습니다. OCR 완료 후 OpenAI API 호출까지 순차 처리되는 동안 로딩 상태가 불명확하고, 버튼 비활성화·중복 요청 방어 로직이 없었습니다.",
      Solution: "업로드 전 이미지 리사이즈·압축을 적용하고, 업로드 → OCR → AI 요약 단계별 진행 UI와 버튼 disabled 처리를 추가했습니다. 실패 시 재시도 안내와 함께 해당 단계에서 멈추도록 fallback UI를 구성했습니다.",
      Result: "대용량 이미지 업로드 성공률이 개선됐고, AI 처리 중 중복 저장 케이스가 줄었습니다. 사용자가 현재 어느 단계가 진행 중인지 파악할 수 있어 OCR·요약 대기 UX가 안정화되었습니다.",
    },
  },

  // DASOM 프로젝트
  {
    slug: "dasom",
    type: "web",
    thumbnail: "../assets/DASOM/banner.png",
    logo: "../assets/DASOM/Logo.png",
    image: ["../assets/DASOM/1.png"],

    title: "DASOM",
    description: "동양미래대학교 컴퓨터공학부 전공동아리 다솜 공식 홈페이지",

    Projectdescription: "동아리 소개, 개발 기록, 회원 관리 등 동아리 운영에 필요한 기능을 제공하는 반응형 웹사이트입니다.",
    features: [
      {
        title: "동아리 소개",
        description: "동아리 목적, 활동 내용, 멤버 소개를 시각적으로 전달합니다.",
      },
      {
        title: "개발 기록",
        description: "동아리 프로젝트를 카드 형태로 표시하고 필터·검색으로 탐색합니다.",
      },
      {
        title: "회원 관리",
        description: "회원가입·로그인·프로필 관리 기능으로 동아리 멤버를 관리합니다.",
      },
    ],
    responsibilities: ["React·TypeScript 기반 반응형 UI 구현", "REST API 연동 및 인증 토큰 세션 관리", "Tailwind CSS 디자인 시스템 적용"],
    tags: ["React", "TypeScript", "Tailwind CSS", "REST API"],
    link: "#",

    github: "https://github.com/DASOM-GitHub",
    period: "2024.07 - 2025.01",

    members: "프론트엔드 4명, 백엔드 2명",

    details: {
      Problem: "모집 기간 전/후에도 「지원하기」 버튼이 항상 활성화됐습니다.",
      Cause: "버튼 상태가 하드코딩되어 API 일정과 무관하게 동작했습니다.",
      Solution: "determineRecruitStatus()로 현재 시점을 5단계(모집 전/모집 중/1차 발표/최종 발표/종료)로 분류하고, 텍스트·disabled·onClick을 동적으로 설정했습니다.",
      Result: "모집 시즌별 버튼 상태가 API 일정과 자동 동기화되어 운영진 수동 변경이 필요 없어졌습니다.",
    },
  },
]
