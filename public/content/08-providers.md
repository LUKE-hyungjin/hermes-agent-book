# 08. 프로바이더 설정

> Hermes는 하나의 모델 제공자에 고정되지 않으며, OAuth형 서비스부터 API 키 기반 허브, 로컬 OpenAI 호환 서버까지 같은 인터페이스로 바꿔 쓸 수 있습니다.

## 왜 프로바이더를 따로 이해해야 하나요?

Hermes에서 "어떤 모델을 쓰는가"는 단순 취향 문제가 아닙니다. 비용, 속도, 인증 방식, 사용 가능한 모델 계열, 장기 세션 안정성까지 모두 프로바이더 선택의 영향을 받습니다. 예를 들어 처음 시작하는 사용자는 `hermes model`로 OAuth 로그인을 선호할 수 있고, 파워유저는 OpenRouter처럼 여러 벤더를 한 키로 다루는 허브를 더 좋아할 수 있습니다. 또 팀 환경에서는 사내 OpenAI 호환 엔드포인트나 로컬 서버를 붙이는 경우도 많습니다.

## 가장 쉬운 시작

대부분의 사용자는 아래 명령부터 시작하면 됩니다.

```bash
hermes model
```

이 명령은 지원 프로바이더 목록을 보여 주고, 필요한 경우 OAuth 로그인 또는 API 키 입력 흐름을 안내합니다. 설정 파일 구조를 아직 잘 모르는 초반에는 직접 `.env`를 편집하기보다 이 마법사를 먼저 쓰는 편이 안전합니다.

## 주요 프로바이더 비교

| 프로바이더 | 인증 방식 | 적합한 상황 |
|-----------|-----------|-------------|
| Nous Portal | OAuth | 가장 빠른 시작, 설정 난이도 최소화 |
| Anthropic | Claude 인증 또는 API 키 | Claude 계열을 직접 안정적으로 사용 |
| OpenRouter | API 키 | 여러 모델을 한 계정으로 비교하고 싶을 때 |
| GitHub Copilot 계열 | OAuth / 토큰 | 개발자 워크플로우와 친화적일 때 |
| Hugging Face | API 키 | 오픈 모델 실험과 연구 |
| Custom Endpoint | URL + 키 | Ollama, vLLM, 사내 게이트웨이 연결 |

Hermes 문서 기준으로 OpenRouter, Anthropic, Hugging Face, Copilot 계열 외에도 GLM, Kimi, MiniMax, Alibaba Cloud, OpenCode 계열 같은 다양한 제공자와 호환됩니다.

## 설정 파일 예시

비밀값은 `~/.hermes/.env`, 일반 설정은 `~/.hermes/config.yaml`에 두는 것이 기본입니다.

```bash
OPENROUTER_API_KEY=sk-or-your-key
ANTHROPIC_API_KEY=your-anthropic-key
HF_TOKEN=hf_your_token
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://localhost:11434/v1
```

```yaml
model:
  provider: openrouter
  default: anthropic/claude-sonnet-4.6
```

이렇게 두면 평소에는 OpenRouter를 기본값으로 쓰고, 필요할 때만 CLI 인자로 덮어쓸 수 있습니다.

## 커스텀 엔드포인트 연결

Hermes는 OpenAI 호환 API를 제공하는 로컬 또는 사내 서버를 붙일 수 있습니다. Ollama, vLLM, SGLang 같은 엔진을 쓸 때 특히 유용합니다.

```yaml
model:
  provider: custom
  default: qwen3.5:27b
  base_url: http://localhost:11434/v1
```

직접 연결할 때는 단순히 URL만 맞추는 것이 아니라, 실제 모델 이름과 컨텍스트 길이, 타임아웃, 스트리밍 지원 여부까지 함께 점검해야 합니다.

## 실행 시 일시적으로 바꾸기

기본값을 건드리지 않고 이번 실행만 다른 프로바이더를 테스트하려면 CLI 인자가 가장 편합니다.

```bash
hermes chat --provider openrouter --model anthropic/claude-sonnet-4.6
hermes chat --provider anthropic --model claude-sonnet-4
hermes chat --provider custom --model qwen3.5:27b
```

이 방식은 비용 비교, 품질 비교, 벤더 장애 우회에 유용합니다. 운영 중에는 "기본값은 안정형, 실험은 CLI override" 규칙을 잡아 두면 설정이 덜 꼬입니다.

## 선택 기준

| 목적 | 추천 선택 |
|------|-----------|
| 가장 쉬운 입문 | `hermes model` + OAuth 계열 |
| 모델 선택 폭 최우선 | OpenRouter |
| Claude 중심 워크플로우 | Anthropic 직접 연결 또는 OpenRouter 경유 |
| 폐쇄망/사내 환경 | Custom Endpoint |
| 저비용 로컬 실험 | Ollama 등 로컬 서버 |
| 빠른 비교 테스트 | 실행 시 `--provider`, `--model` 조합 |

:::tip
프로바이더를 고를 때 "어떤 모델이 최고인가"보다 "내 작업에서 인증, 비용, 속도, 도구 호출 안정성이 어떤 조합으로 가장 관리하기 쉬운가"를 먼저 보세요. Hermes는 한 번 정하면 영원히 고정하는 도구가 아니라, 작업에 맞춰 라우팅해 가는 구조에 더 가깝습니다.
:::

## 빠른 점검 흐름

연결이 제대로 되었는지 확인할 때는 아래 세 줄이면 충분합니다.

```bash
hermes model
hermes config
hermes chat -q "현재 연결된 모델과 프로바이더를 알려줘"
```

여기서 응답이 정상이라면 프로바이더 설정은 거의 끝난 것입니다. 이후에는 도구셋, 메시징, 음성, 장기 세션 운용 같은 상위 기능을 그 위에 쌓아 가면 됩니다.

---

**이전:** [← 07. 세션 관리](#07-sessions)
**다음:** [09. 보안 →](#09-security)
