# 31. 환경 변수 레퍼런스

> 공식 문서 기준 모든 환경 변수는 기본적으로 `~/.hermes/.env`에 둡니다. 직접 파일을 편집해도 되고, `hermes config set VAR value`로 넣어도 됩니다.

## 먼저 기억할 원칙

Hermes 설정에서 가장 중요한 분리는 단 두 가지입니다. **비밀값은 `.env`**, 일반 구조 설정은 `config.yaml`입니다. 그래서 모델 이름, 기본 프로바이더, 터미널 백엔드 같은 값은 보통 `config.yaml`에 두고, API 키나 토큰은 `.env`에 둡니다.

```bash
hermes config set OPENROUTER_API_KEY sk-or-...
hermes config set API_SERVER_ENABLED true
```

환경 변수는 주로 다섯 부류로 나뉩니다.

1. LLM 프로바이더 인증
2. 프로바이더별 base URL 오버라이드
3. 음성/STT/TTS 관련 키
4. API 서버, 브라우저, 메시징 기능용 키
5. Hermes 홈 경로와 런타임 동작 제어

## 자주 쓰는 프로바이더 변수

공식 레퍼런스는 매우 길지만, 실무에서 자주 만지는 핵심만 추리면 아래와 같습니다.

| 변수 | 용도 |
|------|------|
| `OPENROUTER_API_KEY` | 가장 범용적인 추천 선택지 |
| `OPENAI_API_KEY` | OpenAI 호환 커스텀 엔드포인트와 함께 사용 |
| `OPENAI_BASE_URL` | vLLM, SGLang, Ollama 프록시 등 커스텀 서버 주소 |
| `ANTHROPIC_API_KEY` | Anthropic Console 키 |
| `GLM_API_KEY` | z.ai / ZhipuAI GLM |
| `KIMI_API_KEY` | Kimi / Moonshot AI |
| `MINIMAX_API_KEY` | MiniMax 글로벌 엔드포인트 |
| `MINIMAX_CN_API_KEY` | MiniMax 중국 엔드포인트 |
| `DASHSCOPE_API_KEY` | Alibaba Cloud DashScope, Qwen 계열 |
| `HF_TOKEN` | Hugging Face Inference Providers |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway |
| `KILOCODE_API_KEY` | Kilo Code |
| `OPENCODE_ZEN_API_KEY` | OpenCode Zen |
| `OPENCODE_GO_API_KEY` | OpenCode Go |

같은 계열의 `*_BASE_URL` 변수는 대부분 "기본 엔드포인트 대신 다른 주소를 쓰고 싶을 때"만 필요합니다. 기본 공식 서버를 그대로 쓴다면 키만 넣고 끝나는 경우가 많습니다.

## Copilot, 모델 우선순위, 경로 변수

Copilot 계열은 약간 다릅니다. 문서상 우선순위는 `COPILOT_GITHUB_TOKEN`이 가장 높고, 그다음 `GH_TOKEN`, 마지막이 `GITHUB_TOKEN`입니다. 즉, GitHub 토큰 이름이 여러 개여도 Hermes가 무작정 섞어 쓰는 것이 아니라 정해진 우선순위를 따릅니다.

| 변수 | 의미 |
|------|------|
| `COPILOT_GITHUB_TOKEN` | Copilot API용 최우선 GitHub 토큰 |
| `GH_TOKEN` | 차순위 GitHub 토큰, `gh` CLI와도 공유 |
| `GITHUB_TOKEN` | 세 번째 우선순위 |
| `HERMES_COPILOT_ACP_COMMAND` | Copilot ACP 실행 바이너리 경로 |
| `HERMES_COPILOT_ACP_ARGS` | ACP 실행 인자 덮어쓰기 |
| `HERMES_MODEL` | 게이트웨이 등에서 우선 확인하는 모델 이름 |
| `LLM_MODEL` | `HERMES_MODEL`이 없을 때의 기본 모델 |
| `HERMES_HOME` | Hermes 홈 디렉터리 변경 |

