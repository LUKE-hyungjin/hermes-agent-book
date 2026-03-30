import { marked } from 'marked';
import hljs from 'highlight.js';

// Custom marked renderer with highlight.js
const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }) {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre class="hljs"><code class="language-${language}">${highlighted}</code></pre>`;
};

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true,
});

// Pre-process :::tip / :::warning / :::info admonition blocks
// Converts them to <div class="xxx-box"> before marked.parse
function processAdmonitions(markdown) {
  const iconMap = {
    tip: '💡',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return markdown.replace(
    /^:::(tip|warning|info)\s*\n([\s\S]*?)^:::\s*$/gm,
    (match, type, content) => {
      const icon = iconMap[type] || '';
      const parsed = marked.parseInline(content.trim());
      return `<div class="${type}-box"><strong>${icon} ${type.charAt(0).toUpperCase() + type.slice(1)}</strong><p class="mb-0">${parsed}</p></div>`;
    }
  );
}

let contentEl = null;

export function initContent() {
  contentEl = document.getElementById('content');
}

export async function renderChapter(id) {
  if (!contentEl) return;

  // Show loading
  contentEl.innerHTML = `<div class="flex items-center justify-center py-20"><div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>`;

  try {
    const raw = await loadMarkdown(id);
    const markdown = processAdmonitions(raw);
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
