'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createMarkdown } = require('../lib/markdown.cjs');

test('new Markdown articles support Chinese headings, stable duplicate anchors and highlighted code', () => {
  const md = createMarkdown();
  const html = md.render('## 例子\n\n## 例子\n\n```js\nconst value = 1;\n```');
  assert.match(html, /id="例子"/);
  assert.match(html, /id="例子-2"/);
  assert.match(html, /hljs-keyword/);
  assert.match(md.render('## 例子'), /id="例子"/);
});

test('math uses KaTeX and Mermaid remains escaped diagram source until loaded in the browser', () => {
  const html = createMarkdown().render('公式 $a^2+b^2=c^2$\n\n```mermaid\ngraph TD; A-->B;\n```');
  assert.match(html, /class="katex"/);
  assert.match(html, /annotation encoding="application\/x-tex"/);
  assert.match(html, /class="mermaid"/);
  assert.match(html, /A--&gt;B/);
});

test('raw HTML and literal template syntax in examples survive rendering', () => {
  const md = createMarkdown();
  assert.match(md.render('<div class="custom-audio-player">示例</div>'), /<div class="custom-audio-player">示例<\/div>/);
  const html = md.render('```html\n<script>alert("example")</script>\n{% note info %}\n```');
  assert.ok(!html.includes('<script>'));
  assert.match(html, /note info/);
});
