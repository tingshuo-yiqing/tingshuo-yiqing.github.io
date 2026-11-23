'use strict';

(() => {
  const formatTime = seconds => Number.isFinite(seconds) && seconds >= 0
    ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

  function initPlayers() {
    document.querySelectorAll('.custom-audio-player').forEach(player => {
      if (player.dataset.initialized) return;
      const audio = player.querySelector('audio');
      const playButton = player.querySelector('.play-button');
      if (!audio || !playButton) return; // Native audio examples keep their controls.
      player.dataset.initialized = 'true';
      player.classList.add('site-player');
      audio.preload = 'none';
      const playIcon = player.querySelector('.play-icon');
      const pauseIcon = player.querySelector('.pause-icon');
      const progress = player.querySelector('.progress-container');
      const bar = player.querySelector('.progress-bar');
      const current = player.querySelector('.currentTime, [id="currentTime"]');
      const duration = player.querySelector('.duration, [id="duration"]');
      const tracks = [...player.querySelectorAll('.playlist-item')];
      const status = document.createElement('span');
      status.className = 'player-status';
      status.setAttribute('role', 'status');
      player.appendChild(status);
      playButton.type = 'button';
      let fallbackAttempted = false;

      const updateButton = () => {
        const playing = !audio.paused && !audio.ended;
        if (playIcon) playIcon.style.display = playing ? 'none' : 'block';
        if (pauseIcon) pauseIcon.style.display = playing ? 'block' : 'none';
        playButton.setAttribute('aria-label', playing ? '暂停音频' : '播放音频');
        playButton.setAttribute('aria-pressed', String(playing));
      };
      const updateTime = () => {
        const known = Number.isFinite(audio.duration) && audio.duration > 0;
        const percent = known ? Math.min(100, audio.currentTime / audio.duration * 100) : 0;
        if (bar) bar.style.width = `${percent}%`;
        if (current) current.textContent = formatTime(audio.currentTime);
        if (duration) duration.textContent = formatTime(audio.duration);
        if (progress) {
          progress.setAttribute('aria-valuenow', String(Math.round(percent)));
          progress.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`);
        }
      };
      const play = async () => {
        status.textContent = '';
        try { await audio.play(); }
        catch (error) {
          if (error.name !== 'AbortError') status.textContent = '暂时无法播放，请检查网络后重试。';
          updateButton();
        }
      };
      playButton.addEventListener('click', () => audio.paused ? play() : audio.pause());
      audio.addEventListener('play', () => {
        document.querySelectorAll('audio').forEach(other => { if (other !== audio) other.pause(); });
        updateButton();
      });
      for (const event of ['pause', 'ended']) audio.addEventListener(event, updateButton);
      for (const event of ['loadedmetadata', 'durationchange', 'timeupdate', 'emptied']) audio.addEventListener(event, updateTime);
      audio.addEventListener('error', () => {
        const src = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
        const filename = decodeURIComponent(src.split('/').pop().split('?')[0]);
        if (!fallbackAttempted && ['痴心绝对.mp3', '夜空中最亮的星.mp3'].includes(filename)) {
          fallbackAttempted = true;
          audio.src = '/music/' + encodeURIComponent(filename);
          play();
        } else {
          status.textContent = '音频暂时无法加载，可以稍后重试或选择其他歌曲。';
          updateButton();
        }
      });

      if (progress) {
        progress.tabIndex = 0;
        progress.setAttribute('role', 'slider');
        progress.setAttribute('aria-label', '播放进度');
        progress.setAttribute('aria-valuemin', '0');
        progress.setAttribute('aria-valuemax', '100');
        const seek = time => {
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = Math.max(0, Math.min(audio.duration, time));
            updateTime();
          }
        };
        progress.addEventListener('click', event => {
          const rect = progress.getBoundingClientRect();
          if (rect.width > 0) seek((event.clientX - rect.left) / rect.width * audio.duration);
        });
        progress.addEventListener('keydown', event => {
          const times = { ArrowLeft: audio.currentTime - 5, ArrowRight: audio.currentTime + 5, Home: 0, End: audio.duration };
          if (Object.hasOwn(times, event.key)) { event.preventDefault(); seek(times[event.key]); }
        });
      }
      tracks.forEach(track => {
        track.tabIndex = 0;
        track.setAttribute('role', 'button');
        const select = () => {
          const resume = !audio.paused && !audio.ended;
          fallbackAttempted = false;
          status.textContent = '';
          audio.src = track.dataset.src;
          const title = player.querySelector('.audio-title');
          if (title) title.textContent = track.dataset.title || track.textContent;
          tracks.forEach(item => {
            item.classList.toggle('is-active', item === track);
            item.setAttribute('aria-pressed', String(item === track));
          });
          audio.load();
          updateTime();
          updateButton();
          if (resume) play();
        };
        track.addEventListener('click', select);
        track.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
        });
      });
      updateTime();
      updateButton();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPlayers);
  else initPlayers();
})();
