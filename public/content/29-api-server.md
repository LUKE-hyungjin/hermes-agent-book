# 29. API 서버

> API 서버를 켜면 Hermes를 OpenAI 호환 HTTP 백엔드로 노출할 수 있어, Open WebUI나 LobeChat 같은 프런트엔드가 Hermes를 "모델 서버"처럼 호출할 수 있습니다.

## API 서버가 하는 일

공식 문서의 핵심은 명확합니다. API 서버는 `hermes-agent`를 `/v1` 형태의 OpenAI 호환 엔드포인트로 감싸 줍니다. 외부 클라이언트는 일반적인 Chat Completions 또는 Responses API를 호출하는 것처럼 보이지만, 실제 내부에서는 Hermes가 터미널, 파일, 웹 검색, 메모리, 스킬 같은 전체 도구셋을 그대로 사용합니다.

중요한 점은 **도구 호출이 서버 안에서 보이지 않게 실행된다**는 것입니다. 프런트엔드는 최종 답변만 받고, 복잡한 툴 실행과 문맥 조립은 Hermes가 담당합니다. 그래서 "일반 LLM UI"를 "도구를 쓰는 에이전트 UI"로 바꾸는 연결층으로 이해하면 가장 쉽습니다.

| 장점 | 설명 |
|------|------|
| OpenAI 호환성 | 기존 클라이언트를 거의 그대로 연결 가능 |
| 서버 측 도구 실행 | 셸, 파일, 웹, 메모리 기능을 UI 뒤에서 수행 |
| 다양한 프런트엔드 지원 | Open WebUI, LobeChat, LibreChat, NextChat, ChatBox 등 |
| 상태 관리 선택 가능 | 완전 무상태 요청과 서버 저장형 대화 모두 지원 |

## 빠른 시작

먼저 `~/.hermes/.env`에 API 서버 관련 값을 넣습니다.

```bash
API_SERVER_ENABLED=true
API_SERVER_KEY=change-me-local-dev
# 브라우저가 Hermes를 직접 호출해야 할 때만 지정
# API_SERVER_CORS_ORIGINS=http://localhost:3000
```

그다음 게이트웨이를 실행합니다.

```bash
hermes gateway
```

정상적으로 올라오면 다음과 비슷한 로그가 보입니다.

```text
[API Server] API server listening on http://127.0.0.1:8642
```

테스트는 `curl` 한 번이면 충분합니다.

```bash
curl http://localhost:8642/v1/chat/completions \
  -H "Authorization: Bearer change-me-local-dev" \
  -H "Content-Type: application/json" \
  -d '{"model":"hermes-agent","messages":[{"role":"user","content":"Hello!"}]}'
```

즉, Hermes를 직접 조작하는 대신, 표준 OpenAI 클라이언트가 Hermes 뒤에 붙는 구조입니다.

## 두 가지 핵심 엔드포인트

### `POST /v1/chat/completions`

이 방식은 가장 익숙한 OpenAI 스타일입니다. 요청마다 `messages` 배열 전체를 보내며, 서버는 이를 바탕으로 한 번의 응답을 생성합니다. 클라이언트가 문맥을 직접 들고 다녀야 하므로 구조가 단순하고, 기존 UI와의 호환성이 매우 좋습니다.

```json
{
  "model": "hermes-agent",
  "messages": [
    {"role": "system", "content": "You are a Python expert."},
    {"role": "user", "content": "Write a fibonacci function"}
  ],
  "stream": false
}
```

이 경로는 "대화 이력은 프런트엔드가 관리하고, Hermes는 답변만 만든다"는 방식에 적합합니다.

### `POST /v1/responses`

이쪽은 서버가 상태를 저장하는 현대적인 인터페이스에 가깝습니다. `store: true`를 주면 Hermes가 응답 체인과 도구 호출 결과를 서버 쪽에 보관합니다.

```json
{
  "model": "hermes-agent",
  "input": "What files are in my project?",
  "instructions": "You are a helpful coding assistant.",
  "store": true
}
```

이후에는 `previous_response_id`로 직전 응답을 이어 붙이거나, `conversation` 이름을 지정해 특정 세션의 최신 응답 체인에 자동 연결할 수 있습니다.

```json
{"input":"Now show me the README","previous_response_id":"resp_abc123"}
```

```json
{"input":"Hello","conversation":"my-project"}
{"input":"What's in src/?","conversation":"my-project"}
{"input":"Run the tests","conversation":"my-project"}
```

이 구조의 장점은 단순한 텍스트 히스토리만 잇는 것이 아니라, 이전 도구 호출과 그 결과까지 함께 보존된다는 점입니다.

## 스트리밍과 상태 관리

| 기능 | 의미 |
|------|------|
| `stream: true` | SSE로 토큰을 실시간 전송 |
| `store: true` | 서버 측 응답 체인 저장 활성화 |
| `previous_response_id` | 직전 응답을 기준으로 다중 턴 이어가기 |
| `conversation` | 이름 기반 대화 세션 자동 연결 |

문서 기준으로 스트리밍은 SSE(Server-Sent Events)로 동작합니다. 설정에 따라 토큰을 실시간으로 흘릴 수도 있고, 완성된 답을 한 번에 내려보낼 수도 있습니다. UI에서 "타이핑되는 느낌"이 필요하면 스트리밍이 유리하고, 배치 처리나 로그 수집 목적이면 비스트리밍이 더 단순합니다.

:::tip
프런트엔드가 기존 OpenAI Chat Completions만 지원한다면 `/v1/chat/completions`부터 연결하는 편이 가장 쉽습니다. 장기 대화와 서버 저장형 세션이 필요하면 `/v1/responses`가 더 잘 맞습니다.
:::

## 운영 시 주의할 점

API 서버는 편리하지만, 동시에 Hermes의 강력한 도구 실행 능력을 HTTP 뒤로 공개하는 것이기도 합니다. 그래서 몇 가지는 꼭 챙겨야 합니다.

| 항목 | 체크 포인트 |
|------|-------------|
| 인증 키 | `API_SERVER_KEY`를 기본값 그대로 두지 않기 |
| 바인딩 주소 | 기본은 `127.0.0.1`, 외부 공개 전 역프록시와 인증 검토 |
| CORS | 브라우저 직결이 필요할 때만 제한적으로 허용 |
| 권한 경계 | API 호출자는 사실상 Hermes 도구셋을 우회적으로 쓰게 됨 |

정리하면 API 서버는 Hermes를 "사람이 터미널에서 쓰는 에이전트"에서 "다른 앱이 호출하는 에이전트 백엔드"로 바꾸는 기능입니다. 자체 UI를 만들거나, 기존 OpenAI 호환 채팅 클라이언트에 Hermes의 툴 사용 능력을 붙이고 싶다면 가장 실용적인 진입점입니다.

---

**이전:** [← 28. 프로필](#28-profiles)
**다음:** [30. CLI 레퍼런스 →](#30-cli-reference)
