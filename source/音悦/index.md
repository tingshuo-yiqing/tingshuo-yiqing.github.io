---
title: 音悦
date: 2025-03-01 21:19:07
---

{% note warning %}
如果音乐无法播放，请开魔法
{% endnote %}

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
    <div class="audio-title">痴心绝对 - 李圣杰</div>
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
    <source src="https://pub-a3f1bd9f229949c4a1c424d879a5badf.r2.dev/M800003kIRU93Grw5P.mp3" type="audio/mpeg">
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


{% fold info @痴心绝对 %}

想用一杯Latte把你灌醉
好让你能多爱我一点
暗恋的滋味你不懂这种感觉
早有人陪的你永远不会

看见你和他在我面前
证明我的爱只是愚昧
你不懂我的 那些憔悴
是你永远不曾过的体会

为你付出那种伤心你永远不了解
我又何苦勉强自己爱上你的一切
你又狠狠逼退 我的防备
静静关上门来默数我的泪

明知道让你离开他的世界不可能会
我还傻傻等到奇迹出现的那一天
直到那一天 你会发现
真正爱你的人独自守着伤悲

看见你和他在我面前
证明我的爱只是愚昧
你不懂我的 那些憔悴
是你永远不曾过的体会

明知道让你离开他的世界不可能会
我还傻傻等到奇迹出现的那一天
直到那一天 你会发现
真正爱你的人独自守着伤悲

曾经我以为我自己会后悔
不想爱得太多痴心绝对
为你落第一滴泪
为你作任何改变
也唤不回你对我的坚决

为你付出那种伤心你永远不了解
我又何苦勉强自己爱上你的一切
你又狠狠逼退 我的防备
静静关上门来默数我的泪

明知道让你离开他的世界不可能会
我还傻傻等到奇迹出现的那一天
直到那一天 你会发现
真正爱你的人独自守着伤悲

直到那一天 你会发现
真正爱你的人独自守着伤悲

{% endfold %}