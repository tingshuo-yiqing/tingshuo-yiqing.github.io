(() => {
  dayjs.extend(window.dayjs_plugin_duration);
  const el = document.getElementById("realtime_duration");
  // 改成自己的时间
  const date = dayjs("2024-12-25 22:23:34");

  setInterval(() => {
    const dur = dayjs.duration(dayjs().diff(date));
    const days = String(Math.floor(dur.asDays()));
    el.innerHTML = "已运行" + days + dur.format("天HH时mm分ss秒");
  }, 1000);
})();
