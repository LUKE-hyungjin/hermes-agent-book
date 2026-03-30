import { chapters, getChapterIndex } from '../data/chapters.js';

let navEl = null;
let onNavigateCallback = null;

export function initNavigation(onNavigate) {
  navEl = document.getElementById('bottom-nav');
  onNavigateCallback = onNavigate;
}

export function updateNavigation(id) {
  if (!navEl) return;
  const idx = getChapterIndex(id);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  navEl.innerHTML = `
    <div class="flex justify-between items-center pt-6 mt-8 border-t border-gray-200 dark:border-gray-800">
      ${prev ? `
        <button data-nav="${prev.id}" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
          <span class="group-hover:-translate-x-1 transition-transform">←</span>
          <div class="text-left">
            <div class="text-xs text-gray-400">이전</div>
            <div>${prev.title}</div>
          </div>
        </button>
      ` : '<div></div>'}
      ${next ? `
        <button data-nav="${next.id}" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group text-right">
          <div>
            <div class="text-xs text-gray-400">다음</div>
            <div>${next.title}</div>
          </div>
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      ` : '<div></div>'}
    </div>
  `;

  navEl.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (onNavigateCallback) onNavigateCallback(btn.dataset.nav);
    });
  });
}
