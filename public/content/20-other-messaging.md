# 20. 기타 메시징 플랫폼

> Telegram과 Discord 외에도 Hermes는 Slack, WhatsApp, Signal, SMS, Email 같은 채널에 연결될 수 있습니다. 다만 실제 운영 난도와 리스크는 플랫폼마다 크게 다릅니다.

## Slack: 회사용 통합의 기본축

공식 문서는 Slack 통합을 Socket Mode 기반으로 설명합니다. 즉 퍼블릭 HTTP 엔드포인트를 열 필요 없이 WebSocket으로 연결되므로, 노트북이나 사내 방화벽 뒤에서도 운영할 수 있습니다.

### Slack에서 꼭 알아둘 점

| 항목 | 내용 |
|------|------|
| 연결 방식 | Socket Mode |
| 주요 라이브러리 | `slack-bolt`, `slack_sdk` |
| 필요한 토큰 | Bot Token `xoxb-`, App Token `xapp-` |
| 사용자 식별 | Slack Member ID |

문서에는 2025년 3월 기준으로 Classic Slack App이 완전히 폐기되었으므로, 예전 RTM 앱이 있다면 새 앱을 다시 만들어야 한다고 적혀 있습니다.

### Slack 설정 순서

1. https://api.slack.com/apps 에서 새 앱 생성
2. OAuth & Permissions에서 봇 스코프 추가
3. Socket Mode 활성화 후 `connections:write`가 포함된 App Token 발급
4. Event Subscriptions에서 `message.im`, `message.channels`, `message.groups`, `app_mention` 등록
5. App Home에서 Messages Tab 활성화

특히 빠뜨리기 쉬운 부분이 두 가지입니다.

- `channels:history`, `groups:history`가 없으면 채널 메시지를 못 읽음
- Messages Tab을 켜지 않으면 DM 자체가 막힘

:::warning
Slack은 권한 하나만 빠져도 "일부 채널에서만 안 되는" 애매한 상태가 되기 쉽습니다. DMs, 공개 채널, 비공개 채널을 따로 테스트하는 것이 안전합니다.
:::

## WhatsApp: 쉬운 진입, 높은 운영 주의

Hermes의 WhatsApp 연동은 공식 Business API가 아니라 Baileys 기반 브리지로 동작합니다. Meta 개발자 계정이나 Business 인증이 필요 없다는 장점이 있지만, 문서도 분명히 말하듯 비공식 방식이므로 계정 제한 위험이 있습니다.

### WhatsApp의 두 가지 모드

| 모드 | 방식 | 추천 상황 |
|------|------|-----------|
| 별도 봇 번호 | 전용 번호를 봇에 할당 | 여러 사용자, 운영 분리 |
| 개인 셀프 채팅 | 자기 자신에게 메시지 | 테스트, 1인 사용 |

### 준비 조건

- Node.js 18+
- QR 코드를 스캔할 WhatsApp 앱이 있는 휴대폰
- 가능하면 개인 번호와 분리된 전용 번호

설정은 아래 마법사로 시작합니다.

```bash
hermes whatsapp
```

이 마법사가 모드 선택, 의존성 설치, 터미널 QR 표시, 페어링 저장까지 처리합니다.

### 권장 환경 변수

```bash
WHATSAPP_ENABLED=true
WHATSAPP_MODE=bot
WHATSAPP_ALLOWED_USERS=15551234567
```

추가로 문서는 아래처럼 무단 DM 처리 방식을 조정하는 예를 보여 줍니다.

```yaml
unauthorized_dm_behavior: pair
whatsapp:
  unauthorized_dm_behavior: ignore
```

개인 번호 기반 운영이라면 글로벌 기본값 `pair`보다 WhatsApp에서는 `ignore`가 더 조용하고 안전한 경우가 많습니다.

## 그 밖의 채널

메시징 개요에는 Signal, SMS, Email, Home Assistant, Mattermost, Matrix, DingTalk, Feishu/Lark, WeCom, 브라우저도 지원 대상으로 등장합니다. 다만 `docs-raw.txt`에서 상세 절차가 길게 풀린 것은 Slack과 WhatsApp 쪽입니다. 나머지는 보통 동일한 게이트웨이 개념, 허용 목록, 홈 채널, Cron 전달 구조를 공유한다고 이해하면 됩니다.

## 어떤 플랫폼을 고를까

| 플랫폼 | 장점 | 주의점 |
|------|------|--------|
| Slack | 회사 워크스페이스 통합이 좋음 | 권한·이벤트 설정 누락이 흔함 |
| WhatsApp | 번호 기반 접근이 쉬움 | 비공식 브리지 리스크 |
| Signal/SMS/Email | 특수 알림 채널로 유용 | 운영·식별 방식이 플랫폼별로 다름 |

Slack은 조직 협업, WhatsApp은 개인 번호 기반 접근성에서 강합니다. 다만 두 플랫폼 모두 "봇이 뜬다"보다 "권한·페어링·허용 사용자 정책이 제대로 맞아 있느냐"가 실제 안정성을 좌우합니다.

---

**이전:** [← 18. Discord 설정](#19-discord)
**다음:** [20. Cron 예약 작업 →](#21-cron)
