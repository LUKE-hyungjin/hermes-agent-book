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
  { id: '02-installation', num: '02', title: '설치 및 설정', category: 'basics' },
  { id: '03-updating', num: '03', title: '업데이트 & 삭제', category: 'basics' },
  { id: '04-learning-path', num: '04', title: '학습 경로', category: 'basics' },

  // 설정
  { id: '05-cli', num: '05', title: 'CLI 인터페이스', category: 'config' },
  { id: '06-configuration', num: '06', title: '설정 파일', category: 'config' },
  { id: '07-sessions', num: '07', title: '세션 관리', category: 'config' },
  { id: '08-providers', num: '08', title: '프로바이더 설정', category: 'config' },
  { id: '09-security', num: '09', title: '보안', category: 'config' },

  // 핵심 기능
  { id: '10-memory', num: '10', title: '메모리 시스템', category: 'core' },
  { id: '11-skills', num: '11', title: '스킬 시스템', category: 'core' },
  { id: '12-context-files', num: '12', title: '컨텍스트 파일', category: 'core' },
  { id: '13-personality', num: '13', title: 'SOUL.md & 성격', category: 'core' },
  { id: '14-tools', num: '14', title: '도구 (Tools)', category: 'core' },
  { id: '15-mcp', num: '15', title: 'MCP 통합', category: 'core' },

  // 메시징
  { id: '16-messaging-overview', num: '16', title: '메시징 게이트웨이', category: 'messaging' },
  { id: '17-telegram', num: '17', title: 'Telegram 연동', category: 'messaging' },
  { id: '18-discord', num: '18', title: 'Discord 연동', category: 'messaging' },
  { id: '19-other-messaging', num: '19', title: 'Slack, WhatsApp 등', category: 'messaging' },

  // 자동화 & 고급
  { id: '20-cron', num: '20', title: '크론 (Cron) 작업', category: 'automation' },
  { id: '21-hooks', num: '21', title: 'Hooks', category: 'automation' },
  { id: '22-delegation', num: '22', title: '태스크 위임', category: 'automation' },
  { id: '23-browser', num: '23', title: '브라우저 도구', category: 'automation' },
  { id: '24-code-execution', num: '24', title: '코드 실행', category: 'automation' },
  { id: '25-vision', num: '25', title: '비전 & 이미지', category: 'automation' },
  { id: '26-voice', num: '26', title: '음성 모드', category: 'automation' },

  // 배포
  { id: '27-docker', num: '27', title: 'Docker 배포', category: 'deploy' },
  { id: '28-profiles', num: '28', title: '프로필 (다중 에이전트)', category: 'deploy' },
  { id: '29-api-server', num: '29', title: 'API 서버', category: 'deploy' },

  // 부록
  { id: '30-cli-reference', num: '30', title: 'CLI 명령어 레퍼런스', category: 'reference' },
  { id: '31-env-vars', num: '31', title: '환경변수', category: 'reference' },
  { id: '32-faq', num: '32', title: 'FAQ & 트러블슈팅', category: 'reference' },
  { id: '33-skills-catalog', num: '33', title: '스킬 카탈로그', category: 'reference' },
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
