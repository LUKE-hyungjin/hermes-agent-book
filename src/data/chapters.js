// Chapter data for Hermes Agent Korean Guide v0.5.0
// Each entry: id (hash), number, title, category, group order

export const categories = [
  { id: 'basics', label: '기초', order: 1 },
  { id: 'config', label: '설정', order: 2 },
  { id: 'core', label: '핵심 기능', order: 3 },
  { id: 'messaging', label: '메시징', order: 4 },
  { id: 'automation', label: '자동화 & 고급', order: 5 },
  { id: 'deploy', label: '배포', order: 6 },
  { id: 'reference', label: '부록', order: 7 },
];

export const chapters = [
  // 기초
  { id: '01-what-is-hermes', num: '01', title: 'Hermes Agent란?', category: 'basics' },
  { id: '02-comparison', num: '02', title: '다른 에이전트와의 비교', category: 'basics' },
  { id: '03-installation', num: '03', title: '설치 및 설정', category: 'basics' },
  { id: '04-updating', num: '04', title: '업데이트 & 삭제', category: 'basics' },
  { id: '05-learning-path', num: '05', title: '학습 경로', category: 'basics' },

  // 설정
  { id: '06-cli', num: '06', title: 'CLI 인터페이스', category: 'config' },
  { id: '07-configuration', num: '07', title: '설정 파일', category: 'config' },
  { id: '08-sessions', num: '08', title: '세션 관리', category: 'config' },
  { id: '09-providers', num: '09', title: '프로바이더 설정', category: 'config' },
  { id: '10-security', num: '10', title: '보안', category: 'config' },

  // 핵심 기능
  { id: '11-memory', num: '11', title: '메모리 시스템', category: 'core' },
  { id: '12-skills', num: '12', title: '스킬 시스템', category: 'core' },
  { id: '13-context-files', num: '13', title: '컨텍스트 파일', category: 'core' },
  { id: '14-personality', num: '14', title: 'SOUL.md & 성격', category: 'core' },
  { id: '15-tools', num: '15', title: '도구 (Tools)', category: 'core' },
  { id: '16-mcp', num: '16', title: 'MCP 통합', category: 'core' },

  // 메시징
  { id: '17-messaging-overview', num: '17', title: '메시징 게이트웨이', category: 'messaging' },
  { id: '18-telegram', num: '18', title: 'Telegram 연동', category: 'messaging' },
  { id: '19-discord', num: '19', title: 'Discord 연동', category: 'messaging' },
  { id: '20-other-messaging', num: '20', title: 'Slack, WhatsApp 등', category: 'messaging' },

  // 자동화 & 고급
  { id: '21-cron', num: '21', title: '크론 (Cron) 작업', category: 'automation' },
  { id: '22-hooks', num: '22', title: 'Hooks', category: 'automation' },
  { id: '23-delegation', num: '23', title: '태스크 위임', category: 'automation' },
  { id: '24-browser', num: '24', title: '브라우저 도구', category: 'automation' },
  { id: '25-code-execution', num: '25', title: '코드 실행', category: 'automation' },
  { id: '26-vision', num: '26', title: '비전 & 이미지', category: 'automation' },
  { id: '27-voice', num: '27', title: '음성 모드', category: 'automation' },

  // 배포
  { id: '28-acpx', num: '28', title: 'acpx: 에이전트 간 통신', category: 'deploy' },
  { id: '29-docker', num: '29', title: 'Docker 배포', category: 'deploy' },
  { id: '30-profiles', num: '30', title: '프로필 (다중 에이전트)', category: 'deploy' },
  { id: '31-api-server', num: '31', title: 'API 서버', category: 'deploy' },

  // 부록
  { id: '32-cli-reference', num: '32', title: 'CLI 명령어 레퍼런스', category: 'reference' },
  { id: '33-env-vars', num: '33', title: '환경변수', category: 'reference' },
  { id: '34-faq', num: '34', title: 'FAQ & 트러블슈팅', category: 'reference' },
  { id: '35-skills-catalog', num: '35', title: '스킬 카탈로그', category: 'reference' },
];

export function getChapterByIndex(idx) {
  return chapters[idx] || null;
}

export function getChapterIndex(id) {
  return chapters.findIndex(c => c.id === id);
}

export function getChaptersByCategory(catId) {
  return chapters.filter(c => c.category === catId);
}
