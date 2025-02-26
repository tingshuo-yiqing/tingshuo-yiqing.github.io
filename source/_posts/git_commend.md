---
title: git回滚
date: 2025-2-23 13:58:14
tags: git
categories: git
excerpt: git的回滚、远程同步和一些小技巧
comments: true
---

{% note info %}
如果你愿意一层一层一层的拨开我的心

你会发现 你会讶异

你是我最压抑 最深处的秘密
{% endnote %}

2025-2-22

可以通过 `git commit -am` 命令提交所有文件的修改（当你觉得所有工作都做完以后）。但是如果有新文件，需要先 `git add`新文件名，再 `git commit `提交修改。因为 `git commit -am` 命令适用于已经跟踪的文件。

如果觉得命令太长了，可以使用alias命令来定义成一个别名,比如：

```bash
git log --oneline --graph --decorate --all

alias graph = "git log --oneline --graph --decorate --all" #将这个命令定义成一个更短的别名
```
2025-2-26
## 回滚
### 文件回滚
情况一：如果没有add，即没有暂存只在本地修改的话：
1.  `git restore <file>` 可以将修改的文件**恢复到最近一次提交的状态**

2.  `git checkout <commit-hash> <file>` 可以将修改的文件**恢复到<commit-hash>提交的状态**

情况二：如果已经add了的话:  `git restore --staged <file>` 取消暂存
1. 再利用`情况一` 恢复文件，这种操作比较安全

2. 或使用`git checkout HEAD <file>`，直接恢复到HEAD提交，这个命令会丢失本地的修改

情况三：如果已经commit（未push）了的话：
1. 可以使用`git reset --soft HEAD~1`，撤销最近的一次提交，保留修改（软回滚，仅仅回退commit，回到add之后的状态。这样`git log`不会再包含这次提交，但你的修改仍然存在，并处于**已暂存**的状态）

2. 或者使用`git reset HEAD~1`，`git log`同样不包含这次提交，但你的修改仍然存在，并处于**未暂存**的状态

3. 或者使用`git reset --hard HEAD~1`，你的修改无法保存，完全恢复到上次提交的状态。

情况四：如果已经push了的话：

总结：
![](https://cdn.jsdelivr.net/gh/tingshuo-yiqing/PicGo-tuchuang/img/20250226095341508.png)

### 分支回滚
2025-2-23
## 关于git stash
当你在开发一个分支时，突然发现自己需要切换到另一个分支，但是这个分支还没有提交，但是你又不想提交，因为你还有一些工作没有做完，这时候可以使用`git stash`命令来保存当前的工作状态，然后切换到另一个分支，等你做完了以后，再切换回来，使用`git stash pop`命令来恢复之前的工作状态。
```bash
git stash # 保存当前的工作状态
git stash list # 查看保存的工作状态列表
git stash pop # 恢复最近一次保存的工作状态
```
## 关于git pull
```bash
git pull = git fetch + git merge
```
git pull 是 git fetch 和 git merge 的缩写。git fetch 用于从远程仓库获取最新的代码，而 git merge 则用于将获取到的代码合并到本地分支。但是如果多人共同开发一个分支时，可能会出现冲突。

比如同事A修改了文件A，同事B也修改了文件A，但是同事A先一步提交了，同事B后一步提交，那同事B就会被拒绝提交，因为git merge 会将本地分支和远程分支进行合并，如果有冲突，就会拒绝合并。

所以如果多人共同开发一个分支时，最好使用 `git pull --rebase`命令，这样有冲突的话，会把你本地的提交放一边，先把远程分支的提交拉下来，然后再把你的提交放回去，这样不仅解决了冲突还保持了分支的线性。

来源于[技术爬爬虾](https://www.bilibili.com/video/BV1McyYYtEX4/?spm_id_from=333.337.search-card.all.click&vd_source=7184f70b126b0d6d3ad6ad4235c0c45c)

2025-2-27

## 关于分支合并
#### 关于合并（merge）
![merge](https://cdn.jsdelivr.net/gh/tingshuo-yiqing/PicGo-tuchuang/img/20250223140435751.png)

merge会将两个分支的提交合并成一个新的提交。分支各自的提交记录都会保留，保留整个过程完整的提交记录，可以看到每个成员的贡献。

#### 关于变基（rebase）
![rebase](https://cdn.jsdelivr.net/gh/tingshuo-yiqing/PicGo-tuchuang/img/20250223140917518.png)

来源于[GeekHour](https://www.bilibili.com/video/BV1HM411377j?spm_id_from=333.788.videopod.sections&vd_source=7184f70b126b0d6d3ad6ad4235c0c45c&p=18)

```bash
git rebase <branch> # 把当前分支的提交放到<branch>分支的后面
git rebase -i <branch> # 交互式的rebase，会弹出一个窗口，让你选择哪些提交要保留，哪些提交要删除

# 冲突解决时
git rebase --continue # 继续rebase

git rebase --skip
git rebase --abort # 取消rebase
```
#### 关于压缩（squash）

它将多个提交合并成一个提交，从而简化提交历史。虽然会保留所有代码变更的最终结果，但会丢失每个提交的细节信息，从而无法追溯每个中间开发步骤

## 关于git rm

#### 情况一：如果已经暂存了，就不能直接`git rm`bash会报错，会导致暂存区的更改丢失。
```bash
git rm --cached <file> # 移除跟踪变为Untracked，但还保留在本地上

git rm -f <file> # 强制删除, 不保留在本地
```
当你误提交了一个有用的文件时，可以使用`git rm --cached <file>`来删除，但是会保留在本地
当你决定弃用一个文件的话，可以使用`git rm -f <file>`来强制删除

##### 情况二：如果没有暂存，就可以直接`git rm`，会同时删除工作区和暂存区的文件

2025-2-24

## 文件的常见操作
> 关于这些系统命令是否需要加`git`前缀，需要根据这个文件（目录）是否被纳入管理即有没有被add

```bash
touch <file> # 创建文件
git mv <file> <newfile> # 重命名文件

echo <content> > <file> # 写入文件
echo <content> >> <file> # 追加文件内容
cat <file> # 查看文件内容

cp <file> <newfile> # 复制文件
cp -r <dir> <newdir> # 复制文件夹

mv <file> <newfile> # 重命名文件

mkdir <dir> # 创建文件夹
mkdir -p <dir1>/<dir2> # 创建递归文件夹

ls                  # 列出当前目录文件
ls -l               # 详细信息
ls -a               # 显示隐藏文件
ls -lh              # 以可读格式显示大小
ls -lt              # 按修改时间排序

cd dirname          # 进入目录
cd ..               # 返回上一级目录
cd /home/user       # 进入指定目录
cd ~                # 进入 home 目录
cd -                # 返回上次所在目录

git rm -r <dir> # 删除文件夹
git rm -rf <dir> # 强制删除文件夹
```