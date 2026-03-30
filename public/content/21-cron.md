# 21. Cron 예약 작업

> Hermes의 Cron은 별도 스케줄링 하위 명령 여러 개 대신, 하나의 `cronjob` 도구와 `/cron` 인터페이스로 예약 생성·편집·중지·즉시 실행까지 묶어 다룹니다.

## Cron으로 할 수 있는 것

공식 문서 기준으로 Cron 작업은 단순 예약 알림을 넘어 다음을 지원합니다.

- 일회성 또는 반복 작업 예약
- 작업 일시중지, 재개, 수정, 즉시 실행, 삭제
- 스킬 0개, 1개, 여러 개 부착
- 원래 채팅, 로컬 파일, 지정된 플랫폼 채널로 결과 전달
- 일반 에이전트와 같은 정적 도구 목록으로 새 세션에서 실행

:::warning
Cron으로 실행된 세션 안에서는 다시 Cron 작업을 만들 수 없습니다. 문서는 무한 스케줄링 루프를 막기 위해 Cron 관리 도구를 내부적으로 비활성화한다고 명시합니다.
:::

## 예약 만드는 세 가지 방법

### 1. 채팅 안에서 `/cron`

```bash
/cron add 30m "빌드 확인하라고 알려줘"
/cron add "every 2h" "서버 상태를 점검해줘"
/cron add "every 1h" "새 피드 항목을 요약해줘" --skill blogwatcher
```

### 2. 독립 CLI에서

```bash
hermes cron create "every 2h" "서버 상태 점검"
hermes cron create "every 1h" "피드 요약" --skill blogwatcher
```

### 3. 자연어로 요청

```text
매일 오전 9시에 Hacker News에서 AI 뉴스를 확인해서 Telegram으로 요약 보내줘.
```

문서에 따르면 Hermes는 이런 자연어 요청도 내부적으로 통합 `cronjob` 도구로 변환해 처리합니다.

## 스킬을 붙인 Cron

Cron 작업은 프롬프트를 실행하기 전에 하나 이상의 스킬을 로드할 수 있습니다.

### 단일 스킬

```python
cronjob(
    action="create",
    skill="blogwatcher",
    prompt="설정된 피드를 확인하고 새 항목만 요약해줘.",
    schedule="0 9 * * *",
    name="Morning feeds",
)
```

### 여러 스킬

```python
cronjob(
    action="create",
    skills=["blogwatcher", "find-nearby"],
    prompt="새 지역 이벤트와 근처 장소를 함께 짧게 브리핑해줘.",
    schedule="every 6h",
    name="Local brief",
)
```

스킬이 있으면 매번 긴 지시문을 프롬프트에 복붙하지 않고도 재사용 가능한 작업 흐름을 예약에 얹을 수 있습니다.

## 작업 수정

문서는 "작은 수정 때문에 지우고 다시 만들 필요는 없다"고 설명합니다.

```bash
/cron edit <job_id> --schedule "every 4h"
/cron edit <job_id> --prompt "수정된 작업 설명"
/cron edit <job_id> --skill blogwatcher --skill find-nearby
/cron edit <job_id> --remove-skill blogwatcher
/cron edit <job_id> --clear-skills
```

CLI에서도 같은 흐름을 지원합니다.

```bash
hermes cron edit <job_id> --schedule "every 4h"
hermes cron edit <job_id> --add-skill find-nearby
```

주의할 점은 다음과 같습니다.

- 반복된 `--skill`은 전체 스킬 목록 교체
- `--add-skill`은 기존 목록 뒤에 추가
- `--remove-skill`은 특정 스킬만 제거
- `--clear-skills`는 모두 제거

## 생명주기 관리

Cron은 생성과 삭제만 있는 단순 객체가 아닙니다.

```bash
/cron list
/cron pause <job_id>
/cron resume <job_id>
/cron run <job_id>
/cron remove <job_id>
```

독립 CLI에서는 아래도 사용합니다.

```bash
hermes cron status
hermes cron tick
```

| 동작 | 의미 |
|------|------|
| `pause` | 작업은 유지하되 스케줄만 멈춤 |
| `resume` | 다시 활성화하고 다음 실행 시각 계산 |
| `run` | 다음 스케줄러 틱에서 즉시 실행 |
| `remove` | 완전히 삭제 |

## 언제 유용한가

| 사용 예 | Cron 적합성 |
|------|------------|
| 아침 뉴스 브리핑 | 매우 높음 |
| 정기 로그 점검 | 높음 |
| 스킬 기반 반복 분석 | 높음 |
| 사용자 입력이 필요한 대화형 작업 | 낮음 |

Cron은 "예약 알림"보다 "예약된 새 에이전트 세션"에 가깝습니다. 그 관점으로 보면 왜 스킬, 홈 채널, 세션 격리, 도구 제한이 함께 설계돼 있는지 이해하기 쉽습니다.

---

**이전:** [← 19. 기타 메시징 플랫폼](#20-other-messaging)
**다음:** [21. 이벤트 훅 →](#22-hooks)
