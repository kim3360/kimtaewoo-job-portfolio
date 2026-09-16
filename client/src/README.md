# FSD (Feature-Sliced Design) 구조

```
src/
├── app/              # 앱 초기화, 라우터, 전역 프로바이더, 스타일
├── pages/            # 라우트 단위 페이지 조합
├── widgets/          # 독립 UI 블록 (헤더, 히어로, 섹션 등)
├── features/         # 사용자 액션 (모달, 폼 등)
├── entities/         # 비즈니스 엔티티 (project, experience, skill...)
└── shared/           # 재사용 UI, lib, hooks, providers
```

## 레이어 규칙

- 상위 레이어만 하위 레이어를 import 할 수 있습니다.
- `app` → `pages` → `widgets` → `features` → `entities` → `shared`
- 같은 레이어의 다른 슬라이스는 직접 import 하지 않습니다 (pages는 widgets를 조합).

## Public API

각 슬라이스는 `index.ts`로 public API를 노출합니다.

```ts
import { HomeLanding } from "@/widgets/home-landing";
import { projects } from "@/entities/project";
import { cn } from "@/shared/lib";
```
