# 34. FAQ와 문제 해결

> 이 장은 공식 문서의 FAQ와 운영 중 자주 부딪히는 문제를 한국어 기준으로 빠르게 다시 찾기 쉽게 정리한 문서입니다.

## 자주 묻는 질문

### 어떤 LLM 프로바이더를 쓸 수 있나요?

공식 문서 기준 Hermes는 **OpenAI 호환 API라면 거의 대부분 연결 가능**합니다. 대표적으로 OpenRouter, Nous Portal, OpenAI, Anthropic 계열 프록시, Google Gemini 계열 프록시, z.ai, Kimi, MiniMax, 그리고 Ollama·vLLM·llama.cpp·SGLang 같은 로컬 서버를 지원합니다.

처음엔 `hermes model`에서 프로바이더를 선택하고, 고급 설정이 필요할 때만 `~/.hermes/.env`를 직접 만지는 흐름이 가장 안전합니다.

### Windows에서 바로 되나요?

네이티브 Windows 실행은 공식 권장 경로가 아닙니다. 문서에서는 **WSL2 안에서 Hermes를 실행하는 방식**을 권합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

즉, Windows 사용자는 "WSL2를 리눅스 호스트처럼 취급한다"는 관점으로 접근하면 됩니다.

### 내 데이터가 어딘가로 전송되나요?

Hermes 자체가 별도 텔레메트리나 분석 데이터를 수집하는 구조는 아니라고 문서에 명시되어 있습니다. 네트워크로 나가는 것은 사용자가 설정한 LLM 프로바이더 API 호출이며, 대화 기록·메모리·스킬은 기본적으로 `~/.hermes/` 아래에 로컬 저장됩니다.

### 오프라인이나 로컬 모델로 쓸 수 있나요?

가능합니다. `hermes model`에서 Custom endpoint를 선택해 로컬 OpenAI 호환 서버 URL을 넣으면 됩니다.

```bash
hermes model
# Custom endpoint 선택
# API base URL: http://localhost:11434/v1
# API key: ollama
# Model name: qwen3.5:27b
# Context length: 32768
```

또는 `config.yaml`에 직접 넣어도 됩니다.

```yaml
model:
  default: qwen3.5:27b
  provider: custom
  base_url: http://localhost:11434/v1
```

문서에서 특히 강조하는 함정은 **컨텍스트 길이 불일치**입니다. 예를 들어 Ollama에서 `num_ctx`를 바꿨다면 Hermes 쪽 컨텍스트 길이도 실제 값과 맞춰야 합니다.

### 비용은 얼마나 드나요?

Hermes 자체는 무료 오픈소스입니다. 비용은 사용자가 연결한 LLM API 요금에서만 발생합니다. 로컬 모델만 쓰면 Hermes 자체 사용 비용은 사실상 0원에 가깝습니다.

### 여러 사람이 한 인스턴스를 같이 써도 되나요?

가능합니다. Telegram, Discord, Slack, WhatsApp, Home Assistant 게이트웨이를 통해 같은 Hermes 인스턴스에 여러 사용자가 접속할 수 있습니다. 다만 문서도 allowlist와 DM pairing 같은 접근 제어를 꼭 설정하라고 안내합니다.

### 메모리와 스킬은 무엇이 다른가요?

메모리는 "사실"을 저장합니다. 사용자 선호, 프로젝트 정보, 반복적으로 기억해야 할 상태가 여기에 들어갑니다. 반대로 스킬은 "절차"를 저장합니다. 특정 작업을 어떤 순서로 수행해야 하는지, 어떤 함정을 피해야 하는지 같은 작업 지식입니다.

### Python 프로젝트 안에서 직접 쓸 수 있나요?

공식 FAQ에는 `AIAgent`를 import해 프로그래밍 방식으로 호출하는 예시가 있습니다. 즉, Hermes는 CLI 앱이면서도 Python 코드에서 재사용 가능한 라이브러리 역할을 합니다.

## 자주 막히는 문제와 빠른 해결

### `hermes: command not found`

설치 후 이런 오류가 나면 대부분 셸 PATH가 아직 갱신되지 않았거나, 설치 셸과 실행 셸이 다릅니다. 우선 새 터미널을 열고, 그래도 안 되면 설치 로그와 `which hermes`를 확인하는 편이 좋습니다. 그래도 막히면 `hermes doctor`가 가장 빠른 진단 시작점입니다.

### 모델이 연결되는데 응답이 이상하거나 끊김

원인은 의외로 모델 자체보다 설정 불일치인 경우가 많습니다.

| 점검 항목 | 확인 방법 |
|-----------|-----------|
| API 키 누락 | `~/.hermes/.env` 확인 |
| base URL 오타 | `OPENAI_BASE_URL` 등 점검 |
| 컨텍스트 길이 불일치 | 로컬 서버 설정과 Hermes 값 비교 |
| 오래된 설정 | `hermes config check` 후 `hermes config migrate` |

### 게이트웨이나 봇이 반응하지 않음

이 경우는 거의 항상 토큰, 허용 사용자, 멘션 규칙 세 가지 중 하나입니다. 예를 들어 Discord는 채널에서 멘션이 필요할 수 있고, Telegram은 `TELEGRAM_ALLOWED_USERS`가 잘못되면 정상 기동해도 응답하지 않습니다.

### 어떤 설정 파일을 봐야 할지 모르겠음

기준은 단순합니다.

| 파일 | 역할 |
|------|------|
| `~/.hermes/.env` | API 키, 토큰, 비밀값 |
| `~/.hermes/config.yaml` | 모델, provider, base URL, 일반 옵션 |
| `~/.hermes/SOUL.md` | 전역 성격 |

:::tip
문제가 생기면 바로 재설치부터 하지 말고, 먼저 `hermes doctor`, `hermes config check`, `~/.hermes/.env`, `config.yaml` 순서로 보는 편이 더 빠릅니다.
:::

결국 FAQ의 핵심은 "Hermes가 안 된다"를 막연하게 보지 않는 것입니다. 프로바이더, 경로, 인증, 컨텍스트 길이, 접근 제어 중 어디가 어긋났는지 나눠 보면 대부분의 문제는 비교적 짧은 시간 안에 좁혀집니다.

---

**이전:** [← 33. 핵심 환경 변수](#33-env-vars)
**다음:** [35. 번들 스킬 카탈로그 →](#35-skills-catalog)
