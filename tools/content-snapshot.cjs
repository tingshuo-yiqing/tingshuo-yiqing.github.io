'use strict';

const cheerio = require('cheerio');
const normalize = text => text.replace(/\s+/g, ' ').trim();

function snapshot(html) {
  const $ = cheerio.load(html, {}, false);
  const imageUrls = $('img').map((_, el) => $(el).attr('data-original') || $(el).attr('data-src') || $(el).attr('src')).get();
  const code = $('figure.highlight td.code pre, pre > code').map((_, el) => {
    const copy = $(el).clone();
    copy.find('br').replaceWith('\n');
    return copy.text().replace(/\r\n/g, '\n').trimEnd();
  }).get();
  const formulas = $('annotation[encoding="application/x-tex"]').map((_, el) => normalize($(el).text())).get();
  const media = $('audio source, video source, audio[src], video[src], iframe[src], .playlist-item[data-src]')
    .map((_, el) => $(el).attr('src') || $(el).attr('data-src')).get();
  const tracks = $('.audio-title, .playlist-item').map((_, el) => normalize($(el).text())).get();
  const headings = $('h1,h2,h3,h4,h5,h6').map((_, el) => ({ id: $(el).attr('id'), text: normalize($(el).text()) })).get();
  // Generated controls, line numbers and duplicated math accessibility markup are not prose.
  $('script,style,figure.highlight,pre,.custom-audio-player,audio,video,iframe,.katex').remove();
  return { text: normalize($.root().text()), code, formulas, imageUrls, media, tracks, headings };
}

module.exports = { snapshot, normalize };
