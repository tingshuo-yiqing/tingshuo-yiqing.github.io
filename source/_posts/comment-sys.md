---
title: 为Fluid添加评论系统
date: 2025-02-23 10:00:00
tags: ['comment']
comments: true
excerpt: 基于github issue的utterences评论系统，包含about页
math: true
---
{% note info %}

缓缓飘落的枫叶像思念

我点燃烛火温暖岁末的秋天

{% endnote %}

## 简单介绍
utterances是一个基于github issue的评论系统，它利用github的issue来存储评论。

当访客在博客上发表评论时，会在对应的仓库中创建一个issue，issue的内容就是评论的内容所以要有一个公开的仓库来存储评论。

构建这个评论系统只需要一个github账号就可以了，还是非常方便的。

## 搭建过程
先安装utterances，打开 [utterances - GitHub App](https://github.com/apps/utterances) 点击 Install 进入安装页面

按照提示一步一步填入对应的信息

首先是在仓库访问权限`Repositeory access`选择仅选定的仓库`Only select repositories`，然后选择自己的博客仓库（比如我就是 `tingshuo-yiqing/tingshuo-yiqing.github.io`，也可以安装到其他仓库），然后点击 Install
![](https://cdn.jsdelivr.net/gh/tingshuo-yiqing/PicGo-tuchuang/img/20250224090359554.png)

这时已经配置好了，接下来有一些个性化设置让你选择。

`Blog Post ↔️ Issue Mapping`表示 issues 标题和博客 posts 的映射关系，默认即可。

把主题配置文件(`_config.theme.yml`)的 `enable: true` 和`type: utterances` 打开,再把 `utterances` 对应的参数改成HTML里面的。

复制最底下的HTML代码到博客的 `about` 中。
然后在 `index.md` 中添加 `comments: true` 即可。

![](https://cdn.jsdelivr.net/gh/tingshuo-yiqing/PicGo-tuchuang/img/20250224091216161.png)

这样就可以在 about 页添加评论了。
