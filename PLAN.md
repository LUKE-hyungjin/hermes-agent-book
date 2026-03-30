# Hermes Agent 한국어 가이드 웹사이트 — 프로젝트 Plan

## 프로젝트 개요

Hermes Agent v0.5.0 기준 한국어 가이드 웹사이트 구축.
참고 디자인: https://cc101.axwith.com/ko (사이드바 네비게이션 + 콘텐츠 영역 SPA 구조)

---

## 1. 디자인 구조

### 레퍼런스 (cc101.axwith.com) 분석
- **좌측 사이드바**: 고정 네비게이션, 카테고리 그룹핑, 접기/펼치기 가능
- **우측 콘텐츠**: 선택한 챕터 내용만 표시 (스크롤이 아닌 페이지 전환)
- **상단 헤더**: 로고, GitHub 링크, 테마 토글, 언어 전환
- **하단 푸터**: 이전/다음 챕터 네비게이션

### 우리 구조
```
┌──────────────────────────────────────────────┐
│  헤더: 로고 | GitHub | 테마토글              │
├──────────┬───────────────────────────────────┤
│ 사이드바  │  메인 콘텐츠 영역                  │
│ (고정)    │  (선택한 챕터만 표시)              │
│          │                                   │
│ 기초     │  # 챕터 제목                       │
│  01 ...  │  내용...                           │
│  02 ...  │                                   │
│          │  코드블록, 테이블, 팁박스 등        │
│ 설정     │                                   │
│  03 ...  │                                   │
│  04 ...  │                                   │
│          │                                   │
│ 기능     │  ← 이전  |  다음 →                 │
│  05 ...  │                                   │
│  ...     │                                   │
├──────────┴───────────────────────────────────┤
│  푸터                                        │
└──────────────────────────────────────────────┘
```

---

## 2. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | **Vite + Vanilla JS** (또는 Astro) | 정적 사이트, 빌드 빠름, Cloudflare Pages 배포 용이 |
| 스타일 | **Tailwind CSS** | 유틸리티 클래스, cc101과 유사한 스타일 빠르게 구현 |
| 콘텐츠 | **Markdown → JSON** | 각 챕터를 .md 파일로 작성, 빌드 시 JSON으로 변환 |
| 배포 | **Cloudflare Pages** | 무료, 글로벌 CDN, 자동 빌드 |
| 코드 하이라이트 | **Prism.js** 또는 **Shiki** | 코드 블록 문법 강조 |

### 최종 결정: Vite + Vanilla JS + Tailwind CSS
- 의존성 최소화
- 빌드 산출물 = 순수 정적 파일
- Cloudflare Pages에서 `npm run build` 자동 실행 가능

---

## 3. 목차 구성 (v0.5.0 기준)

### 기초 (Getting Started)
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 01 | Hermes Agent란? | /docs/ (개요) |
| 02 | 설치 및 설정 | /docs/getting-started/installation, /docs/getting-started/quickstart |
| 03 | 업데이트 & 삭제 | /docs/getting-started/updating |
| 04 | 학습 경로 | /docs/getting-started/learning-path |

### 설정 (Configuration)
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 05 | CLI 인터페이스 | /docs/user-guide/cli |
| 06 | 설정 파일 (config.yaml) | /docs/user-guide/configuration |
| 07 | 세션 관리 | /docs/user-guide/sessions |
| 08 | 프로바이더 설정 | /docs/user-guide/configuration (provider section) |
| 09 | 보안 | /docs/user-guide/security |

### 핵심 기능 (Core Features)
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 10 | 메모리 시스템 | /docs/user-guide/features/memory |
| 11 | 스킬 시스템 | /docs/user-guide/features/skills |
| 12 | 컨텍스트 파일 | /docs/user-guide/features/context-files |
| 13 | SOUL.md & 성격 | /docs/user-guide/features/personality |
| 14 | 도구 (Tools) | /docs/user-guide/features/tools |
| 15 | MCP 통합 | /docs/user-guide/features/mcp |

### 메시징 (Messaging)
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 16 | 메시징 게이트웨이 개요 | /docs/user-guide/messaging/ |
| 17 | Telegram 연동 | /docs/user-guide/messaging/telegram |
| 18 | Discord 연동 | /docs/user-guide/messaging/discord |
| 19 | Slack, WhatsApp, 기타 | /docs/user-guide/messaging/slack, whatsapp 등 |

