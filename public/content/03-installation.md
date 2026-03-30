# 03. 설치 및 설정

> 현재 공식 문서 기준 가장 안전한 설치 경로는 `install.sh` 원라인 인스톨러입니다.

## 가장 빠른 설치

공식 설치 페이지의 기본 경로는 아래 명령입니다.

```bash
# Linux / macOS / WSL2
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

### Windows 사용자

Native Windows는 공식 문서 기준 지원 대상이 아닙니다. 먼저 [WSL2](https://learn.microsoft.com/ko-kr/windows/wsl/install)를 설치한 뒤, WSL2 터미널 안에서 위 명령을 실행하세요.

## 인스톨러가 해주는 일

현재 공식 설치 문서 기준으로 이 스크립트는 아래 작업을 자동으로 처리합니다.

- Python / Node.js / ripgrep / ffmpeg 같은 의존성 확인
- Hermes 저장소 클론
- 가상환경 생성
- `hermes` 명령 연결
- `~/.hermes/` 설정 디렉터리 생성
- 초기 설정 마법사 실행

즉, 예전의 개별 `pip install ...` 식 설치보다 **공식 인스톨러를 그대로 쓰는 편이 안전합니다.**

## 설치 후 바로 할 일

설치가 끝나면 셸을 다시 읽거나 터미널을 새로 엽니다.

```bash
source ~/.bashrc  # 또는 source ~/.zshrc
```

그다음 아래 순서로 확인하면 됩니다.

```bash
hermes --version
hermes status
hermes
```

:::warning
설치가 끝났는데 `hermes: command not found`가 나오면, 먼저 터미널을 완전히 다시 열어 보세요. 공식 인스톨러는 보통 `~/.local/bin` 쪽에 명령을 연결합니다.
:::

## 설정은 어떻게 시작하나요?

초보자는 파일을 직접 열기보다 아래 명령부터 시작하는 편이 가장 덜 헷갈립니다.

```bash
hermes model         # 모델/프로바이더 선택
hermes tools         # 도구셋 활성화
hermes gateway setup # Telegram/Discord/WhatsApp 등 메시징 설정
hermes config set    # 개별 설정만 수정
hermes setup         # 전체 설정 마법사 다시 실행
```

특히 프로바이더는 직접 `.env`를 만지기보다 `hermes model`을 먼저 실행하는 쪽이 안전합니다.

## 첫 실행 권장 흐름

처음이라면 아래처럼 가면 됩니다.

```bash
hermes model
hermes tools
hermes
```

그리고 첫 세션에서 이렇게 물어보면 좋습니다.

```text
안녕! 지금 설치가 정상인지 확인해줘.
내 작업 디렉터리를 요약해줘.
README.md가 있으면 먼저 읽고 설명해줘.
```

## 전제조건

공식 설치 페이지 기준으로 사용자가 미리 꼭 준비해야 하는 것은 사실상 **Git** 정도입니다. 나머지 많은 의존성은 인스톨러가 알아서 처리합니다.

## 고급 옵션

인스톨러는 몇 가지 옵션도 지원합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh |   bash -s -- --skip-setup --dir ~/my-hermes
```

| 옵션 | 의미 |
|------|------|
| `--skip-setup` | 초기 설정 마법사를 건너뜀 |
| `--dir PATH` | 설치 디렉터리 변경 |
| `--branch NAME` | 특정 브랜치 설치 |
| `--no-venv` | 가상환경 없이 설치 |

대부분의 사용자는 기본 설치만으로 충분하고, 이 옵션은 여러 인스턴스를 운영하거나 자동화를 걸 때만 필요합니다.

## 설치 확인 체크리스트

```bash
hermes --version
hermes status
```

정상이라면 보통 아래 세 가지를 확인할 수 있습니다.

- Hermes 버전 출력
- `~/.hermes/.env`, `config.yaml`, `SOUL.md` 생성
- 상태 화면에서 현재 모델/인증/메시징 설정 확인 가능

:::tip
초반에는 "일단 설치 → `hermes model` → `hermes`로 첫 대화"까지 완료하는 것이 가장 중요합니다. 세부 프로바이더 비교나 고급 설정은 그다음에 봐도 늦지 않습니다.
:::

---

**이전:** [← 02. 다른 에이전트와의 비교](#02-comparison)
**다음:** [04. 업데이트와 삭제 →](#04-updating)
