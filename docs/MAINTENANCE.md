# 听说维护与开发手册

「听说」是一个静态文章站，首页按年份排列文章。发布后的站点位于 [www.tingshuoyiqing.top](https://www.tingshuoyiqing.top/)。

## 工作区与分支

| 位置 | 用途 |
| --- | --- |
| `D:\Fluid\blog-articles` | 日常编辑、写文章和本地验证，跟踪源码分支 `master` |
| `D:\Fluid\tingshuo-yiqing.github.io` | 本地发布副本，跟踪静态文件分支 `main` |
| `D:\Fluid\blog-modernized` | 早期升级工作区，含未提交的历史改动 |
| `D:\Fluid\blog-backups` | 重构前的历史备份 |

源码编辑从 `D:\Fluid\blog-articles` 开始。Vercel 的生产发布使用 GitHub 上的 `main`，该分支根目录直接存放构建结果。仅修改说明文档时，推送 `master` 即可。

## 开发与预览

在 PowerShell 中使用 Node.js 22.14 或更新版本。

```powershell
Set-Location -LiteralPath 'D:\Fluid\blog-articles'
node --version
npm.cmd ci --ignore-scripts
npm.cmd run server
```

打开 [本地预览](http://127.0.0.1:4000/)。`server` 启动前构建一次，修改文件后按 `Ctrl+C` 停止服务，再运行同一命令。依赖已经安装且锁文件没有变化时，可以直接运行 `server`。

| 命令 | 用途 |
| --- | --- |
| `npm.cmd run build` | 重新生成 `public/` |
| `npm.cmd run check` | 检查已有的 `public/`、旧文章基线、站内链接和部署文件 |
| `npm.cmd test` | 运行 Markdown 渲染测试 |
| `npm.cmd run validate` | 依次构建、检查发布文件和运行测试 |
| `npm.cmd run clean` | 清理可重新生成的 `public/` |

### 修改内容和样式

| 文件 | 负责内容 |
| --- | --- |
| `source/_posts/` | Markdown 新文章和迁入的 HTML 旧文章 |
| `source/images/`、`source/music/` | 文章引用的本地媒体 |
| `source/reader/reader.css` | 首页列表、正文排版和移动端布局 |
| `source/reader/media-player.js` | 旧文章内嵌音频的播放控制 |
| `scripts/build.cjs` | 读取文章、生成页面、复制素材和生成站点地图 |
| `lib/markdown.cjs` | Markdown、代码高亮、标题锚点和 KaTeX 公式 |
| `docs/content-baseline.json` | 迁入文章用于校验的日期、正文、代码、公式和媒体记录 |
| `_config.yml`、`source/CNAME` | 站点名称、正式 URL 和部署域名 |

改样式时先预览首页，再打开一篇含长代码块或公式的文章，缩窄窗口查看换行和横向滚动。更新依赖时一起提交 `package.json` 和 `package-lock.json`，用 `npm.cmd ci --ignore-scripts` 和 `npm.cmd run validate` 重验。

## 写文章

在 `source/_posts/` 新建一个 `.md` 文件，例如 `reading-notes.md`。

```markdown
---
title: 阅读笔记
date: 2026-11-23 12:00:00
excerpt: 一句话概括文章内容。
---

## 正文

从这里开始写。
```

- `date` 使用上海时间，格式为 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`。首页按发布时间倒序排列。
- 默认地址为 `/年/月/日/文件名/`。已经发布的文章应沿用它的原地址。需要改文件名或日期时，可以显式设置 `permalink`，例如 `2026/11/23/reading-notes/`。
- `excerpt` 用于页面描述。设置 `hide: true` 后，文章会从首页和站点地图中隐藏，持有直接链接的人仍可阅读。
- 本地图片放在 `source/images/`，在正文中写 `![图片说明](/images/文件名.png)`。外链图片和音视频用浏览器实测加载。
- 代码块可注明语言。行内公式用 `$…$`，独立公式用 `$$…$$`。含至少三个带锚点的二级或三级标题时，构建器会生成可展开的目录。

### 修改已迁入的文章

旧文章的正文在 `source/_posts/` 下的 `.html` 文件里。先用 `npm.cmd run validate` 查看差异。确实需要改正文、标题、日期、隐藏状态或媒体时，核对预览后，再更新 `docs/content-baseline.json` 中对应文章的记录。

可以用以下命令查看单篇生成正文的基线字段。把最后一行换成文章在 `public/` 下的实际路径。

```powershell
npm.cmd run build
@'
const fs = require('node:fs');
const { load } = require('cheerio');
const { snapshot } = require('./tools/content-snapshot.cjs');
const page = load(fs.readFileSync(`public/${process.argv[2]}`, 'utf8'));
console.log(JSON.stringify(snapshot(page('.markdown-body').html()), null, 2));
'@ | node - '2025/02/20/git-flow/index.html'
```

## 发布到正式站点

### 1. 验证并提交源码

在 `D:\Fluid\blog-articles` 的 `master` 上执行。开始新一轮修改前，可以用 `git status --short --branch` 确认工作区，再通过官方 SSH 地址同步两个分支的远端引用。

```powershell
$source = 'D:\Fluid\blog-articles'
$upstream = 'git@github.com:tingshuo-yiqing/tingshuo-yiqing.github.io.git'
Set-Location -LiteralPath $source
git fetch $upstream refs/heads/master:refs/remotes/origin/master refs/heads/main:refs/remotes/origin/main
if ($LASTEXITCODE -ne 0) { throw '拉取失败' }
git merge --ff-only refs/remotes/origin/master
if ($LASTEXITCODE -ne 0) { throw '请先处理源码分支差异' }
```

编辑完成后运行 `npm.cmd run validate`，在本地预览中查看首页和变更文章。用 `git status --short` 检查文件清单，`git add -- 文件路径` 暂存本次修改，再用 `git diff --cached` 审查后提交。

若这次只改文档，提交后执行 `git push $upstream HEAD:refs/heads/master` 即可。文章、样式或构建结果有变化时，继续下面的步骤。

推送使用 GitHub SSH。如果遇到权限错误，可以用 `ssh -T git@github.com` 核对识别到的 GitHub 账号。

### 2. 在临时工作区生成发布提交

下面的命令使用上一步的 `$source` 和 `$upstream`。发布工作区基于远端 `main` 的当前版本，文件来自刚验证的 `public/`。

```powershell
$release = Join-Path $env:TEMP ('tingshuo-release-' + [guid]::NewGuid().ToString('N'))
$public = Join-Path $source 'public'
if (-not (Test-Path -LiteralPath (Join-Path $public 'index.html'))) { throw '请先构建并验证 public' }

git -C $source worktree add --detach $release refs/remotes/origin/main
if ($LASTEXITCODE -ne 0) { throw '创建发布工作区失败' }
$release = (Resolve-Path -LiteralPath $release -ErrorAction Stop).Path
if ((git -C $release rev-parse --show-toplevel).Replace('/', '\') -ne $release) { throw '发布工作区路径不匹配' }
if (git -C $release status --porcelain) { throw '临时发布工作区里有未提交的改动' }

git -C $release rm -r -q -- .
if ($LASTEXITCODE -ne 0) { throw '清理旧发布文件失败' }
Get-ChildItem -LiteralPath $public -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $release $_.Name) -Recurse -Force -ErrorAction Stop
}
git -C $release add --all -- .
if ($LASTEXITCODE -ne 0) { throw '暂存发布文件失败' }
git -C $release diff --cached --stat
```

审查差异后提交。`main` 根目录应直接包含 `index.html`、文章目录、`reader/` 和 `CNAME`。如果差异为空，用 `git -C $source worktree remove $release` 清理临时工作区，再按文档修改的方式只推送源码提交。

```powershell
git -C $release commit -m 'Publish article updates'
if ($LASTEXITCODE -ne 0) { throw '创建发布提交失败' }
$sourceCommit = git -C $source rev-parse HEAD
$releaseCommit = git -C $release rev-parse HEAD
git -C $source push --atomic $upstream "${sourceCommit}:refs/heads/master" "${releaseCommit}:refs/heads/main"
if ($LASTEXITCODE -ne 0) { throw '推送失败，请核对远端分支后再重试' }
git -C $source ls-remote $upstream refs/heads/master refs/heads/main
```

### 3. 验证线上结果并收尾

在 Vercel 的生产部署记录中确认 `main` 对应的提交已成功。打开正式首页、变更过的文章和 `sitemap.xml`。确认新文章出现，旧文章直链可读，首页上的文章排序符合预期。确认后清理临时发布工作区。

```powershell
git -C $source worktree remove $release
```

需要更新 D 盘的本地发布副本时，先确认它检出的是 `main`，再快进到远端提交。

```powershell
$localMain = 'D:\Fluid\tingshuo-yiqing.github.io'
git -C $localMain fetch $upstream refs/heads/main:refs/remotes/origin/main
if ($LASTEXITCODE -ne 0) { throw '拉取发布分支失败' }
if ((git -C $localMain branch --show-current) -ne 'main') { throw '请先切换到 main' }
git -C $localMain merge --ff-only refs/remotes/origin/main
```

## 故障处理与回滚

| 现象 | 检查方法 |
| --- | --- |
| 新文章没有出现在首页 | 检查文件是否直接位于 `source/_posts/`、扩展名是否为 `.md` 或 `.html`、日期和 `hide` 的值，然后重新构建 |
| `npm.cmd run check` 报旧文章变化 | 根据提示核对对应文章的生成结果，有意修改时更新该文章的基线字段 |
| 本地预览正常，线上仍显示旧版 | 对照 `git ls-remote` 的 `main` 提交与 Vercel 生产部署记录 |
| 文章图片或公式样式异常 | 检查图片路径，以及页面请求的 `/reader/katex/katex.min.css` 是否成功；外链媒体需单独打开核对 |

如果刚上线的单个发布提交有问题，可以在本地 `main` 快进到远端后，用 `git revert --no-edit <发布提交>` 创建回滚提交，再用 `git push $upstream HEAD:refs/heads/main` 发布回滚。执行推送前确认当前工作目录是 `main` 的本地发布副本。回滚上线后，在 `master` 修正对应源码再重新生成发布文件。

日常清理用 `npm.cmd run clean` 删除本地构建目录。依赖由锁文件和 `npm.cmd ci --ignore-scripts` 恢复。历史备份位于 `D:\Fluid\blog-backups`，清理生成物时单独处理它们。
