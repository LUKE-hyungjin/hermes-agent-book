# 26. 음성 기능

> Hermes의 음성 기능은 세 층으로 나뉩니다. 텍스트를 읽어 주는 TTS, 음성 메시지를 텍스트로 바꾸는 STT, 그리고 CLI 마이크 입력이나 Discord 음성 채널까지 포함한 전체 Voice Mode입니다.

## 1. TTS: 답변을 음성으로 보내기

공식 문서에는 네 가지 TTS 제공자가 정리돼 있습니다.

| 제공자 | 품질 | 비용 | 키 필요 여부 |
|------|------|------|--------------|
| Edge TTS | 양호 | 무료 | 없음 |
| ElevenLabs | 매우 좋음 | 유료 | `ELEVENLABS_API_KEY` |
| OpenAI TTS | 양호 | 유료 | `VOICE_TOOLS_OPENAI_KEY` |
| NeuTTS | 양호 | 무료 | 없음 |

플랫폼별 전달 방식도 다릅니다.

| 플랫폼 | 전달 방식 | 포맷 |
|------|-----------|------|
| Telegram | 인라인 음성 버블 | Opus `.ogg` |
| Discord | 음성 버블 또는 첨부 | Opus/MP3 |
| WhatsApp | 오디오 파일 첨부 | MP3 |
| CLI | `~/.hermes/audio_cache/` 저장 | MP3 |

기본 설정 예시는 다음과 같습니다.

```yaml
tts:
  provider: "edge"
  edge:
    voice: "en-US-AriaNeural"
  elevenlabs:
    voice_id: "pNInz6obpgDQGcFmaJgB"
    model_id: "eleven_multilingual_v2"
  openai:
    model: "gpt-4o-mini-tts"
    voice: "alloy"
  neutts:
    model: neuphonic/neutts-air-q4-gguf
    device: cpu
```

Telegram 음성 버블에는 Opus/OGG가 필요합니다. 문서상 OpenAI와 ElevenLabs는 기본적으로 Opus를 내보내지만, Edge TTS는 MP3, NeuTTS는 WAV라서 `ffmpeg`가 있어야 음성 버블로 변환됩니다.

```bash
brew install ffmpeg
```

없으면 재생은 되지만 사각형 오디오 플레이어로 보냅니다.

## 2. STT: 음성 메시지 받아쓰기

Telegram, Discord, WhatsApp, Slack, Signal에서 들어온 음성 메시지는 자동으로 텍스트로 전사되어 대화에 주입됩니다.

| 제공자 | 품질 | 비용 | 키 |
|------|------|------|----|
| Local Whisper | 양호 | 무료 | 없음 |
| Groq Whisper API | 양호~매우 좋음 | 무료 티어 | `GROQ_API_KEY` |
| OpenAI Whisper API | 양호~매우 좋음 | 유료 | `VOICE_TOOLS_OPENAI_KEY` 또는 `OPENAI_API_KEY` |

기본 설정은 아래처럼 로컬입니다.

```yaml
stt:
  provider: "local"
  local:
    model: "base"
  openai:
    model: "whisper-1"
```

문서는 `faster-whisper`가 설치돼 있으면 거의 무설정으로 동작한다고 설명합니다. 로컬 모델 크기 선택지는 `tiny`, `base`, `small`, `medium`, `large-v3`까지 있습니다.

또한 실패 시 자동 폴백도 있습니다.

- 로컬 faster-whisper 불가 → 로컬 `whisper` CLI 또는 `HERMES_LOCAL_STT_COMMAND`
- Groq 키 없음 → 로컬 뒤 OpenAI
- OpenAI 키 없음 → 로컬 전사

## 3. Voice Mode: 실제로 말하며 대화하기

Voice Mode는 STT/TTS보다 한 단계 더 큰 기능입니다. CLI에서는 마이크로 말하고 응답을 들을 수 있고, Discord에서는 음성 채널 대화도 가능합니다.

### 준비물

문서가 요구하는 기본 조건은 다음과 같습니다.

- Hermes 설치 완료
- LLM provider 설정 완료
- 텍스트 모드에서 먼저 정상 동작 확인

추가 패키지 예시는 아래와 같습니다.

```bash
pip install "hermes-agent[voice]"
pip install "hermes-agent[messaging]"
pip install "hermes-agent[tts-premium]"
python -m pip install -U neutts[all]
```

시스템 의존성도 필요합니다.

```bash
brew install portaudio ffmpeg opus
brew install espeak-ng
```

| 의존성 | 역할 |
|------|------|
| PortAudio | 마이크 입력 및 재생 |
| ffmpeg | 포맷 변환 |
| Opus | Discord 음성 코덱 |
| espeak-ng | NeuTTS 음운 처리 |

### CLI에서 켜기

```bash
hermes
```

세션 안에서는 아래 명령을 씁니다.

```bash
/voice
/voice on
/voice off
/voice tts
/voice status
```

문서상 기본 흐름은 이렇습니다.

1. `/voice on`
2. `Ctrl+B`를 눌러 녹음 시작
3. 음성 레벨 바를 보며 말하기
4. 3초 침묵 시 자동 종료
5. 전사 후 에이전트 응답
6. 필요하면 TTS로 소리 재생

## 언제 어떤 기능을 쓰나

| 상황 | 추천 |
|------|------|
| 메시징 앱에서 음성 답장만 받고 싶음 | TTS |
| 들어온 음성 메모를 텍스트로 이해시키고 싶음 | STT |
| CLI에서 손을 덜 쓰고 직접 말하고 싶음 | Voice Mode |
| Discord 음성 채널에서 실시간 대화 | Voice Mode + Discord |

:::tip
가장 마찰이 적은 조합은 로컬 STT + Edge TTS입니다. API 키 없이도 시작할 수 있고, 필요해지면 ElevenLabs나 OpenAI로 품질만 교체하면 됩니다.
:::

---

**이전:** [← 25. 비전과 이미지 붙여넣기](#25-vision)
**다음:** [끝](#26-voice)
