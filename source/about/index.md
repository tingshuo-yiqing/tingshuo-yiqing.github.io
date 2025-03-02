---
title: me
layout: about
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
    <div class="audio-title">夜空中最亮的星 - 逃跑计划</div>
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
    <source src="https://pub-a3f1bd9f229949c4a1c424d879a5badf.r2.dev/%E5%A4%9C%E7%A9%BA%E4%B8%AD%E6%9C%80%E4%BA%AE%E7%9A%84%E6%98%9F.mp3" type="audio/mpeg">
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

{% cb 前端三件套入门, false, true %}<br>

{% cb LaTex入门(微积分，线性代数), false, true %}<br>

{% cb git与github的应用, false, true %}<br>

{% cb VS code的使用技巧, false, true %}<br><br>

<!-- <a class="btn" href="https://www.xiaohongshu.com/user/profile/6668129f000000000303359b" title="听说" style="background-color: red; color: white;">小红书</a><br> -->

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>按钮悬停效果</title>
    <style>
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: grey;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: red;
        }
    </style>
</head>
<body>
    <a class="btn" href="https://www.xiaohongshu.com/user/profile/6668129f000000000303359b" title="听说">
        小红书
    </a>
</body>
</html>

```text
2917063923@qq.com
tingshuo2917@gmail.com
```

这里是我的学习笔记和一些思考（臆想）嘿嘿

<div id="comments">
    <script src="https://utteranc.es/client.js"
            repo="tingshuo-yiqing/tingshuo-yiqing.github.io"
            issue-term="pathname"
            label="Comment"
            theme="github-dark"
            crossorigin="anonymous"
            async>
    </script>
</div>
