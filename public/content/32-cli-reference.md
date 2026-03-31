# 32. CLI 레퍼런스

> 이 장은 터미널에서 직접 실행하는 `hermes` 명령을 정리한 **요약형 가이드**입니다. 대화 중 `/model` 같은 슬래시 명령이 아니라, 셸에서 치는 실제 CLI 엔트리포인트를 다룹니다.

:::tip
초보자라면 아래 다섯 개만 먼저 기억해도 충분합니다: `hermes`, `hermes model`, `hermes doctor`, `hermes -c`, `hermes gateway`.
:::

## 전체 진입점

공식 문서 기준 전역 문법은 아래 한 줄로 요약됩니다.

```bash
hermes [global-options] <command> [subcommand/options]
```

즉, `hermes`는 하나의 거대한 실행기이고, `chat`, `model`, `gateway`, `skills` 같은 하위 명령이 그 아래에 붙는 구조입니다. 이전 장의 "CLI 사용법"이 운영 감각을 설명했다면, 이 장은 "어떤 명령이 어디에 속하는가"를 빠르게 찾기 위한 표에 가깝습니다.

## 자주 쓰는 전역 옵션

전역 옵션은 특정 하위 명령에만 묶이지 않고, 세션 복구나 워크트리처럼 실행 전반의 방식을 바꿉니다.

| 옵션 | 의미 |
|------|------|
| `--version`, `-V` | 버전 출력 후 종료 |
| `--resume <session>`, `-r` | ID나 제목으로 특정 세션 재개 |
| `--continue [name]`, `-c` | 가장 최근 세션, 또는 제목이 맞는 최근 세션 재개 |
| `--worktree`, `-w` | 격리된 Git worktree에서 실행 |
| `--yolo` | 위험 명령 승인 프롬프트 생략 |
| `--pass-session-id` | 세션 ID를 시스템 프롬프트에 포함 |

특히 `-c`, `-r`, `-w`는 장기 작업에서 체감 차이가 큽니다. 세션을 끊지 않고 이어 가거나, 병렬 에이전트를 충돌 없이 띄우는 데 핵심입니다.

## 최상위 명령 구조

문서에 나오는 주요 최상위 명령은 다음과 같습니다. 전체 참조라기보다 자주 쓰는 축을 먼저 잡아 주는 표로 읽으면 됩니다.

| 명령 | 역할 |
|------|------|
| `hermes chat` | 대화형 세션 또는 1회성 질의 실행 |
| `hermes model` | 기본 프로바이더와 모델 선택 |
| `hermes gateway` | 메시징/API 게이트웨이 실행 및 관리 |
| `hermes setup` | 설치 후 초기 설정 마법사 |
| `hermes login` / `logout` | OAuth 기반 인증 처리 |
| `hermes status` | 에이전트, 인증, 플랫폼 상태 확인 |
| `hermes cron` | 크론 스케줄러 점검 |
| `hermes doctor` | 설정/의존성 문제 진단 |
| `hermes config` | 설정 조회, 수정, 마이그레이션 |
| `hermes skills` | 스킬 탐색, 설치, 감사, 발행 |
| `hermes tools` | 플랫폼별 도구 활성화 설정 |
| `hermes sessions` | 세션 목록, 내보내기, 삭제, 이름 변경 |
| `hermes insights` | 토큰·비용·활동 분석 |
| `hermes update` | 최신 코드 pull 및 재설치 |
| `hermes uninstall` | 시스템에서 Hermes 제거 |

모든 명령을 다 외울 필요는 없습니다. 실사용에서는 `chat`, `model`, `config`, `skills`, `gateway`, `doctor`, `sessions` 정도가 핵심 축입니다.

## `hermes chat` 옵션

가장 많이 쓰는 하위 명령은 역시 `chat`입니다.

```bash
hermes chat [options]
```

공식 문서가 강조하는 주요 옵션은 아래와 같습니다.

| 옵션 | 용도 |
|------|------|
| `-q`, `--query "..."` | 비대화형 1회 실행 |
| `-m`, `--model <model>` | 이번 실행에만 모델 덮어쓰기 |
| `--provider <provider>` | 프로바이더 강제 지정 |
| `-t`, `--toolsets <csv>` | 허용 도구셋 지정 |
| `-s`, `--skills <name>` | 스킬 선탑재, 반복 가능 |
| `-v`, `--verbose` | 디버그 성격의 상세 출력 |
| `-Q`, `--quiet` | 배너/스피너/도구 프리뷰 축소 |
| `--resume`, `--continue` | `chat` 내부에서도 세션 재개 가능 |
| `--worktree` | 해당 실행만 격리된 worktree 사용 |
| `--checkpoints` | 파괴적 파일 변경 전 체크포인트 생성 |
| `--yolo` | 승인 절차 생략 |

대표 예시는 다음과 같습니다.

```bash
hermes
hermes chat -q "Summarize the latest PRs"
hermes chat --provider openrouter --model anthropic/claude-sonnet-4.6
hermes chat --toolsets web,terminal,skills
hermes chat --quiet -q "Return only JSON"
hermes chat --worktree -q "Review this repo and open a PR"
```

`--quiet`는 자동화 출력에, `--verbose`는 디버깅에, `--worktree`는 병렬 코드 작업에 특히 유용합니다.

## `hermes model`과 세션 중 모델 전환

기본 모델을 고르는 표준 진입점은 다음입니다.

```bash
hermes model
```

이 명령을 쓰면 프로바이더 전환, OAuth 로그인, 커스텀 엔드포인트 설정, 기본값 저장까지 한 흐름에서 처리할 수 있습니다. 이미 대화 중이라면 세션을 나가지 않고 `/model` 슬래시 명령으로 바꿀 수 있습니다.

```text
/model
/model claude-sonnet-4
/model zai:glm-5
/model custom:qwen-2.5
```

즉, 셸 명령의 `hermes model`은 "기본값 재설정", 슬래시 명령의 `/model`은 "현재 세션 내 전환"으로 이해하면 헷갈리지 않습니다.

## 실전에서 자주 묶는 흐름

처음 설정이 끝난 뒤 가장 자주 보게 될 조합은 아래와 비슷합니다.

```bash
hermes chat --continue
hermes config check
hermes skills browse
hermes gateway
hermes doctor
```

| 상황 | 추천 명령 |
|------|-----------|
| 방금 하던 작업 이어가기 | `hermes -c` |
| 모델 바꾸기 | `hermes model` |
| 설정 이상 점검 | `hermes config check` 또는 `hermes doctor` |
| 스킬 탐색 | `hermes skills ...` |
| 게이트웨이/봇 운영 | `hermes gateway` |

이 문서를 레퍼런스로 쓸 때는 "명령 이름을 찾고", 세부 사용감은 [05. CLI 인터페이스](#06-cli)에서 보완하면 좋습니다. Hermes CLI는 기능이 많지만 구조는 단순합니다. 전역 옵션으로 실행 방식을 정하고, 하위 명령으로 기능 영역을 고른다고 생각하면 대부분의 명령이 빠르게 정리됩니다.

---

**이전:** [← 31. API 서버](#31-api-server)
**다음:** [33. 핵심 환경 변수 →](#33-env-vars)
