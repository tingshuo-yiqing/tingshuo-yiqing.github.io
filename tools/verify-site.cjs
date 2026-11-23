'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('cheerio');
const { snapshot } = require('./content-snapshot.cjs');
const baseline = require('../docs/content-baseline.json');

const output = path.resolve(__dirname, '../public');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const html = file => load(fs.readFileSync(path.join(output, file), 'utf8'));
const home = html('index.html');
const indexLinks = new Set(home('.post-list a').map((_, node) => decodeURIComponent(home(node).attr('href'))).get());
const sitemap = load(fs.readFileSync(path.join(output, 'sitemap.xml'), 'utf8'), { xmlMode: true });
const canonicalOrigin = new URL(home('link[rel=canonical]').attr('href')).origin;
const sitemapPaths = new Set(sitemap('loc').map((_, node) => decodeURIComponent(new URL(sitemap(node).text()).pathname)).get());

for (const expected of baseline.pages) {
  const $ = html(expected.path);
  const actual = snapshot($('.markdown-body').html());
  for (const key of ['text', 'code', 'formulas', 'imageUrls', 'media', 'tracks']) {
    assert.deepEqual(actual[key], expected[key], `${expected.path}: ${key}`);
  }
  const headings = expected.headings.map(({ id, text }) => ({ id, text }));
  assert.deepEqual(actual.headings, headings, `${expected.path}: headings`);
  assert.equal($('#seo-header').text().trim(), expected.title);
  const published = new Date($('meta[property="article:published_time"]').attr('content'));
  const localDate = new Date(published.getTime() + 8 * 3600e3).toISOString().slice(0, 19).replace('T', ' ');
  assert.equal(localDate, expected.date);
  const route = `/${expected.path.replace(/index\.html$/, '')}`;
  assert.equal(indexLinks.has(route), !expected.hidden, `${route}: unexpected listing status`);
  assert.equal(sitemapPaths.has(route), !expected.hidden, `${route}: unexpected sitemap status`);
}

const pages = walk(output).filter(file => file.endsWith('.html'));
for (const file of pages) {
  const relative = path.relative(output, file).split(path.sep).join('/');
  assert.match(relative, /^(?:index\.html|404\.html|\d{4}\/\d{2}\/\d{2}\/.+\/index\.html)$/);
  const $ = html(relative);
  assert.equal(new URL($('link[rel=canonical]').attr('href')).origin, canonicalOrigin);
  assert.equal($('nav, form, .utterances').length, 0, relative);
  $('[href],[src],[poster]').each((_, element) => {
    for (const name of ['href', 'src', 'poster']) {
      const raw = $(element).attr(name);
      if (!raw || !raw.startsWith('/') || raw.startsWith('//')) continue;
      const pathname = decodeURIComponent(new URL(raw, canonicalOrigin).pathname);
      const target = path.join(output, pathname.replace(/^\//, ''));
      assert.ok(fs.existsSync(target), `${relative}: missing ${raw}`);
      if (fs.statSync(target).isDirectory()) assert.ok(fs.existsSync(path.join(target, 'index.html')), raw);
    }
  });
  $('.contents a').each((_, item) => {
    const target = decodeURIComponent($(item).attr('href').slice(1));
    assert.ok($('[id]').toArray().some(node => $(node).attr('id') === target), `${relative}: missing anchor ${target}`);
  });
}

for (const file of ['CNAME', '.nojekyll', 'robots.txt', 'sitemap.xml']) {
  assert.ok(fs.existsSync(path.join(output, file)), `Missing ${file}`);
}
console.log(`Verified ${baseline.pages.length} original articles, ${indexLinks.size} index links, ${pages.length} HTML files, and deployment metadata.`);
