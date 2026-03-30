# 29. Docker 실행

> Docker 모드는 호스트에 패키지를 직접 설치하지 않고도 Hermes를 실행하게 해 주며, 사용자 데이터는 `~/.hermes` 같은 호스트 디렉터리에 지속 보관됩니다.

## Docker를 쓰는 이유

공식 문서의 핵심 메시지는 단순합니다. **이미지는 상태가 없고, 상태는 마운트한 데이터 디렉터리에 저장된다**는 것입니다. 그래서 컨테이너는 쉽게 교체할 수 있고, 설정과 세션은 유지됩니다.

| 장점 | 설명 |
|------|------|
| 호스트 오염 최소화 | Python/Node 의존성 직접 설치 불필요 |
| 업그레이드 단순 | 새 이미지 pull 후 재기동 |
| 데이터 영속성 | `/opt/data` 마운트 디렉터리에 보관 |
| 배포 단순화 | 서버에서 바로 서비스화 가능 |

## 첫 실행

처음에는 데이터를 담을 디렉터리를 만들고 인터랙티브로 띄우는 것이 좋습니다.

```bash
mkdir -p ~/.hermes
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent
```

이렇게 실행하면 설정 마법사가 열리고, 입력한 API 키나 설정이 `~/.hermes/.env` 등으로 저장됩니다.

## 게이트웨이 모드로 운영

메시징 봇이나 항상 켜져 있는 자동화를 운영할 때는 백그라운드 컨테이너가 적합합니다.

```bash
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent gateway run
```

| 옵션 | 의미 |
|------|------|
| `-d` | 백그라운드 실행 |
| `--restart unless-stopped` | 재부팅 후 자동 복구 |
| `-v ~/.hermes:/opt/data` | 설정/세션/메모리 영속화 |

## 대화형 CLI로 쓰기

컨테이너를 한 번성 CLI로 열 수도 있습니다.

```bash
docker run -it --rm \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent
```

즉, 같은 데이터 디렉터리를 기반으로 어떤 날은 CLI, 어떤 날은 게이트웨이로 쓰는 것도 가능합니다.

:::tip
처음 한 번은 인터랙티브 모드로 설정을 끝낸 뒤, 운영은 별도 게이트웨이 컨테이너로 돌리는 구성이 가장 무난합니다.
:::

## 업그레이드

공식 문서 기준 업그레이드 절차는 매우 단순합니다.

```bash
docker pull nousresearch/hermes-agent:latest
docker rm -f hermes
docker run -d \
  --name hermes \
  --restart unless-stopped \
  -v ~/.hermes:/opt/data \
  nousresearch/hermes-agent
```

데이터 디렉터리가 호스트에 남아 있으므로, 이미지가 바뀌어도 설정과 기록은 유지됩니다. 다만 **게이트웨이 모드로 운영 중이었다면 재실행 명령 끝에 `gateway run`을 다시 붙여야 한다는 점**을 꼭 기억하세요.

## Docker가 특히 잘 맞는 경우

| 상황 | Docker 적합성 |
|------|---------------|
| 개인 노트북을 깔끔하게 유지하고 싶음 | 높음 |
| VPS에서 메시징 게이트웨이 운영 | 매우 높음 |
| 의존성 충돌을 피하고 싶음 | 높음 |
| 로컬 GUI/오디오 통합이 중요 | 상황에 따라 직접 설치가 편할 수 있음 |

## 운영 시 주의할 점

| 항목 | 체크 포인트 |
|------|-------------|
| 볼륨 마운트 | 데이터가 꼭 외부에 저장되는지 |
| 재시작 정책 | 장애 후 자동 복구 여부 |
| 업데이트 | 새 이미지 pull 후 재생성 |
| 게이트웨이 토큰 | `~/.hermes/.env`에 안전하게 저장 |

:::info
Docker는 Hermes를 더 안전하게 만드는 방법이기도 하지만, 동시에 운영을 단순하게 만드는 방법이기도 합니다. "이미지는 버리고 데이터만 남긴다"는 구조를 이해하면 관리가 쉬워집니다.
:::

---

**이전:** [← 28. acpx: 에이전트 간 통신](#28-acpx)
**다음:** [30. 프로필 →](#30-profiles)