특히 `HERMES_HOME`은 단순 경로 변경이 아닙니다. 이 값을 바꾸면 설정 디렉터리뿐 아니라 게이트웨이 PID 파일과 systemd 서비스 이름 범위까지 달라지므로, 여러 설치를 병렬 운영할 때 유용합니다.

## 음성 기능 관련 변수

음성 기능은 모든 것이 별도 키를 요구하지는 않습니다. 문서에서도 로컬 Whisper, Edge TTS, NeuTTS 같은 경로는 무키(no-key) 사용이 가능하다고 설명합니다.

| 변수 | 용도 |
|------|------|
| `GROQ_API_KEY` | Groq Whisper STT |
| `VOICE_TOOLS_OPENAI_KEY` | OpenAI STT/TTS 공용 우선 키 |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS |
| `HERMES_LOCAL_STT_COMMAND` | 로컬 STT 명령 템플릿 |
| `HERMES_LOCAL_STT_LANGUAGE` | 로컬 STT 기본 언어 |

`VOICE_TOOLS_OPENAI_KEY`는 이름 그대로 음성 계열 OpenAI 기능에서 우선적으로 쓰입니다. 일반 `OPENAI_API_KEY`와 역할이 겹칠 수 있지만, 음성만 별도 과금/계정으로 분리하고 싶을 때 유용합니다.

## API 서버, 브라우저, 메시징

Hermes의 부가 기능도 대부분 환경 변수로 켜집니다.

| 변수 | 용도 |
|------|------|
| `API_SERVER_ENABLED` | OpenAI 호환 API 서버 활성화 |
| `API_SERVER_KEY` | API 서버 Bearer 인증 키 |
| `API_SERVER_CORS_ORIGINS` | 브라우저 직결용 CORS 허용 출처 |
| `BROWSERBASE_API_KEY` | Browserbase 연동 |
| `BROWSERBASE_PROJECT_ID` | Browserbase 프로젝트 지정 |
| `BROWSER_USE_API_KEY` | 별도 브라우저 사용 API |
| `TELEGRAM_ALLOWED_USERS` | Telegram 허용 사용자 목록 |
| `DISCORD_ALLOWED_USERS` | Discord 허용 사용자 목록 |
| `WHATSAPP_ALLOWED_USERS` | WhatsApp 허용 번호 목록 |
| `SLACK_ALLOWED_USERS` | Slack 허용 사용자 목록 |

메시징에서는 "누가 접근 가능한가"를 환경 변수로 조이는 패턴이 중요합니다. 특히 allowlist를 비워 두면 운영 실수가 나기 쉬우므로, 봇을 열기 전에 허용 사용자 범위를 먼저 정의하는 편이 안전합니다.

## 추천 `.env` 시작점

```bash
OPENROUTER_API_KEY=sk-or-your-key
GROQ_API_KEY=your-groq-key
API_SERVER_ENABLED=true
API_SERVER_KEY=change-me
TELEGRAM_ALLOWED_USERS=123456789
HERMES_HOME=~/.hermes
```

:::tip
변수가 너무 많아 보여도 처음부터 전부 채울 필요는 없습니다. 보통은 "주 프로바이더 키 1개 + 필요 기능용 키 몇 개"만 있어도 충분합니다.
:::

이 장의 핵심은 변수 이름을 외우는 것이 아니라, 어떤 값을 `.env`에 넣어야 하는지 감각을 잡는 것입니다. 키는 `.env`, 구조는 `config.yaml`, 그리고 경로나 인증 우선순위가 헷갈릴 때는 `hermes config set`과 `hermes doctor`를 같이 쓰면 대부분 빠르게 정리됩니다.

---

**이전:** [← 30. CLI 레퍼런스](#30-cli-reference)
**다음:** [32. FAQ와 문제 해결 →](#32-faq)
