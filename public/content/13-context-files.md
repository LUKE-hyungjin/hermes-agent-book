# 13. 컨텍스트 파일

> Hermes는 현재 작업 디렉터리와 홈 디렉터리에서 문맥 파일을 자동 발견해, 저장소 규칙과 에이전트 성격을 프롬프트에 반영합니다.

## 컨텍스트 파일이 중요한 이유

같은 모델을 써도 프로젝트마다 코딩 규칙, 금지 사항, 아키텍처, 응답 톤은 달라집니다. Hermes는 이런 정보를 매번 긴 프롬프트로 붙이지 않아도 되도록 `AGENTS.md`, `.hermes.md`, `CLAUDE.md`, `.cursorrules`, `SOUL.md` 같은 파일을 자동으로 읽습니다. 즉, 컨텍스트 파일은 "이 저장소에서 Hermes가 어떤 팀원처럼 행동해야 하는가"를 고정하는 장치입니다.

## 지원되는 파일과 우선순위

| 파일 | 용도 | 탐색 방식 |
|------|------|-----------|
| `.hermes.md`, `HERMES.md` | 프로젝트 지시, 최우선 | Git 루트 방향으로 탐색 |
| `AGENTS.md` | 구조, 규칙, 아키텍처 | 하위 디렉터리까지 재귀 탐색 |
| `CLAUDE.md` | Claude Code 계열 문맥 재사용 | 현재 작업 디렉터리 |
| `.cursorrules`, `.cursor/rules/*.mdc` | Cursor 규칙 호환 | 현재 작업 디렉터리 |
| `SOUL.md` | 전역 성격, 톤 | `HERMES_HOME`에서만 로드 |

프로젝트 문맥은 한 세션에 한 종류만 우선 선택됩니다. 기본 우선순위는 `.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`입니다. `SOUL.md`는 이와 별개로 항상 에이전트 정체성 슬롯에 따로 들어갑니다.

## `AGENTS.md` 계층 구조

`AGENTS.md`는 Hermes에서 가장 중요한 프로젝트 컨텍스트 파일입니다. 특히 모노레포에서 강력합니다.

```text
my-project/
├── AGENTS.md
├── frontend/
│   └── AGENTS.md
├── backend/
│   └── AGENTS.md
└── shared/
    └── AGENTS.md
```

Hermes는 현재 작업 디렉터리에서 시작해 관련 `AGENTS.md` 파일을 모두 모으고, 깊이 순서대로 결합합니다. 그래서 루트 규칙은 전체 프로젝트에 적용되고, 더 깊은 하위 디렉터리 규칙은 그 영역에서 추가 지침으로 작동합니다.

건너뛰는 디렉터리도 있습니다. 예를 들어 점으로 시작하는 숨김 디렉터리, `node_modules`, `__pycache__`, `venv`, `.venv`는 보통 탐색 대상에서 제외됩니다.

## 좋은 `AGENTS.md` 예시

```md
# Project Context

## Architecture
- Frontend: Next.js 14 in /frontend
- Backend: FastAPI in /backend
- Database: PostgreSQL 16

## Conventions
- Frontend uses TypeScript strict mode
- Backend uses type hints everywhere
- API responses follow {data, error, meta}

## Important Notes
- Never edit migration files directly
- Do not commit .env.local
```

좋은 컨텍스트 파일은 "장기적으로 유지되는 규칙"에 집중합니다. 반대로 오늘만 필요한 TODO 목록이나 임시 지시는 세션 대화 안에 남기는 편이 맞습니다.

## `SOUL.md`와의 역할 분리

| 파일 | 담아야 할 것 | 담지 말아야 할 것 |
|------|---------------|-------------------|
| `AGENTS.md` | 저장소 구조, 코드 규칙, 테스트 방식 | 말투, 성격 |
| `SOUL.md` | 응답 톤, 태도, 기본 상호작용 방식 | 파일 경로, 프로젝트별 규칙 |

`SOUL.md`는 `~/.hermes/SOUL.md` 또는 `$HERMES_HOME/SOUL.md`에서만 로드됩니다. 작업 디렉터리 안에서 찾지 않는다는 점이 중요합니다. 덕분에 프로젝트를 옮겨 다녀도 에이전트의 기본 성격은 흔들리지 않습니다.

## 로딩 과정

Hermes는 컨텍스트 파일을 읽을 때 단순 cat을 하지 않습니다. 대략 아래 순서로 처리합니다.

| 단계 | 설명 |
|------|------|
| 탐색 | 현재 작업 디렉터리 기준으로 관련 파일 검색 |
| 읽기 | UTF-8 텍스트로 로드 |
| 보안 스캔 | 프롬프트 인젝션 패턴 검사 |
| 절단 | 20,000자 이상이면 앞/뒤 중심으로 자름 |
| 프롬프트 삽입 | 세션 시작 시 시스템 프롬프트에 포함 |

즉, 컨텍스트 파일은 매우 강력하지만 동시에 신뢰 경계이기도 합니다. 외부 저장소를 열 때는 해당 파일들을 함께 검토하는 습관이 좋습니다.

:::tip
프로젝트에 Hermes를 처음 도입할 때는 `AGENTS.md` 하나만 잘 써도 체감 품질이 크게 올라갑니다. "이 저장소는 무엇이고, 어떤 규칙을 따르며, 무엇을 건드리면 안 되는가" 세 가지만 명확히 적어도 효과가 큽니다.
:::

컨텍스트 파일을 잘 설계하면 매번 긴 설명을 반복할 필요가 없어집니다. 결국 Hermes의 품질은 모델 자체만이 아니라, 얼마나 좋은 문맥 파일을 지속적으로 유지하느냐에도 크게 달려 있습니다.

---

**이전:** [← 11. 스킬](#12-skills)
**다음:** [13. 성격 설정 →](#14-personality)
