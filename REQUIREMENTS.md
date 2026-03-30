# 요구사항 정리 (REQUIREMENTS.md)

## 형진님이 전달한 요구사항

### 디자인
- **참고 사이트**: https://cc101.axwith.com/ko#10-mcp
- **핵심 차이점**: cc101은 스크롤하면 다음 챕터로 넘어가는 구조인데, 우리는 **사이드바에서 챕터를 클릭하면 해당 챕터만 표시**되는 구조
- 사이드바 = 고정 네비게이션 (카테고리 그룹핑, 접기/펼치기)

### 콘텐츠 소스
1. **Hermes Agent 공식 문서**: https://hermes-agent.nousresearch.com/docs/
2. **위키독스 자료**: https://wikidocs.net/334919 (Cloudflare 차단으로 직접 접근 어려움 — 공식 문서 1차 소스로 활용)

### 버전
- **Hermes Agent v0.5.0** 기준

### 콘텐츠 생성 방식
- 내용은 내가(Codex 에이전트) 목차를 보고 이해하기 쉽도록 프롬프트를 만들어서 생성
- 각 챕터별 프롬프트 → Codex가 해당 내용 작성

### 배포
- **Cloudflare Pages** 배포 예정
- 배포는 형진님이랑 같이 진행

### 작업 순서
1. **git init** (최우선)
2. Plan 작성
3. 코딩
4. 콘텐츠 생성
5. Cloudflare 배포

### 현재 상태
- 작업 디렉토리: `/Users/hyungjin/dev/hermes-agent-book`
- Hermes Agent v0.5.0 (2026.3.28) 설치됨