### 자동화 & 고급 (Automation & Advanced)
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 20 | 크론 (Cron) 작업 | /docs/user-guide/features/cron |
| 21 | Hooks | /docs/user-guide/features/hooks |
| 22 | 태스크 위임 (Delegation) | /docs/user-guide/features/delegation |
| 23 | 브라우저 도구 | /docs/user-guide/features/browser |
| 24 | 코드 실행 | /docs/user-guide/features/code-execution |
| 25 | 비전 & 이미지 | /docs/user-guide/features/vision |
| 26 | 음성 모드 (TTS) | /docs/user-guide/features/tts, voice-mode |

### 배포 (Deployment)
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 27 | Docker 배포 | /docs/user-guide/docker |
| 28 | 프로필 (다중 에이전트) | /docs/user-guide/profiles |
| 29 | API 서버 | /docs/user-guide/features/api-server |

### 부록
| 챕터 | 제목 | 공식 문서 소스 |
|------|------|---------------|
| 30 | CLI 명령어 레퍼런스 | /docs/reference/cli-commands |
| 31 | 환경변수 | /docs/reference/environment-variables |
| 32 | FAQ & 트러블슈팅 | /docs/reference/faq |
| 33 | 스킬 카탈로그 | /docs/reference/skills-catalog |

---

## 4. 프로젝트 디렉토리 구조

```
hermes-agent-book/
├── public/
│   └── favicon.svg
├── src/
│   ├── index.html
│   ├── main.js              # 엔트리포인트, 라우팅
│   ├── styles/
│   │   └── main.css          # Tailwind + 커스텀 스타일
│   ├── components/
│   │   ├── sidebar.js        # 사이드바 네비게이션 컴포넌트
│   │   ├── content.js        # 콘텐츠 렌더러
│   │   ├── header.js         # 헤더 컴포넌트
│   │   └── navigation.js     # 이전/다음 네비게이션
│   └── data/
│       └── chapters.json     # 빌드된 챕터 데이터
├── content/
│   ├── 01-what-is-hermes.md
│   ├── 02-installation.md
│   ├── ...
│   └── 33-skills-catalog.md
├── scripts/
│   └── build-content.js      # Markdown → JSON 변환 스크립트
├── package.json
├── tailwind.config.js
├── vite.config.js
├── PLAN.md                   # 이 파일
├── REQUIREMENTS.md           # 요구사항 정리
└── README.md
```

---

## 5. 작업 순서

### Phase 1: 프로젝트 셋업 (지금)
- [x] git init
- [x] PLAN.md 작성
- [x] REQUIREMENTS.md 작성
- [ ] Vite 프로젝트 초기화
- [ ] Tailwind CSS 설정
- [ ] 기본 HTML 구조

### Phase 2: 레이아웃 & 라우팅
- [ ] 사이드바 컴포넌트
- [ ] 콘텐츠 영역 컴포넌트
- [ ] 해시 기반 라우팅 (#01-what-is-hermes)
- [ ] 이전/다음 네비게이션
- [ ] 반응형 (모바일 사이드바 토글)

### Phase 3: 콘텐츠 작성 (Codex 활용)
- [ ] Markdown → JSON 빌드 파이프라인
- [ ] 각 챕터별 프롬프트 작성 → Codex로 콘텐츠 생성
- [ ] 코드 하이라이트 적용
- [ ] 한국어 자연스러움 검수

### Phase 4: 마무리
- [ ] 다크/라이트 테마
- [ ] 검색 기능 (선택)
- [ ] Cloudflare Pages 배포 설정
- [ ] GitHub 푸시

---

## 6. Codex 콘텐츠 생성 전략

각 챕터마다 다음 프롬프트 구조를 사용:

```
Hermes Agent v0.5.0 한국어 가이드 작성.

챕터: [번호]. [제목]
공식 문서 소스: [URL]

다음 내용을 포함해 한국어로 작성:
1. 한 줄 요약 (인용구 스타일)
2. 상세 설명 (초보자도 이해할 수 있게)
3. 실제 사용 예시 (코드 블록)
4. 팁 & 주의사항 (팁 박스)
5. 관련 챕터 링크

형식: Markdown
톤: 친절하지만 전문적인 한국어
```
