# 03. 설치 및 설정

> 60초면 설치 완료 — Linux, macOS, WSL2 어디서든.

## 설치

원라인 인스톨러를 실행합니다:

```bash
# Linux / macOS / WSL2
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### Windows 사용자

먼저 [WSL2](https://learn.microsoft.com/ko-kr/windows/wsl/install)를 설치한 후, WSL2 터미널 안에서 위 명령을 실행하세요.

설치가 완료되면 셸을 다시 로드합니다:

```bash
source ~/.bashrc  # 또는 source ~/.zshrc
```

:::warning
설치 후 `hermes` 명령을 찾을 수 없다면 터미널을 완전히 닫고 다시 열어보세요.
:::

## 프로바이더 설정

설치 후 LLM 프로바이더를 설정합니다:

```bash
hermes model    # LLM 프로바이더와 모델 선택
hermes tools    # 활성화할 도구 설정
hermes setup    # 모든 설정 한번에
```

### 지원 프로바이더

| 프로바이더 | 설명 | 설정 방법 |
|-----------|------|----------|
| **Nous Portal** | 구독형, 설정 불필요 | `hermes model`에서 OAuth 로그인 |
| **OpenAI** | GPT 모델 사용 | API 키 입력 |
| **Anthropic** | Claude 모델 사용 | `hermes model` 또는 API 키 |
| **Google** | Gemini 모델 사용 | API 키 입력 |
| **로컬 모델** | Ollama, vLLM 등 | 엔드포인트 URL 설정 |

## 첫 대화

```bash
hermes
```

프롬프트가 나오면 자연어로 대화를 시작하세요:

```
> 안녕! 오늘 뭐 도와줄 수 있어?
> 내 프로젝트 폴더 구조를 분석해줘
> README.md 파일을 한국어로 번역해줘
```

## 도구 활성화

Hermes는 40개 이상의 내장 도구가 있습니다. 필요한 것만 활성화할 수 있습니다:

```bash
hermes tools
```

대화형 메뉴가 나타나면 원하는 도구를 선택하세요.

:::tip
처음에는 기본 도구 세트로 시작하고, 필요에 따라 추가하는 것을 추천합니다.
:::

## 설치 확인

```bash
hermes --version
# Hermes Agent v0.5.0 (2026.3.28)
```

---

**이전:** [← 02. 다른 에이전트와의 비교](#02-comparison)
**다음:** [03. 업데이트 & 삭제 →](#04-updating)
