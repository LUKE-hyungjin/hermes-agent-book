# 24. 브라우저 자동화

> Hermes의 브라우저 도구셋은 "웹페이지를 읽는다" 수준이 아니라, 클라우드 브라우저·로컬 Chrome·로컬 Chromium 중 하나를 붙여 실제 클릭, 입력, 추출, 시각 분석까지 수행하는 자동화 계층입니다.

## 지원 백엔드

공식 문서는 네 가지 실행 경로를 설명합니다.

| 방식 | 특징 |
|------|------|
| Browserbase 클라우드 | 관리형 클라우드 브라우저, 프록시·스텔스 지원 |
| Browser Use 클라우드 | 대체 클라우드 브라우저 제공자 |
| 로컬 Chrome CDP | 내 Chrome에 직접 연결, 눈으로 보며 작업 가능 |
| 로컬 브라우저 모드 | `agent-browser`와 로컬 Chromium 사용 |

모든 모드에서 에이전트는 웹사이트 탐색, 요소 상호작용, 폼 입력, 정보 추출을 수행할 수 있습니다.

## Hermes가 페이지를 보는 방식

문서는 페이지를 접근성 트리 기반의 텍스트 스냅샷으로 표현한다고 설명합니다. 각 상호작용 요소에는 `@e1`, `@e2` 같은 ref ID가 붙고, 에이전트는 그 ID를 써서 클릭과 입력을 수행합니다. 이 설계 덕분에 LLM이 DOM 전체를 보지 않고도 구조화된 페이지 상태를 다룰 수 있습니다.

핵심 기능은 다음과 같습니다.

- Browserbase와 Browser Use를 넘나드는 클라우드 실행
- CDP로 로컬 Chrome에 붙는 실시간 브라우징
- Browserbase의 랜덤 지문, CAPTCHA 대응, 주거용 프록시
- 작업별 세션 격리
- 비활성 세션 자동 정리
- 스크린샷 기반 시각 분석

## 설정

### Browserbase

```bash
BROWSERBASE_API_KEY=***
BROWSERBASE_PROJECT_ID=your-project-id-here
```

### Browser Use

```bash
BROWSER_USE_API_KEY=***
```

두 설정이 동시에 있으면 문서상 Browserbase가 우선합니다.

## 로컬 Chrome 연결

클라우드 대신 현재 실행 중인 Chrome에 붙을 수도 있습니다. 이 방식은 로그인된 쿠키를 그대로 쓰고 싶거나, 에이전트가 실제로 무엇을 하는지 눈으로 보고 싶을 때 특히 유용합니다.

```bash
/browser connect
/browser connect ws://host:port
/browser status
/browser disconnect
```

Chrome이 원격 디버깅으로 열려 있지 않으면 Hermes가 `--remote-debugging-port=9222`로 자동 실행을 시도합니다. 수동 실행 예시는 문서에 다음처럼 나옵니다.

```bash
# Linux
google-chrome --remote-debugging-port=9222

# macOS
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222
```

## 로컬 브라우저 모드

클라우드 자격 증명이 없고 `/browser connect`도 쓰지 않더라도, Hermes는 `agent-browser` CLI와 로컬 Chromium 조합으로 브라우저 도구를 사용할 수 있습니다.

```bash
npm install -g agent-browser
```

또는 저장소 안에서 로컬 설치를 쓸 수도 있습니다.

```bash
npm install
```

## 운영 옵션

문서에는 Browserbase 관련 선택 옵션도 정리돼 있습니다.

```bash
BROWSERBASE_PROXIES=true
BROWSERBASE_ADVANCED_STEALTH=false
BROWSERBASE_KEEP_ALIVE=true
BROWSERBASE_SESSION_TIMEOUT=600000
BROWSER_INACTIVITY_TIMEOUT=300
```

각각 주거용 프록시, 고급 스텔스, 세션 재연결, 세션 제한 시간, 비활성 자동 정리를 제어합니다.

## 어떤 모드를 고를까

| 상황 | 추천 |
|------|------|
| anti-bot 대응이 중요함 | Browserbase |
| 대체 클라우드 제공자가 필요함 | Browser Use |
| 내 로그인 상태를 그대로 써야 함 | 로컬 Chrome CDP |
| 비용 없이 로컬 실험만 하면 됨 | 로컬 브라우저 모드 |

:::info
브라우저 자동화는 `web_search`의 대체재가 아니라 보완재입니다. 문서를 찾는 일은 검색 도구가 더 빠르고, 로그인 뒤 실제 UI를 조작해야 하는 일은 브라우저 도구가 훨씬 적합합니다.
:::

브라우저 자동화의 핵심은 "웹 검색"이 아니라 "실제 브라우저 세션을 가진 도구"라는 점입니다. 필요한 것이 검색인지, 로그인된 앱 조작인지, 시각 확인인지에 따라 백엔드 선택이 달라집니다.

---

**이전:** [← 22. 서브에이전트 위임](#23-delegation)
**다음:** [24. 코드 실행 →](#25-code-execution)
