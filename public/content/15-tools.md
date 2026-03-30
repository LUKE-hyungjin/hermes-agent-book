# 15. 도구

> Hermes의 도구는 에이전트가 실제 일을 하게 만드는 함수 집합이고, 도구셋은 그 함수들을 플랫폼별로 묶어 켜고 끄는 단위입니다.

## 도구와 도구셋

Hermes가 단순 대화 모델이 아니라 에이전트처럼 느껴지는 이유는 도구 때문입니다. 웹 검색, 브라우저 자동화, 파일 읽기/수정, 터미널 실행, 메모리 저장, 세션 검색, 서브에이전트 위임 같은 기능이 모두 도구로 구현되어 있습니다. 그리고 이 도구들은 `web`, `terminal`, `skills`, `memory` 같은 도구셋으로 묶여 플랫폼마다 다르게 활성화됩니다.

| 범주 | 예시 | 역할 |
|------|------|------|
| Web | `web_search`, `web_extract` | 웹 검색과 본문 추출 |
| Terminal & File | `terminal`, `process`, `read_file`, `patch` | 명령 실행과 파일 조작 |
| Browser | `browser_navigate`, `browser_snapshot` | 실제 브라우저 자동화 |
| Media | `vision_analyze`, `image_generate`, `text_to_speech` | 멀티모달 입력/출력 |
| Orchestration | `todo`, `clarify`, `delegate_task` | 계획, 질문, 위임 |
| Memory & Recall | `memory`, `session_search` | 장기 기억과 세션 검색 |
| Automation | `cronjob`, `send_message` | 예약 실행과 결과 전달 |

## 어떻게 켜고 끄나요?

가장 쉬운 진입점은 `hermes tools`입니다.

```bash
hermes tools
hermes chat --toolsets "web,terminal"
hermes chat --toolsets "skills,memory,session_search" -q "사용 가능한 스킬을 보여줘"
```

| 방법 | 장점 | 추천 상황 |
|------|------|-----------|
| `hermes tools` | 대화형으로 이해하기 쉬움 | 초보자 |
| `--toolsets` | 실행별로 명시 가능 | 테스트, 재현 |
| 플랫폼 프리셋 | CLI/Telegram별 기본 구성이 쉬움 | 운영 환경 |

문서 기준의 흔한 도구셋은 `web`, `terminal`, `file`, `browser`, `vision`, `image_gen`, `skills`, `tts`, `todo`, `memory`, `session_search`, `cronjob`, `code_execution`, `delegation`, `clarify`, `honcho`, `homeassistant`, `rl` 등입니다.

## 터미널 백엔드

Hermes의 핵심 도구 중 하나는 터미널입니다. 그런데 이 터미널이 어디서 실행되는지는 상황에 따라 달라집니다.

| 백엔드 | 설명 | 적합한 경우 |
|--------|------|-------------|
| `local` | 현재 머신에서 직접 실행 | 신뢰된 개발 환경 |
| `docker` | 컨테이너 격리 실행 | 안전성, 재현성 |
| `ssh` | 원격 서버에서 실행 | 호스트 분리, 운영 서버 작업 |
| `singularity` | HPC 컨테이너 | 클러스터 환경 |
| `modal` | 서버리스 클라우드 | 일회성 원격 실행 |
| `daytona` | 원격 샌드박스 워크스페이스 | 지속적 개발 샌드박스 |

```yaml
terminal:
  backend: local
  cwd: "."
  timeout: 180
```

예를 들어 Docker로 분리하려면 이렇게 바꿉니다.

```yaml
terminal:
  backend: docker
  docker_image: python:3.12-slim
  container_cpu: 1
  container_memory: 5120
  container_disk: 51200
  container_persistent: true
```

## SSH와 컨테이너의 의미

`ssh` 백엔드는 특히 보안 측면에서 의미가 큽니다. 에이전트가 자기 자신의 코드와 같은 호스트를 직접 만지지 못하게 분리할 수 있기 때문입니다.

```bash
TERMINAL_SSH_HOST=my-server.example.com
TERMINAL_SSH_USER=myuser
TERMINAL_SSH_KEY=~/.ssh/id_rsa
```

반면 컨테이너 백엔드는 호스트 보호와 재현성에 강합니다. 패키지 설치, 임시 파일, 의존성 실험을 세션 경계 안에 가둘 수 있어 반복 실험에 유리합니다.

## 도구 선택 감각

| 상황 | 권장 도구셋 |
|------|-------------|
| 코드 읽기와 수정 | `terminal,file` |
| 웹 리서치 | `web,browser` |
| 장기 프로젝트 회수 | `memory,session_search` |
| 자동화 | `cronjob,send_message` |
| 확장 기능 테스트 | `skills,mcp-*` |

:::tip
처음부터 모든 도구를 다 켜기보다, 현재 작업에 필요한 도구셋만 여는 편이 좋습니다. 응답 품질뿐 아니라 안전성과 재현성도 함께 좋아집니다. 특히 자동화나 메시징 환경에서는 최소 권한 원칙이 효과적입니다.
:::

도구는 Hermes의 실행 능력이고, 도구셋은 그 실행 능력을 상황에 맞게 조절하는 레버입니다. 실제 운영에서는 "어떤 모델을 쓸까?"만큼이나 "어떤 도구셋을 허용할까?"가 중요합니다.

---

**이전:** [← 13. 성격 설정](#14-personality)
**다음:** [15. MCP →](#16-mcp)
