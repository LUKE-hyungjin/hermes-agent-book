# 09. 프로바이더 설정

> Hermes는 하나의 모델 회사에 묶이지 않습니다. OAuth형 로그인, API 키 기반 허브, OpenAI 호환 커스텀 엔드포인트를 모두 같은 CLI 흐름 안에서 다룰 수 있습니다.

## 가장 쉬운 시작

대부분의 사용자는 아래 한 줄부터 시작하면 됩니다.

```bash
hermes model
```

이 명령은 현재 설치본이 지원하는 프로바이더 목록을 보여 주고, 필요한 경우 로그인(OAuth) 또는 API 키 입력 흐름으로 연결해 줍니다. 초반에는 `.env`를 직접 편집하기보다 이 경로가 가장 안전합니다.

:::tip
처음이라면 복잡하게 비교하지 말고 그냥 `hermes model`을 실행해 가장 안내가 쉬운 옵션부터 고르세요. OpenRouter나 커스텀 엔드포인트 비교는 익숙해진 뒤 해도 늦지 않습니다.
:::

## 현재 문서 기준으로 자주 쓰는 분류

공식 문서와 현재 설치 흐름을 묶어서 보면, 프로바이더는 대략 세 가지로 이해하면 쉽습니다.

| 분류 | 예시 | 적합한 상황 |
|------|------|-------------|
| OAuth/로그인형 | Nous Portal, OpenAI Codex 등 | 빠르게 시작하고 싶을 때 |
| API 키형 | OpenRouter, Anthropic, GLM(z.ai), Kimi, MiniMax, Hugging Face, AI Gateway 등 | 명시적 키 관리와 모델 라우팅이 필요할 때 |
| 커스텀 엔드포인트 | Ollama, vLLM, SGLang, 사내 OpenAI 호환 서버 | 로컬 모델, 사내망, 자체 게이트웨이 |

지원 목록은 버전마다 조금씩 바뀔 수 있으므로, **최종 기준은 `hermes model`과 공식 프로바이더 문서**로 보는 편이 안전합니다.

## 어떤 선택이 쉬운가요?

| 목적 | 추천 시작점 |
|------|-------------|
| 가장 빠른 입문 | `hermes model`에서 로그인형 프로바이더 선택 |
| 여러 모델 비교 | OpenRouter |
| Claude 계열 직접 사용 | Anthropic |
| 로컬/사내 서버 연결 | Custom endpoint |
| 연구/오픈모델 실험 | Hugging Face 또는 커스텀 엔드포인트 |

## 비밀값과 일반 설정의 위치

기본 원칙은 단순합니다.

- 비밀값: `~/.hermes/.env`
- 일반 설정: `~/.hermes/config.yaml`

예시:

```bash
OPENROUTER_API_KEY=***
ANTHROPIC_API_KEY=***
OPENAI_API_KEY=***
OPENAI_BASE_URL=http://localhost:11434/v1
```

## 커스텀 엔드포인트 연결

Hermes는 OpenAI 호환 API를 제공하는 로컬 또는 사내 서버를 붙일 수 있습니다. 이때 가장 중요한 것은 **URL만 맞추는 것**이 아니라, 실제 모델 이름과 컨텍스트 길이를 함께 맞추는 것입니다.

공식 FAQ 예시는 이런 흐름입니다.

```bash
hermes model
# Select: Custom endpoint
# API base URL: http://localhost:11434/v1
# API key: ollama
# Model name: qwen3.5:27b
# Context length: 32768
```

로컬 모델 연결이 어색하게 느껴질 때는 직접 `config.yaml`을 쓰기보다 먼저 이 대화형 흐름을 한 번 통과하는 편이 덜 헷갈립니다.

## 실행 시 일시적으로 바꾸기

기본값을 유지한 채 이번 실행만 다른 조합을 쓰고 싶다면 CLI 인자가 편합니다.

```bash
hermes chat --provider openrouter --model anthropic/claude-sonnet-4.5
hermes chat --provider anthropic --model claude-sonnet-4
hermes chat --provider custom --model qwen3.5:27b
```

다만 프로바이더 이름과 모델 표기는 버전/벤더 정책에 따라 바뀔 수 있으므로, 실제 사용 시에는 `hermes model`에서 보이는 표기를 우선하세요.

## 빠른 점검 흐름

```bash
hermes model
hermes status
hermes chat -q "현재 연결된 모델과 프로바이더를 알려줘"
```

여기서 응답이 정상이고 상태 화면에 인증/설정이 보인다면 프로바이더 설정은 거의 끝난 것입니다.

:::tip
프로바이더를 고를 때는 "최고 성능 모델이 무엇인가"보다 "내 작업에서 인증, 비용, 속도, 안정성을 가장 관리하기 쉬운 조합이 무엇인가"를 먼저 보는 편이 훨씬 실용적입니다.
:::

---

**이전:** [← 08. 세션 관리](#08-sessions)
**다음:** [10. 보안 →](#10-security)
