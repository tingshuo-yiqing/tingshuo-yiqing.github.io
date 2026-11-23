'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { load: markup } = require('cheerio');
const yaml = require('js-yaml');
const { createMarkdown } = require('../lib/markdown.cjs');

const root = fs.realpathSync(path.join(__dirname, '..'));
const source = path.join(root, 'source');
const output = path.join(root, 'public');
const config = yaml.load(fs.readFileSync(path.join(root, '_config.yml'), 'utf8'));
const origin = new URL(config.url).origin;
const markdown = createMarkdown();
const escape = markdown.utils.escapeHtml;
const urlPath = value => value.split('/').map(encodeURIComponent).join('/');

function clean() {
  if (!fs.existsSync(output)) return;
  if (!fs.lstatSync(output).isDirectory() || fs.realpathSync(output) !== output) {
    throw new Error(`Expected a regular build directory: ${output}`);
  }
  fs.rmSync(output, { recursive: true });
}

function readPost(file) {
  const input = fs.readFileSync(path.join(source, '_posts', file), 'utf8');
  const match = input.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing article metadata`);
  const data = yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
  const date = String(data.date || '');
  const dateParts = date.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}:\d{2}))?$/);
  if (!dateParts || typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error(`${file}: a title and YYYY-MM-DD date are required`);
  }
  const [, day, time = '00:00:00'] = dateParts;
  const published = new Date(`${day}T${time}+08:00`);
  if (Number.isNaN(published.valueOf()) || new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) !== day) {
    throw new Error(`${file}: invalid date ${date}`);
  }
  const slug = path.parse(file).name;
  const permalink = String(data.permalink || `${day.replaceAll('-', '/')}/${slug}/`).replace(/^\/+|\/+$/g, '');
  if (permalink.split('/').some(part => !part || /^\.{1,2}$/.test(part) || /[<>:"\\|?*%#\x00-\x1f]/.test(part))) {
    throw new Error(`${file}: invalid permalink ${permalink}`);
  }
  const description = Array.isArray(data.excerpt) ? data.excerpt.join(' ') : data.excerpt;
  return {
    title: data.title,
    day,
    published: published.toISOString(),
    file: `${permalink}/index.html`,
    url: `/${urlPath(permalink)}/`,
    hidden: data.hide === true,
    description: typeof description === 'string' ? description : config.description,
    body: path.extname(file) === '.html' ? match[2] : markdown.render(match[2]),
  };
}

function article(post) {
  const $ = markup(post.body, {}, false);
  $('img').each((_, element) => {
    const image = $(element);
    const original = image.attr('data-original') || image.attr('data-src');
    if (original) image.attr('src', original);
    image.attr('loading', 'lazy');
  });
  $('h1').filter((_, element) => $(element).text().trim() === post.title).attr('hidden', '');
  $('.fold').each((_, element) => {
    const fold = $(element);
    const trigger = fold.children('.fold-title');
    const content = fold.find('.fold-content').first();
    if (!trigger.length || !content.length) return;
    const details = $('<details></details>');
    details.append($('<summary></summary>').append(trigger.contents()));
    details.append(content.contents());
    fold.replaceWith(details);
  });
  const headings = $('h2[id], h3[id]').toArray();
  const outline = headings.length >= 3 ? `<details class="contents">
  <summary>目录</summary>
  <ul>${headings.map(heading => `<li><a href="#${encodeURIComponent($(heading).attr('id'))}">${escape($(heading).text())}</a></li>`).join('')}</ul>
</details>` : '';
  const math = Boolean($('.katex').length);
  const audio = Boolean($('.custom-audio-player').length);
  return page({
    title: post.title,
    url: post.url,
    description: post.description,
    meta: `<meta property="article:published_time" content="${post.published}">`,
    math,
    audio,
    body: `<article>
  <header class="article-header">
    <h1 id="seo-header">${escape(post.title)}</h1>
    <time datetime="${post.day}">${post.day}</time>
  </header>
  ${outline}
  <div class="markdown-body">${$.html()}</div>
  <footer class="article-footer"><a href="/">返回文章列表</a></footer>
</article>`,
  });
}

function index(posts) {
  const years = new Map();
  for (const post of posts.filter(post => !post.hidden)) {
    const year = post.day.slice(0, 4);
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(post);
  }
  const groups = [...years].map(([year, entries]) => `<section class="year">
  <h2>${year}</h2>
  <ul>${entries.map(post => `<li><time datetime="${post.day}">${post.day.slice(5)}</time><a href="${post.url}">${escape(post.title)}</a></li>`).join('\n')}</ul>
</section>`).join('\n');
  return page({ url: '/', body: `<h1>${escape(config.title)}</h1>
<p class="description">${escape(config.description)}</p>
<div class="post-list">${groups}</div>` });
}

function page({ url, title, body, description = config.description, meta = '', math = false, audio = false }) {
  const documentTitle = escape(title ? `${title} · ${config.title}` : config.title);
  const canonical = escape(origin + url);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${documentTitle}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${documentTitle}">
  <meta property="og:url" content="${canonical}">
  ${meta}
  <link rel="stylesheet" href="/reader/reader.css">
  ${math ? '<link rel="stylesheet" href="/reader/katex/katex.min.css">' : ''}
  ${audio ? '<script src="/reader/media-player.js" defer></script>' : ''}
</head>
<body>
  ${url === '/' ? '' : `<header class="site-header"><a href="/">${escape(config.title)}</a></header>`}
  <main>${body}</main>
</body>
</html>
`;
}

function write(file, text) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
}

function build() {
  const posts = fs.readdirSync(path.join(source, '_posts'), { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(html|md)$/.test(entry.name))
    .map(entry => readPost(entry.name))
    .sort((left, right) => right.published.localeCompare(left.published) || left.url.localeCompare(right.url));
  const files = new Set(posts.map(post => post.file.toLowerCase()));
  if (files.size !== posts.length) throw new Error('Article permalinks must be unique');
  const pages = posts.map(post => [post.file, article(post)]);

  clean();
  write('index.html', index(posts));
  write('404.html', page({ url: '/404.html', title: '页面不存在', meta: '<meta name="robots" content="noindex">', body: '<h1>页面不存在</h1>' }));
  for (const [file, html] of pages) write(file, html);

  fs.cpSync(path.join(source, 'reader'), path.join(output, 'reader'), { recursive: true });
  for (const folder of ['images', 'music']) {
    if (fs.existsSync(path.join(source, folder))) {
      fs.cpSync(path.join(source, folder), path.join(output, folder), { recursive: true });
    }
  }
  const katex = path.dirname(require.resolve('katex'));
  const math = path.join(output, 'reader', 'katex');
  fs.mkdirSync(math);
  fs.copyFileSync(path.join(katex, 'katex.min.css'), path.join(math, 'katex.min.css'));
  fs.cpSync(path.join(katex, 'fonts'), path.join(math, 'fonts'), { recursive: true });

  const urls = ['/', ...posts.filter(post => !post.hidden).map(post => post.url)];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(origin + url)}</loc></url>`).join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  write('CNAME', fs.readFileSync(path.join(source, 'CNAME'), 'utf8'));
  write('.nojekyll', '');
  console.log(`Built ${posts.length} articles (${urls.length - 1} listed)`);
}

if (process.argv.includes('--clean')) clean();
else build();
