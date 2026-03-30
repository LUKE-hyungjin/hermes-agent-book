# 17. 메시징 개요

> Hermes의 메시징 게이트웨이는 Telegram, Discord, Slack, WhatsApp 같은 여러 채널을 하나의 백그라운드 프로세스로 묶어, 어디서든 같은 에이전트를 호출하게 해 주는 운영 표면입니다.

## 메시징 게이트웨이가 하는 일

공식 문서에서 게이트웨이는 "여러 플랫폼 어댑터가 메시지를 받고, 채팅별 세션 저장소를 거쳐, AIAgent로 전달하는 단일 프로세스"로 설명됩니다. 즉 플랫폼마다 별도 봇을 따로 운영하는 구조가 아니라, Hermes가 하나의 중심 엔진으로 여러 채널을 동시에 다룹니다.

지원 대상으로는 Telegram, Discord, Slack, WhatsApp, Signal, SMS, Email, Home Assistant, Mattermost, Matrix, DingTalk, Feishu/Lark, WeCom, 브라우저가 언급됩니다. 핵심은 "메시지를 받는 입구"만 달라질 뿐, 뒤쪽의 세션·도구·메모리·추론 흐름은 동일하다는 점입니다.

## 내부 구조

| 구성 요소 | 역할 |
|------|------|
| 플랫폼 어댑터 | Telegram, Discord 같은 채널에서 메시지 수신 |
| 세션 저장소 | 채팅별 대화 문맥 유지 |
| AIAgent | 모델 추론, 메모리 사용, 도구 호출 |
| Cron 스케줄러 | 60초 주기로 예약 작업 확인 및 실행 |
| 음성 계층 | STT, TTS, 음성 메시지 전달 처리 |

메시징은 단순 알림 레이어가 아니라, 세션 지속성, 예약 작업, 음성 응답, 권한 제어까지 묶인 운영 인터페이스입니다.

## 가장 쉬운 시작

대부분의 사용자는 설정 마법사부터 시작하면 됩니다.

```bash
hermes gateway setup
```

이 마법사는 플랫폼별 설정 여부를 보여 주고, 토큰이나 허용 사용자 목록을 입력받은 뒤, 마지막에 게이트웨이를 시작하거나 재시작할지까지 안내합니다.

## 주요 명령

```bash
hermes gateway
hermes gateway setup
hermes gateway install
sudo hermes gateway install --system
hermes gateway start
hermes gateway stop
hermes gateway status
```

| 명령 | 설명 |
|------|------|
| `hermes gateway` | 포그라운드 실행 |
| `setup` | 인터랙티브 설정 |
| `install` | 사용자 서비스 또는 시스템 서비스 등록 |
| `start` / `stop` | 기본 서비스 제어 |
| `status` | 현재 상태 확인 |

## 메시징 안에서 쓰는 채팅 명령

메시징 채널 안에서도 CLI와 비슷한 운영 명령을 쓸 수 있습니다.

| 명령 | 용도 |
|------|------|
| `/new`, `/reset` | 새 대화 시작 |
| `/model`, `/provider` | 모델·프로바이더 확인 및 변경 |
| `/status`, `/usage`, `/insights` | 세션·사용량 확인 |
| `/sethome` | 현재 채팅을 홈 채널로 지정 |
| `/resume`, `/title` | 세션 재개 및 이름 지정 |
| `/voice` | 음성 응답 및 Discord VC 동작 제어 |
| `/background` | 별도 백그라운드 세션 실행 |
| `/approve`, `/deny` | 위험 명령 승인 또는 거부 |
| `/update` | 최신 버전 업데이트 |

## 세션 유지와 초기화

메시징 세션은 기본적으로 메시지 사이에 유지됩니다. 문서에는 초기화 정책이 세 가지로 정리되어 있습니다.

| 정책 | 기본값 | 의미 |
|------|--------|------|
| Daily | 오전 4시 | 매일 특정 시각 초기화 |
| Idle | 1440분 | 일정 시간 무응답이면 초기화 |
| Both | 결합 | 두 조건 중 먼저 도달한 쪽 적용 |

플랫폼별 오버라이드도 가능합니다.

```json
{
  "reset_by_platform": {
    "telegram": { "mode": "idle", "idle_minutes": 240 },
    "discord": { "mode": "idle", "idle_minutes": 60 }
  }
}
```

:::tip
개인 DM 중심인 Telegram은 세션을 길게 유지해도 편하지만, 여러 사람이 드나드는 Discord 채널은 idle 시간을 짧게 두는 편이 문맥 오염을 줄입니다.
:::

## 보안 기본값

게이트웨이는 기본적으로 허용 목록에 없거나 DM 페어링되지 않은 사용자를 거부합니다. 터미널 접근이 가능한 봇이라는 특성상, 이 기본값은 사실상 필수입니다.

```bash
TELEGRAM_ALLOWED_USERS=123456789,987654321
DISCORD_ALLOWED_USERS=123456789012345678
SIGNAL_ALLOWED_USERS=+15550001111,+15550002222
SMS_ALLOWED_USERS=+15550001111,+15550002222
EMAIL_ALLOWED_USERS=trusted@example.com
```

## 어떤 플랫폼부터 시작할까

| 플랫폼 | 추천 상황 |
|--------|-----------|
| Telegram | 개인용, 모바일 중심, 빠른 시작 |
| Discord | 팀 협업, 스레드, 서버 기반 운영 |
| Slack | 회사 워크스페이스 통합 |
| WhatsApp | 번호 기반 개인·소규모 대화 |

:::info
메시징 게이트웨이의 본질은 "플랫폼별 봇 여러 개"가 아니라 "하나의 Hermes 작업 엔진을 여러 채널에 노출"하는 것입니다.
:::

---

**이전:** [← 16. MCP](#16-mcp)
**다음:** [18. Telegram 설정 →](#18-telegram)
