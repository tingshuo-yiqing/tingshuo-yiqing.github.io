// 获取当前时间
var now = new Date();
// 定义一个函数，用于创建并更新页面上的时间信息
function createtime() {
  // 将当前时间增加1秒
  now.setTime(now.getTime() + 1e3);
  // 定义一个目标日期为2022年8月1日00:00:00
  var e = new Date("24/12/2024 22:23:34"),
    // 计算从目标日期到当前日期经过的秒数，并乘以17，再加上一个基数234000000
    t = Math.trunc(234e8 + ((now - e) / 1e3) * 17),
    // 将计算出的距离转换为千米，并保留6位小数
    a = (t / 1496e5).toFixed(6),
    // 定义另一个目标日期为2022年8月9日00:00:00
    o = new Date("08/09/2022 00:00:00"),
    // 计算从第二个目标日期到当前日期经过的天数
    n = (now - o) / 1e3 / 60 / 60 / 24,
    // 取整数部分作为天数
    r = Math.floor(n),
    // 计算剩余的小时数
    i = (now - o) / 1e3 / 60 / 60 - 24 * r,
    // 取整数部分作为小时数
    s = Math.floor(i);
  // 如果小时数只有一位，则在前面补0
  1 == String(s).length && (s = "0" + s);
  // 计算剩余的分钟数
  var d = (now - o) / 1e3 / 60 - 1440 * r - 60 * s,
    // 取整数部分作为分钟数
    l = Math.floor(d);
  // 如果分钟数只有一位，则在前面补0
  1 == String(l).length && (l = "0" + l);
  // 计算剩余的秒数
  var g = (now - o) / 1e3 - 86400 * r - 3600 * s - 60 * l,
    // 四舍五入取整数部分作为秒数
    b = Math.round(g);
  // 如果秒数只有一位，则在前面补0
  1 == String(b).length && (b = "0" + b);
  // 定义一个变量用于存储要显示的HTML内容
  let c = "";
  // 根据当前小时数选择不同的图片和文字
  (c =
    s < 18 && s >= 9
      ? `<img class='boardsign' src='https://sourcebucket.s3.ladydaily.com/badge/F小屋-科研摸鱼中.svg' title='什么时候能够实现财富自由呀~'><br> <div style="font-size:13px;font-weight:bold">本站居然运行了 ${r} 天 ${s} 小时 ${l} 分 ${b} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 旅行者 1 号当前距离地球 ${t} 千米，约为 ${a} 个天文单位 🚀</div>`
      : `<img class='boardsign' src='https://sourcebucket.s3.ladydaily.com/badge/F小屋-下班休息啦.svg' title='下班了就该开开心心地玩耍~'><br> <div style="font-size:13px;font-weight:bold">本站居然运行了 ${r} 天 ${s} 小时 ${l} 分 ${b} 秒 <i id="heartbeat" class='fas fa-heartbeat'></i> <br> 旅行者 1 号当前距离地球 ${t} 千米，约为 ${a} 个天文单位 🚀</div>`),
    // 如果页面上存在id为"workboard"的元素，则更新其内容
    document.getElementById("workboard") &&
      (document.getElementById("workboard").innerHTML = c);
}
// 每隔1秒调用一次createtime函数，以更新时间信息
setInterval(() => {
  createtime();
}, 1e3);
