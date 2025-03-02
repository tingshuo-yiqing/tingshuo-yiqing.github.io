---
title: 我接触的第一个算法
date: 2025-03-01 18:15:41
tags: 算法
categories: 算法
excerpt: 我的算法入门笔记
comments: true
---

{% raw %}
<div class="custom-audio-player">
  <div class="audio-info">
    <button class="play-button" id="playButton" aria-label="播放音频">
      <svg class="play-icon" viewBox="0 0 24 24" fill="white">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg class="pause-icon" viewBox="0 0 24 24" fill="white">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
    </button>
    <div class="audio-title">天后 - 陈势安</div>
  </div>

  <div class="progress-container" id="progressContainer">
    <div class="progress-bar" id="progressBar"></div>
  </div>

  <div class="time-display">
    <span id="currentTime">0:00</span>
    <span id="duration">0:00</span>
  </div>

  <!-- 修正后的音频路径 -->
  <audio id="audioElement" style="display: none;">
    <source src="https://pub-a3f1bd9f229949c4a1c424d879a5badf.r2.dev/%E5%A4%A9%E5%90%8E.mp3" type="audio/mpeg">
    你的浏览器不支持音频播放。
  </audio>
</div>

<style>
  /* 自定义播放器样式 */
  .custom-audio-player {
    width: 100%;
    background-color: rgba(34, 46, 80, 0.8);
    border-radius: 8px;
    padding: 12px;
    margin: 1.5rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .audio-info { display: flex; align-items: center; margin-bottom: 10px; }
  .audio-title { 
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    margin-left: 10px;
    flex-grow: 1;
  }
  .play-button {
    background-color: #0e83cd;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress-container {
    width: 100%;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    margin-bottom: 8px;
  }
  .progress-bar {
    height: 100%;
    background-color: #0e83cd;
    border-radius: 3px;
    width: 0%;
    transition: width 0.1s linear;
  }
  .time-display {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
  }
  .pause-icon { display: none; }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const audioElement = document.getElementById('audioElement');
  const playButton = document.getElementById('playButton');
  const playIcon = document.querySelector('.play-icon');
  const pauseIcon = document.querySelector('.pause-icon');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationDisplay = document.getElementById('duration');

  // 初始化时间显示
  audioElement.addEventListener('loadedmetadata', () => {
    durationDisplay.textContent = formatTime(audioElement.duration);
  });

  // 进度条更新
  audioElement.addEventListener('timeupdate', () => {
    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
  });

  // 播放/暂停控制
  playButton.addEventListener('click', () => {
    audioElement.paused ? audioElement.play() : audioElement.pause();
    playIcon.style.display = audioElement.paused ? 'block' : 'none';
    pauseIcon.style.display = audioElement.paused ? 'none' : 'block';
  });

  // 点击进度条跳转
  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioElement.currentTime = percent * audioElement.duration;
  });

  // 时间格式化函数
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
});
</script>
{% endraw %}

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