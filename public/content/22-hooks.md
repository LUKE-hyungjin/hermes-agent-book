# 22. 이벤트 훅

> Hermes의 훅 시스템은 게이트웨이와 플러그인 수명주기 중간에 사용자 코드를 꽂아 넣는 비차단 확장 지점입니다. 로그 적재, 경보 전송, 웹훅 호출, 메트릭 수집 같은 운영 자동화에 특히 잘 맞습니다.

## 훅 시스템은 두 종류

공식 문서는 Hermes에 두 가지 훅 계층이 있다고 설명합니다.

| 종류 | 등록 방식 | 실행 위치 | 용도 |
|------|-----------|-----------|------|
| Gateway hooks | `~/.hermes/hooks/` 아래 `HOOK.yaml` + `handler.py` | Gateway 전용 | 로깅, 알림, 웹훅 |
| Plugin hooks | 플러그인 내부 `ctx.register_hook()` | CLI + Gateway | 도구 가로채기, 메트릭, 가드레일 |

중요한 공통점은 둘 다 비차단이라는 점입니다. 문서는 어떤 훅에서 오류가 나도 예외를 잡아서 기록할 뿐, 에이전트 전체를 죽이지 않는다고 명시합니다.

## 게이트웨이 훅 만들기

게이트웨이 훅은 `~/.hermes/hooks/` 아래의 디렉터리 하나로 구성됩니다.

```text
~/.hermes/hooks/
└── my-hook/
    ├── HOOK.yaml
    └── handler.py
```

`HOOK.yaml`에는 이벤트 구독 정보를 넣습니다.

```yaml
name: my-hook
description: Log all agent activity to a file
events:
  - agent:start
  - agent:end
  - agent:step
```

`handler.py`에는 반드시 `handle` 함수가 있어야 합니다.

```python
import json
from datetime import datetime
from pathlib import Path

LOG_FILE = Path.home() / ".hermes" / "hooks" / "my-hook" / "activity.log"

async def handle(event_type: str, context: dict):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "event": event_type,
        **context,
    }
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
```

## 핸들러 규칙

문서가 정리한 규칙은 단순합니다.

- 함수 이름은 반드시 `handle`
- 인자는 `event_type: str`, `context: dict`
- `async def`와 일반 `def` 모두 가능
- 예외는 잡혀서 기록되며 에이전트를 중단시키지 않음

## 어떤 이벤트를 받을 수 있나

대표 이벤트는 다음과 같습니다.

| 이벤트 | 시점 | 주요 컨텍스트 |
|------|------|---------------|
| `gateway:startup` | 게이트웨이 시작 | `platforms` |
| `session:start` | 새 메시징 세션 시작 | `platform`, `user_id`, `session_id` |
| `session:end` | 세션 종료 직전 | `platform`, `session_key` |
| `session:reset` | `/new`, `/reset` 실행 | `platform`, `user_id` |
| `agent:start` | 에이전트 처리 시작 | `message` |
| `agent:step` | 도구 호출 루프 한 단계 | `iteration`, `tool_names` |
| `agent:end` | 에이전트 처리 종료 | `response` |
| `command:*` | 슬래시 명령 실행 | `command`, `args` |

`command:*` 같은 와일드카드도 지원합니다. 문서 예시처럼 `command:model`, `command:reset`을 하나의 구독으로 함께 잡을 수 있습니다.

## 내장 예시: BOOT.md

게이트웨이에는 `boot-md` 훅이 기본 포함돼 있습니다. 시작할 때마다 `~/.hermes/BOOT.md`를 찾아, 파일이 있으면 그 지시를 백그라운드 세션에서 실행합니다.

```md
# Startup Checklist
1. Check if any cron jobs failed overnight — run `hermes cron list`
2. Send a message to Discord #general saying "Gateway restarted, all systems go"
3. Check if /opt/app/deploy.log has any errors from the last 24 hours
```

문서는 이 훅이 시작을 막지 않으며, 아무 이슈가 없으면 `[SILENT]`를 반환하고 메시지를 보내지 않는다고 설명합니다.

## 운영 예시: 긴 작업 경보

또 다른 예시는 `agent:step`이 10회를 넘을 때 Telegram으로 경보를 보내는 훅입니다. 즉 훅은 로깅뿐 아니라 "오래 걸리는 세션 감시" 같은 운영 감시에도 쓸 수 있습니다.

:::tip
훅은 비즈니스 로직을 집어넣는 곳보다, 에이전트 바깥의 관찰·알림·정책 적용 계층으로 쓰는 편이 더 안정적입니다.
:::

## 언제 훅을 쓸까

| 상황 | 추천 |
|------|------|
| 모든 세션 로그 적재 | Gateway hook |
| 특정 도구 사용 감시 | Plugin hook |
| 부팅 체크리스트 자동 실행 | BOOT.md |
| 실패가 서비스 중단으로 이어지면 안 되는 보조 작업 | 매우 적합 |

훅 시스템의 핵심은 "중요하지만 본 흐름을 막아서는 안 되는 자동화"를 붙이는 데 있습니다.

---

**이전:** [← 20. Cron 예약 작업](#21-cron)
**다음:** [22. 서브에이전트 위임 →](#23-delegation)
