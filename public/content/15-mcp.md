# 15. MCP

> MCP(Model Context Protocol)는 Hermes 바깥에 있는 도구 서버를 Hermes 안으로 연결하는 표준 인터페이스입니다.

## MCP가 필요한 이유

Hermes에 없는 기능을 바로 쓰고 싶을 때, 매번 네이티브 도구를 새로 구현하는 것은 비효율적입니다. GitHub, 사내 API, 파일 시스템 서버, 데이터베이스, 브라우저 스택처럼 이미 MCP 서버로 제공되는 기능이 있다면 Hermes는 그 서버에 연결해 외부 도구를 자기 도구처럼 사용할 수 있습니다. 그래서 MCP는 "확장 기능"이면서 동시에 "통합 표준"입니다.

## MCP가 제공하는 것

| 기능 | 의미 |
|------|------|
| 외부 도구 연동 | Hermes 밖 서버의 기능을 바로 사용 |
| stdio / HTTP 동시 지원 | 로컬 서브프로세스와 원격 엔드포인트 모두 가능 |
| 자동 발견 | 시작 시 서버 도구를 자동 등록 |
| 리소스/프롬프트 유틸리티 | 서버가 지원하면 추가 헬퍼 도구 등록 |
| 서버별 필터링 | 필요한 도구만 Hermes에 노출 |

## 빠른 시작

표준 설치가 아니라면 MCP 지원을 먼저 포함해야 합니다.

```bash
cd ~/.hermes/hermes-agent
uv pip install -e ".[mcp]"
```

이후 `~/.hermes/config.yaml`에 서버를 추가합니다.

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

그리고 Hermes를 실행한 뒤 자연어로 요청합니다.

```text
/reload-mcp
/status
프로젝트 디렉터리 구조를 읽고 요약해줘.
```

## 두 가지 서버 유형

| 유형 | 설정 키 | 적합한 경우 |
|------|---------|-------------|
| Stdio 서버 | `command`, `args`, `env` | 로컬 설치, 낮은 지연, 서브프로세스 기반 |
| HTTP 서버 | `url`, `headers` | 원격 조직 서버, 중앙 관리형 엔드포인트 |

### Stdio 예시

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-github"]
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: "***"
```

### HTTP 예시

```yaml
mcp_servers:
  remote_api:
    url: "https://mcp.example.com/mcp"
    headers:
      Authorization: "Bearer ***"
```

## 자주 쓰는 설정 키

| 키 | 의미 |
|----|------|
| `command` | stdio 서버 실행 파일 |
| `args` | stdio 서버 인자 |
| `env` | 서버 프로세스에만 전달할 환경 변수 |
| `url` | HTTP MCP 엔드포인트 |
| `headers` | 원격 인증 헤더 |
| `timeout` | 도구 호출 타임아웃 |
| `connect_timeout` | 최초 연결 대기 시간 |
| `enabled` | `false`면 서버 비활성화 |
| `tools` | 서버별 도구 필터링 정책 |

이 구조 덕분에 "파일 시스템 서버는 열되, DB 쓰기 도구는 숨기기" 같은 운영 정책을 세울 수 있습니다.

## Hermes 안에서 등록되는 이름

MCP 도구는 충돌 방지를 위해 접두사가 붙습니다.

```text
mcp_<server_name>_<tool_name>
```

| 서버 | 원래 도구 | 등록 이름 |
|------|-----------|------------|
| `filesystem` | `read_file` | `mcp_filesystem_read_file` |
| `github` | `create-issue` | `mcp_github_create_issue` |
| `my-api` | `query.data` | `mcp_my_api_query_data` |

보통 사용자는 이 이름을 직접 기억할 필요가 없습니다. Hermes가 추론 과정에서 적절한 도구를 고릅니다.

## MCP 유틸리티 도구

서버가 지원하면 Hermes는 리소스와 프롬프트용 유틸리티도 같이 등록합니다.

| 유틸리티 | 용도 |
|----------|------|
| `list_resources` | 서버가 제공하는 리소스 목록 |
| `read_resource` | 특정 리소스 읽기 |
| `list_prompts` | 서버 프롬프트 목록 |
| `get_prompt` | 특정 프롬프트 로드 |

예를 들어 `mcp_github_list_resources` 같은 이름으로 보일 수 있습니다. 이런 유틸리티는 서버가 실제로 해당 capability를 지원할 때만 노출됩니다.

:::tip
MCP는 "도구가 많을수록 좋다"보다 "어떤 서버에 어떤 권한을 줄 것인가"가 더 중요합니다. 처음에는 읽기 위주 서버부터 붙이고, 쓰기나 변경 도구는 정말 필요할 때만 열어 두는 편이 안전합니다.
:::

MCP를 이해하면 Hermes는 더 이상 폐쇄적인 단일 에이전트가 아니라, 외부 시스템과 느슨하게 연결된 통합 허브로 바뀝니다. 확장성의 시작점은 새 기능을 직접 짜는 것이 아니라, 이미 존재하는 MCP 생태계를 잘 붙이는 데 있습니다.

---

**이전:** [← 14. 도구](#14-tools)
**다음:** [16. 메시징 개요 →](#16-messaging-overview)
