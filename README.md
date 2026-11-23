# 听说

个人静态文章站。首页按年份列出文章，正文由 Node.js 生成 HTML，排版在 `source/reader/reader.css`。

## 本地运行

需要 Node.js 22.14 或更新版本。

```sh
npm ci --ignore-scripts
npm run validate
npm run server
```

在浏览器打开 `http://127.0.0.1:4000/`。`npm run validate` 会重新生成 `public/`，对照原文检查正文、代码、公式、链接和媒体，并运行 Markdown 测试。

## 写文章

在 `source/_posts/` 下建立 Markdown 文件。文件名用作默认 URL 的末段。发布日期使用上海时间。也可以用 `permalink` 指定地址，或用 `hide: true` 把文章从首页及站点地图中隐藏。隐藏文章仍可通过原地址阅读。

```markdown
---
title: 文章标题
date: 2026-11-23 12:00:00
excerpt: 一句话摘要
---

在这里开始写正文。
```

已恢复的旧文章使用 HTML，保存在同一目录。发布时保留原文章的日期、地址、标题锚点、公式和媒体引用。新文章可使用 Markdown 代码块和 KaTeX 公式，站内图片放在 `source/images/`。

## 发布

`master` 保存源码，`main` 保存可直接托管的构建产物。验证后把 `public/` 同步到 `main` 的根目录，两条分支分别提交。站点域名设置在 `_config.yml`，部署域名记录在 `source/CNAME`。
