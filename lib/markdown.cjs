'use strict';

const MarkdownIt = require('markdown-it');
const math = require('@traptitech/markdown-it-katex');
const { highlight, slugize } = require('hexo-util');

function createMarkdown() {
  const md = new MarkdownIt({ html: true, breaks: true, linkify: true, typographer: true, quotes: '“”‘’' });
  md.use(math, { throwOnError: false, strict: 'warn', trust: false });
  md.core.ruler.push('heading_ids', state => {
    const used = new Map();
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.type !== 'heading_open') continue;
      const title = (state.tokens[i + 1].children || []).map(child => child.content).join('');
      const base = slugize(title) || 'section';
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);
      token.attrSet('id', base + (count > 1 ? '-' + count : ''));
    }
  });
  md.renderer.rules.fence = (tokens, index) => {
    const { content, info } = tokens[index];
    const lang = info.trim().split(/\s+/)[0];
    if (lang === 'mermaid') return `<pre><code class="mermaid">${md.utils.escapeHtml(content)}</code></pre>\n`;
    return highlight(content, { lang, hljs: true, lineNumber: true, wrap: true, autoDetect: false }) + '\n';
  };
  return md;
}

module.exports = { createMarkdown };
