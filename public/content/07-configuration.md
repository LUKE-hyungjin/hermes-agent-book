# 07. 설정 관리

> Hermes의 모든 핵심 설정은 `~/.hermes/` 아래에 모이며, 비밀값은 `.env`, 일반 설정은 `config.yaml`에 두는 것이 기본 원칙입니다.

## 설정 디렉터리 구조

Hermes는 설정을 여러 파일에 흩뿌리지 않고 하나의 홈 디렉터리에 모아 둡니다. 기본 위치는 `~/.hermes/`입니다.

```text
~/.hermes/
├── config.yaml
├── .env
├── auth.json
├── SOUL.md
├── state.db
├── memories/
├── skills/
├── cron/
├── sessions/
└── logs/
```

| 경로 | 역할 |
|------|------|
| `config.yaml` | 모델, 터미널 백엔드, TTS, 압축 등 일반 설정 |
| `.env` | API 키, 토큰, 비밀번호 같은 비밀값 |
| `auth.json` | OAuth 인증 정보 |
| `SOUL.md` | 에이전트 기본 성격 |
| `state.db` | 세션 메타데이터와 검색 인덱스(SQLite) |
| `memories/` | 장기 메모리 저장 |
| `skills/` | 설치/생성된 스킬 |
| `sessions/` | 주로 raw transcript / gateway 기록 |
| `logs/` | 실행 로그 |

## 자주 쓰는 설정 명령

CLI에서 파일을 직접 열지 않아도 대부분의 설정을 다룰 수 있습니다.

```bash
hermes config
hermes config edit
hermes config set model anthropic/claude-opus-4
hermes config set terminal.backend docker
hermes config set OPENROUTER_API_KEY sk-or-...
hermes config check
hermes config migrate
```

`hermes config set`은 꽤 똑똑합니다. API 키처럼 민감한 값은 자동으로 `.env`에 저장하고, 일반 키는 `config.yaml`에 넣습니다.

:::tip
직접 파일을 수정해도 되지만, 초반에는 `hermes config set`을 우선 쓰는 편이 안전합니다. 저장 위치를 실수할 가능성이 크게 줄어듭니다.
:::

## 우선순위 규칙

같은 항목이 여러 곳에 있을 때 Hermes는 아래 순서로 값을 결정합니다.

| 우선순위 | 원천 | 예시 |
|---------|------|------|
| 1 | CLI 인자 | `hermes chat --model ...` |
| 2 | `config.yaml` | 기본 모델, 도구셋, TTS |
| 3 | `.env` | 환경 변수 기반 대체값 |
| 4 | 내장 기본값 | 아무 것도 지정하지 않았을 때 |

실무적으로는 다음 한 줄만 기억하면 됩니다.

- 비밀값: `.env`
- 나머지 설정: `config.yaml`

## 환경 변수 치환

`config.yaml` 안에서 `${VAR}` 문법으로 환경 변수를 참조할 수 있습니다.

```yaml
auxiliary:
  vision:
    api_key: ${GOOGLE_API_KEY}
    base_url: ${CUSTOM_VISION_URL}

delegation:
  api_key: ${DELEGATION_KEY}
```

여러 변수를 한 값에 섞는 것도 가능합니다.

```yaml
api:
  url: "${HOST}:${PORT}"
```

정의되지 않은 변수는 빈 문자열로 사라지지 않고 `${UNDEFINED_VAR}` 그대로 유지됩니다. 따라서 값이 치환되지 않았다면 오타나 누락을 즉시 알아채기 쉽습니다.

## 설정할 때 가장 많이 만지는 항목

| 항목 | 예시 | 설명 |
|------|------|------|
| 모델 | `model: anthropic/claude-sonnet-4` | 기본 추론 모델 |
| 터미널 백엔드 | `terminal.backend: docker` | 로컬/도커/SSH 실행 환경 |
| 도구셋 | `toolsets: hermes-cli` | 플랫폼별 활성 도구 |
| TTS/STT | `tts.provider`, `stt.provider` | 음성 입출력 |
| 표시 방식 | `display.resume_display: minimal` | 세션 복구 패널 제어 |

## 추천 초기 설정 예시

아래처럼 시작하면 가장 무난합니다.

```yaml
model: openrouter/anthropic/claude-sonnet-4

terminal:
  backend: local
  cwd: "."
  timeout: 180

display:
  resume_display: full

tts:
  provider: edge

stt:
  provider: local
```

그리고 비밀값은 `.env`에 둡니다.

```bash
OPENROUTER_API_KEY=sk-or-your-key
GROQ_API_KEY=your-groq-key
ELEVENLABS_API_KEY=your-elevenlabs-key
```

## 업데이트 뒤 점검

업데이트 이후 Hermes가 새 설정 키를 요구하는 경우가 있습니다. 이때는 아래 두 명령이 핵심입니다.

```bash
hermes config check
hermes config migrate
```

| 명령 | 역할 |
|------|------|
| `check` | 누락된 옵션, 오래된 구성 탐지 |
| `migrate` | 필요한 새 설정을 대화형으로 추가 |

:::info
설정 문제를 디버깅할 때는 "모델이 안 된다"보다 "어느 파일에 어떤 값이 들어갔는가"를 먼저 확인해야 합니다. Hermes는 구조가 명확해서, 파일 위치만 이해하면 문제의 절반은 해결됩니다.
:::

설정 관리는 Hermes 사용 경험 전체를 좌우합니다. 특히 `config.yaml`과 `.env`의 역할을 분리해 두면 이후 메시징, 프로바이더, 음성, API 서버 설정도 훨씬 수월해집니다.

---

**이전:** [← 06. CLI 인터페이스](#06-cli)
**다음:** [08. 세션 관리 →](#08-sessions)
