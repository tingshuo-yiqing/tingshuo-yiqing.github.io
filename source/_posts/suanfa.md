---
title: 我接触的第一个算法
date: 2025-03-01 18:15:41
tags: 算法
categories: 算法
excerpt: 我的算法入门笔记
comments: true
---

{% note info %}

有人疼

才显得多么出众

{% endnote %}

# 我接触的第一个算法
在机房上第一节程序设计课的时候，我看老师的那个10个数求最大值的C语言程序挺有意思的，和我平时的那些过家家代码有点不同

在下课的时候我也开始尝试了一下，我一开始没有完成。但是我问了deepseek，后来就写出来了。

我一开始的代码是这样的：

![](https://cdn.jsdelivr.net/gh/tingshuo-yiqing/PicGo-tuchuang/img/20250301220744995.jpg)

```c
#include <stdio.h>

int main() {
    int max, x, i;
    scanf("%d", &x);
    max = x;
    for(i = 1; i < 10; i++) {

    }
    printf("max = %d", max);
    return 0;
}
```
一开始我不知道for循环里面怎么写，我也没注意到max = x，我就问deepseek，然后我就理解了：

首先初始化一个max(将第一个x赋max)然后再不断的将新输入的x与其比较。

连续输入10个数，用for循环对每个数进行比较，让更大的x再赋值给max，这样**不断更新max的值**，确保max始终大于x的值。

我就是没有这种思路所以写不出for循环里比较和更新的程序，于是我又重新写了一下：

```c
#include <stdio.h>

int main() {
    int max, x, i;
    scanf("%d", &x);
    max = x;
    for(i = 1; i < 10; i++) {
        scanf("%d", &x); //循环输入用于比较
        if(x > max) {
            max = x;  //如果x大于max，则将更大的x赋值给max
        }
    }
    printf("max = %d", max);  // 输入完10个数后的max就是最大值了
    return 0;
}
```
然后我就知道了，原来算法里最基础的知识点`变量的初始化`和`变量的动态更新`。