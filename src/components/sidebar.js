import { categories, chapters, getChapterIndex } from '../data/chapters.js';

let sidebarEl = null;
let currentId = null;

export function initSidebar(onNavigate) {
  sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  sidebarEl.innerHTML = renderSidebar();

  // Bind category toggle
  sidebarEl.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.toggle);
      const arrow = btn.querySelector('.toggle-arrow');
      if (target) {
        target.classList.toggle('hidden');
        if (arrow) arrow.textContent = target.classList.contains('hidden') ? '▾' : '▴';
      }
    });
  });

  // Bind chapter links
  sidebarEl.querySelectorAll('[data-chapter]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.dataset.chapter;
      if (onNavigate) onNavigate(id);
    });
  });
}

export function setActiveChapter(id) {
  if (!sidebarEl) return;
  currentId = id;
  sidebarEl.querySelectorAll('[data-chapter]').forEach(link => {
    const isActive = link.dataset.chapter === id;
    link.classList.toggle('bg-blue-50', isActive);
    link.classList.toggle('dark:bg-blue-950/40', isActive);
    link.classList.toggle('text-blue-700', isActive);
    link.classList.toggle('dark:text-blue-300', isActive);
    link.classList.toggle('font-semibold', isActive);
  });
}

function renderSidebar() {
  return `
    <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-800">
      <a href="#" data-chapter="cover" class="flex items-center gap-2 text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <span class="text-2xl">⚡</span>
        <span>Hermes Agent 가이드</span>
      </a>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">v0.6.0 한국어 가이드</p>
    </div>
    <nav class="flex-1 overflow-y-auto sidebar-scroll py-2">
      ${categories.map(cat => {
        const catChapters = chapters.filter(c => c.category === cat.id);
        return `
          <div class="mb-1">
            <button data-toggle="cat-${cat.id}"
              class="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              ${cat.label}
              <span class="toggle-arrow text-[10px]">▴</span>
            </button>
            <ul id="cat-${cat.id}" class="space-y-0.5 px-2">
              ${catChapters.map(ch => `
                <li>
                  <a href="#${ch.id}" data-chapter="${ch.id}"
                    class="block px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="text-gray-400 dark:text-gray-500 mr-1.5 font-mono text-xs">${ch.num}</span>${ch.title}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }).join('')}
    </nav>
    <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
      <p>20 섹션 · 공식 문서 기반</p>
    </div>
  `;
}
