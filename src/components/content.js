import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with highlight.js
marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
});

let contentEl = null;

export function initContent() {
  contentEl = document.getElementById('content');
}

export async function renderChapter(id) {
  if (!contentEl) return;

  // Show loading
  contentEl.innerHTML = `<div class="flex items-center justify-center py-20"><div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>`;

  try {
    const markdown = await loadMarkdown(id);
    contentEl.innerHTML = `<div class="prose max-w-none content-enter">${marked.parse(markdown)}</div>`;
    contentEl.scrollTop = 0;
  } catch (err) {
    contentEl.innerHTML = `
      <div class="text-center py-20">
        <p class="text-4xl mb-4">🚧</p>
        <h2 class="text-xl font-bold mb-2">아직 준비 중인 섹션입니다</h2>
        <p class="text-gray-500">이 챕터의 내용이 곧 추가됩니다.</p>
      </div>
    `;
  }
}

async function loadMarkdown(id) {
  // Load from built content
  const resp = await fetch(`/content/${id}.md`);
  if (!resp.ok) throw new Error('Not found');
  return await resp.text();
}
