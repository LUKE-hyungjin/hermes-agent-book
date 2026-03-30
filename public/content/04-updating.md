# 04. 업데이트와 삭제

> `hermes update` 하나로 최신 코드, 의존성, 새 설정 항목까지 한 번에 반영할 수 있습니다.

## 언제 이 문서를 보나요?

Hermes Agent는 릴리스 주기가 빠른 편이라, 설치 직후보다 **업데이트 이후**에 차이를 체감하는 경우가 많습니다. 새 모델 연결 방식, 도구, 메시징 개선, 설정 키가 추가되면 기존 설치본은 그대로 동작하더라도 최신 기능을 놓칠 수 있습니다. 이 장은 안전하게 업데이트하고, 필요하면 깔끔하게 제거하는 방법을 정리합니다.

## 기본 업데이트

가장 쉬운 방법은 아래 명령입니다.

```bash
hermes update
```

이 명령은 다음 작업을 순서대로 처리합니다.

| 단계 | 설명 |
|------|------|
| 최신 코드 반영 | 저장소 최신 버전을 가져옵니다 |
| 의존성 갱신 | 새 버전에 필요한 패키지를 다시 설치합니다 |
| 설정 점검 | 지난 버전 이후 추가된 설정 키를 확인합니다 |
| 마이그레이션 유도 | 필요한 경우 새 옵션을 대화형으로 추가합니다 |

:::tip
업데이트 중 새 설정 항목 추가를 건너뛰었더라도 괜찮습니다. 이후에 `hermes config check`로 누락된 항목을 확인하고, `hermes config migrate`로 다시 추가할 수 있습니다.
:::

## 메시징 플랫폼에서 업데이트

Telegram, Discord, Slack, WhatsApp 게이트웨이를 이미 쓰고 있다면 채팅 안에서 바로 업데이트할 수도 있습니다.

```text
/update
```

이 방식은 서버에 접속하지 않고도 봇을 최신 상태로 올리고 게이트웨이를 재시작할 수 있다는 장점이 있습니다. 다만, 실제로 시스템 서비스 권한이나 설치 방식에 문제가 있다면 로컬 셸에서 직접 확인하는 편이 더 안정적입니다.

## 수동 업데이트

빠른 설치 스크립트가 아니라 직접 저장소를 받아 설치했다면 수동 업데이트 절차를 알아두는 것이 좋습니다.

```bash
cd /path/to/hermes-agent
export VIRTUAL_ENV="$(pwd)/venv"

git pull origin main
git submodule update --init --recursive

uv pip install -e ".[all]"
uv pip install -e "./tinker-atropos"

hermes config check
hermes config migrate
```

수동 업데이트가 필요한 대표 상황은 다음과 같습니다.

| 상황 | 권장 방식 |
|------|-----------|
| 표준 설치 스크립트 사용 | `hermes update` |
| Git 저장소를 직접 clone | 수동 업데이트 |
| 서브모듈 포함 개발 환경 | `git submodule update` 포함 |
| 새 옵션이 계속 누락됨 | `config check` + `config migrate` |

## 삭제와 재설치

Hermes를 제거할 때는 먼저 내장 제거기를 써보는 것이 가장 안전합니다.

```bash
hermes uninstall
```

이 제거기는 `~/.hermes/` 설정 디렉터리를 남길지 물어봅니다. 다시 설치할 가능성이 있다면 보통 유지하는 편이 좋습니다. 이 안에는 `config.yaml`, `.env`, 세션, 메모리, 스킬, 로그가 들어 있으므로 그대로 두면 재설치 후 빠르게 복구할 수 있습니다.

## 수동 삭제

직접 설치했고 흔적까지 정리하고 싶다면 수동으로 삭제할 수 있습니다.

```bash
rm -f ~/.local/bin/hermes
rm -rf /path/to/hermes-agent
rm -rf ~/.hermes
```

:::warning
`~/.hermes`를 삭제하면 API 키, 세션 기록, 메모리, 스킬, 게이트웨이 설정이 함께 사라집니다. 백업이 필요하면 먼저 디렉터리를 복사해 두세요.
:::

## 서비스로 실행 중인 경우

게이트웨이를 사용자 서비스나 시스템 서비스로 등록했다면 제거 전에 반드시 중지하세요.

```bash
hermes gateway stop

# Linux 사용자 서비스 비활성화
systemctl --user disable hermes-gateway

# macOS launchd 제거 예시
launchctl remove ai.hermes.gateway
```

## 업데이트 체크리스트

| 점검 항목 | 확인 방법 |
|----------|-----------|
| 버전이 바뀌었는가 | `hermes --version` |
| 새 설정이 누락되지 않았는가 | `hermes config check` |
| 게이트웨이가 다시 올라왔는가 | `hermes gateway status` |
| 메시징에서 응답하는가 | Telegram/Discord에서 테스트 메시지 전송 |

업데이트는 단순히 "새 코드 받기"가 아니라 **설정 스키마를 따라잡는 작업**까지 포함합니다. 따라서 문제가 생기면 먼저 버전보다 `config check` 결과를 보는 습관이 중요합니다.

---

**이전:** [← 02. 설치 및 설정](#03-installation)
**다음:** [04. 학습 경로 →](#05-learning-path)
