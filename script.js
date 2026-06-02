const timeEl = document.getElementById('time');
const heartEl = document.getElementById('heart');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const alertEl = document.getElementById('alert');

// 状态变量
let running = false;
let ms = 0, s = 0, m = 0;
let timer = null;
let beatTimer = null;

// ========== 本地音频对象（自定义节拍音、提示音） ==========
const beatAudio = new Audio('./audio/beep.wav');
const alert2minAudio = new Audio('./audio/2min.mp4');
const alert4minAudio = new Audio('./audio/4min.mp4');

// 音频基础配置
beatAudio.volume = 0.8;
alert2minAudio.volume = 0.8;
alert4minAudio.volume = 0.8;

// 播放节拍音（解决短音重复播放失效）
function playBeatSound() {
  beatAudio.currentTime = 0; // 重置播放位置
  beatAudio.play().catch(err => console.log("音频播放触发：", err));
}

// 播放2min提醒音
function playAlert2minSound() {
  alert2minAudio.currentTime = 0;
  alert2minAudio.play().catch(err => console.log("提醒音播放触发：", err));
}

// 播放4min提醒音
function playAlert4minSound() {
  alert4minAudio.currentTime = 0;
  alert4minAudio.play().catch(err => console.log("提醒音播放触发：", err));
}

// ========== 心跳动画（修复版） ==========
function heartBeatAnim() {
  heartEl.classList.add('beat');
  // 动画结束移除样式
  setTimeout(() => {
    heartEl.classList.remove('beat');
  }, 100);
}

// ========== 时间更新 ==========
function updateTime() {
  ms++;
  if (ms >= 100) {
    ms = 0;
    s++;
  }
  if (s >= 60) {
    s = 0;
    m++;
  }

  // 补零格式化
  const min = String(m).padStart(2, '0');
  const sec = String(s).padStart(2, '0');
  const msec = String(ms).padStart(2, '0');
  timeEl.innerText = `${min}:${sec}.${msec}`;

  // 2分钟提醒
  if (m === 2 && s === 0 && ms === 0) {
    alertEl.innerText = "⚠️ 2分钟到，请评估";
    playAlert2minSound();
  }
  // 4分钟提醒
  if (m === 4 && s === 0 && ms === 0) {
    alertEl.innerText = "⚠️ 4分钟到，推肾上腺素";
    playAlert4minSound();
  }
}

// ========== 开始 / 暂停 ==========
startBtn.addEventListener('click', () => {
  if (running) {
    // 暂停
    clearInterval(timer);
    clearInterval(beatTimer);
    startBtn.innerText = "开始";
    running = false;
    return;
  }

  // 启动
  startBtn.innerText = "暂停";
  running = true;

  // 毫秒级计时
  timer = setInterval(updateTime, 10);
  // 120次/分钟 = 间隔 500ms，同步动画+节拍音
  beatTimer = setInterval(() => {
    heartBeatAnim();
    playBeatSound();
  }, 500);
});

// ========== 重置 ==========
resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  clearInterval(beatTimer);
  // 归零
  ms = 0;
  s = 0;
  m = 0;
  timeEl.innerText = "00:00.00";
  alertEl.innerText = "";
  startBtn.innerText = "开始";
  running = false;
  // 停止音频
  beatAudio.pause();
  alert2minAudio.pause();
  alert4minAudio.pause();
  heartEl.classList.remove('beat');
});

// 页面卸载，销毁定时器
window.addEventListener('beforeunload', () => {
  clearInterval(timer);
  clearInterval(beatTimer);
});