# 30. 프로필

> 프로필은 하나의 Hermes 설치 안에서 여러 개의 완전히 독립된 에이전트를 만드는 기능입니다.

## 프로필이 필요한 이유

공식 문서에서 프로필은 "서로 오염되지 않는 독립 Hermes 환경"으로 설명됩니다. 즉, 코딩 전용 에이전트와 개인 비서 봇, 리서치 에이전트를 한 머신에서 동시에 돌리되, 각자의 API 키·세션·메모리·스킬을 분리할 수 있습니다.

## 프로필이 분리하는 것

| 항목 | 분리 여부 |
|------|-----------|
| `config.yaml` | 분리 |
| `.env` | 분리 |
| `SOUL.md` | 분리 |
| 메모리 | 분리 |
| 세션 | 분리 |
| 스킬 | 분리 |
| Cron/상태 DB | 분리 |

즉, 프로필은 단순한 별칭이 아니라 **별도 Hermes 홈 디렉터리 집합**에 가깝습니다.

## 가장 빠른 시작

```bash
hermes profile create coder
coder setup
coder chat
```

공식 문서가 강조하는 재미있는 점은 프로필을 만들면 곧바로 `coder`, `assistant` 같은 전용 명령이 생긴다는 것입니다.

## 생성 방식

| 명령 | 의미 |
|------|------|
| `hermes profile create mybot` | 완전 새 프로필 |
| `--clone` | 설정과 인증만 복사 |
| `--clone-all` | 메모리, 세션, 스킬까지 전부 복사 |
| `--clone-from coder` | 특정 프로필에서 복제 |

예시:

```bash
hermes profile create work --clone
hermes profile create backup --clone-all
hermes profile create research --clone --clone-from coder
```

## alias와 `-p`

프로필은 전용 명령 alias와 `-p` 플래그 두 방식으로 접근할 수 있습니다.

공식 문서 기준 alias는 보통 `~/.local/bin/<profile-name>` 쪽에 만들어집니다. 따라서 프로필을 만든 뒤 `coder: command not found`가 나오면 PATH에 `~/.local/bin`이 들어 있는지 먼저 확인하세요.

```bash
coder chat
coder gateway start

hermes -p coder chat
hermes --profile=coder doctor
```

| 방식 | 장점 |
|------|------|
| alias | 짧고 읽기 쉬움 |
| `-p` | 스크립트나 자동화에 유연 |

## 기본 프로필 전환

`kubectl config use-context`처럼 기본 대상을 바꾸는 기능도 있습니다.

```bash
hermes profile use coder
hermes chat
hermes tools
hermes profile use default
```

CLI 프롬프트와 배너에도 현재 프로필명이 표시되므로, 지금 어느 에이전트에 붙어 있는지 헷갈릴 일이 적습니다.

:::tip
개인용과 업무용을 분리하고 싶다면, 먼저 `default`는 개인용으로 두고 `work --clone`으로 업무 프로필을 만든 뒤 API 키와 SOUL만 갈아끼우는 방식이 가장 편합니다.
:::

## 게이트웨이도 분리됩니다

공식 문서는 각 프로필이 자신의 게이트웨이를 별도 프로세스로 가질 수 있다고 설명합니다.

```bash
coder gateway start
assistant gateway start
```

각 프로필의 `.env`가 서로 분리되므로 Telegram/Discord/Slack 토큰도 따로 둘 수 있습니다.

```bash
nano ~/.hermes/profiles/coder/.env
nano ~/.hermes/profiles/assistant/.env
```

## 토큰 잠금

문서에는 두 프로필이 실수로 같은 봇 토큰을 쓰면, 두 번째 게이트웨이를 차단하는 안전 장치가 있다고 언급됩니다. 이는 동일 봇을 서로 다른 프로필이 동시에 점유하는 혼란을 막기 위한 것입니다.

## 어떤 식으로 나누면 좋을까?

| 프로필 | 추천 역할 |
|--------|-----------|
| `coder` | 코드 수정, 리뷰, 로컬 도구 중심 |
| `assistant` | Telegram/Discord 개인 비서 |
| `research` | 웹 검색, 장문 조사 |
| `ops` | 서버 점검, 자동화, Cron |

:::info
프로필은 "여러 개 설치"의 불편함 없이, 하나의 Hermes에서 여러 개의 성격과 권한 경계를 운영하게 해 주는 기능입니다. 장기적으로 쓸수록 가치가 커집니다.
:::

---

**이전:** [← 29. Docker 실행](#29-docker)
**다음:** [31. API 서버 →](#31-api-server)
