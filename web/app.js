/* オキロ！アラーム - メインロジック */
"use strict";

// ---------- ユーティリティ ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- タブ切り替え ----------
$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $("#tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---------- コイン経済 ----------
const ECON_KEY = "okiro_econ";
function loadEcon() {
  const saved = JSON.parse(localStorage.getItem(ECON_KEY) || "null");
  return Object.assign(
    {
      coins: ECON.initialCoins,
      tickets: ECON.initialTickets,
      streak: 0,
      lastWakeDateKey: null,
      totalEarned: 0,
      ownedThemes: ["default"],
      activeTheme: "default",
      ownedVoices: [],
      ownedPacks: [],
      badges: [],
    },
    saved || {}
  );
}
let econ = loadEcon();
function saveEcon() {
  localStorage.setItem(ECON_KEY, JSON.stringify(econ));
}
function renderEconBar() {
  $("#coin-balance").textContent = `🪙 ${econ.coins}`;
  $("#streak-display").textContent = `🔥 ${econ.streak}日`;
  $("#ticket-display").textContent = `😴 チケット×${econ.tickets}`;
  const sb = $("#shop-balance");
  if (sb) sb.textContent = econ.coins;
  const tc = $("#ticket-count");
  if (tc) tc.textContent = econ.tickets;
}
function showCoinToast(text) {
  const el = $("#coin-toast");
  if (!el) return;
  el.textContent = text;
  el.classList.remove("hidden");
  el.classList.add("show");
  clearTimeout(showCoinToast._t);
  showCoinToast._t = setTimeout(() => {
    el.classList.remove("show");
    el.classList.add("hidden");
  }, 2200);
}
function addCoins(n, label) {
  econ.coins += n;
  if (n > 0) econ.totalEarned += n;
  saveEcon();
  renderEconBar();
  if (n !== 0) showCoinToast(`${n > 0 ? "+" : ""}${n}🪙 ${label || ""}`.trim());
  checkBadges();
}
function spendCoins(n) {
  if (econ.coins < n) return false;
  econ.coins -= n;
  saveEcon();
  renderEconBar();
  return true;
}
function unlockBadge(id) {
  if (econ.badges.includes(id)) return;
  econ.badges.push(id);
  saveEcon();
  const b = BADGES.find((x) => x.id === id);
  if (b) showCoinToast(`🏅 実績解除: ${b.name}`);
  renderBadges();
}
function checkBadges() {
  if (econ.totalEarned >= 500) unlockBadge("rich");
  if (econ.streak >= 3) unlockBadge("streak3");
  if (econ.streak >= 7) unlockBadge("streak7");
}
function applyTheme(id) {
  document.documentElement.setAttribute("data-theme", id);
  econ.activeTheme = id;
  saveEcon();
}

// ---------- 名言 ----------
function renderQuotes() {
  const list = $("#quotes-list");
  const unlocked = econ.ownedPacks.includes("quote_pack");
  const pool = unlocked ? QUOTES.concat(EXTRA_QUOTES) : QUOTES;
  list.innerHTML = pool.map(
    (q) =>
      `<div class="quote-item"><p>${q.text}</p><p class="quote-author">— ${q.author}</p></div>`
  ).join("");
  const locked = $("#quotes-locked");
  if (locked) locked.classList.toggle("hidden", unlocked);
  pickQuoteOfDay();
}
function pickQuoteOfDay(random = false) {
  const idx = random
    ? Math.floor(Math.random() * QUOTES.length)
    : new Date().getDate() % QUOTES.length;
  $("#quote-of-day-text").textContent = QUOTES[idx].text;
  $("#quote-of-day-author").textContent = "— " + QUOTES[idx].author;
}
$("#shuffle-quote").addEventListener("click", () => pickQuoteOfDay(true));

// ---------- 睡眠Tips ----------
function renderTips() {
  $("#tips-list").innerHTML = TIPS.map(
    (t) =>
      `<div class="tip-item"><div class="icon">${t.icon}</div><div><h3>${t.title}</h3><p>${t.body}</p></div></div>`
  ).join("");
}

// ---------- ヒーロー画像ローテーション ----------
let heroIdx = 0;
setInterval(() => {
  heroIdx = (heroIdx + 1) % HERO_IMAGES.length;
  const img = $("#hero-img");
  if (img) img.src = HERO_IMAGES[heroIdx];
}, 8000);

// ---------- カスタム音源（IndexedDB） ----------
const DB_NAME = "okiro-alarm";
let customSoundBlob = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("sounds");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function saveCustomSound(file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("sounds", "readwrite");
    tx.objectStore("sounds").put(file, "custom");
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
async function loadCustomSound() {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction("sounds").objectStore("sounds").get("custom");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

$("#custom-sound-file").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  await saveCustomSound(file);
  customSoundBlob = file;
  $("#custom-sound-status").innerHTML =
    `<p class="note">✅ 「${file.name}」を保存しました。アラーム音の選択肢に「カスタム音源」が追加されます。</p>`;
  populateSoundSelect();
});

// ---------- サウンド一覧 ----------
function allSounds() {
  const packSounds = econ.ownedPacks.includes("sound_pack") ? PACK_SOUNDS : [];
  const shopVoices = SHOP_VOICES.filter((v) => econ.ownedVoices.includes(v.id));
  const sounds = [...BUILTIN_SOUNDS, ...packSounds, ...VOICE_SOUNDS, ...shopVoices];
  if (customSoundBlob) {
    sounds.push({ id: "custom", name: "カスタム音源", file: null });
  }
  return sounds;
}

function populateSoundSelect() {
  const sel = $("#alarm-sound");
  const prev = sel.value;
  sel.innerHTML = allSounds()
    .map((s) => `<option value="${s.id}">${s.name}</option>`)
    .join("");
  if (prev) sel.value = prev;
}

function renderSoundLists() {
  const mk = (s) =>
    `<div class="sound-item"><span>${s.name}</span>
     <button class="btn-secondary" data-play="${s.id}">▶ 試聴</button></div>`;
  const packSounds = econ.ownedPacks.includes("sound_pack") ? PACK_SOUNDS : [];
  const shopVoices = SHOP_VOICES.filter((v) => econ.ownedVoices.includes(v.id));
  $("#builtin-sounds").innerHTML = BUILTIN_SOUNDS.concat(packSounds).map(mk).join("");
  $("#voice-sounds").innerHTML = VOICE_SOUNDS.concat(shopVoices).map(mk).join("");
  $$("button[data-play]").forEach((b) =>
    b.addEventListener("click", () => previewSound(b.dataset.play))
  );
}

// ---------- Web Audio 再生（音量エスカレーション付き） ----------
let audioCtx = null;
let currentSource = null;
let currentGain = null;
let previewTimer = null;

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

async function soundToBuffer(id) {
  const c = ctx();
  const s = allSounds().find((x) => x.id === id);
  let arrayBuf;
  if (id === "custom" && customSoundBlob) {
    arrayBuf = await customSoundBlob.arrayBuffer();
  } else if (s && s.file) {
    arrayBuf = await (await fetch(s.file)).arrayBuffer();
  } else {
    return null;
  }
  return c.decodeAudioData(arrayBuf);
}

function stopPlayback() {
  if (previewTimer) { clearTimeout(previewTimer); previewTimer = null; }
  if (currentSource) {
    try { currentSource.stop(); } catch (_) {}
    currentSource = null;
  }
  if (navigator.vibrate) navigator.vibrate(0);
}

async function playSound(id, { loop = false, escalate = true } = {}) {
  stopPlayback();
  const c = ctx();
  const buffer = await soundToBuffer(id);
  if (!buffer) return;
  const src = c.createBufferSource();
  src.buffer = buffer;
  src.loop = loop;
  const gain = c.createGain();
  if (escalate) {
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, c.currentTime + 25);
  } else {
    gain.gain.value = 1.0;
  }
  src.connect(gain).connect(c.destination);
  src.start();
  currentSource = src;
  currentGain = gain;
}

async function previewSound(id) {
  await playSound(id, { loop: false, escalate: false });
  previewTimer = setTimeout(stopPlayback, 5000);
}

// ---------- アラーム管理 ----------
let alarms = JSON.parse(localStorage.getItem("alarms") || "[]");
let ringing = null; // 現在鳴動中のアラーム
let ringStartTime = null;
let ringTimerHandle = null;

function saveAlarms() {
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function renderAlarms() {
  const ul = $("#alarm-list");
  if (!alarms.length) {
    ul.innerHTML = `<li><span class="meta">アラームはまだありません</span></li>`;
    return;
  }
  const soundName = (id) => (allSounds().find((s) => s.id === id) || {}).name || id;
  ul.innerHTML = alarms
    .map(
      (a, i) => `<li>
        <div>
          <div class="time">${a.time}</div>
          <div class="meta">${soundName(a.sound)}${a.vibrate ? " / バイブ" : ""}${a.escalate ? " / エスカレーション" : ""}</div>
        </div>
        <input type="checkbox" class="toggle" data-i="${i}" ${a.enabled ? "checked" : ""} title="有効/無効">
        <button class="del" data-i="${i}" title="削除">🗑</button>
      </li>`
    )
    .join("");
  ul.querySelectorAll(".del").forEach((b) =>
    b.addEventListener("click", () => {
      alarms.splice(Number(b.dataset.i), 1);
      saveAlarms();
      renderAlarms();
    })
  );
  ul.querySelectorAll(".toggle").forEach((b) =>
    b.addEventListener("change", () => {
      alarms[Number(b.dataset.i)].enabled = b.checked;
      saveAlarms();
    })
  );
}

$("#add-alarm").addEventListener("click", () => {
  const time = $("#alarm-time").value;
  if (!time) return;
  alarms.push({
    time,
    sound: $("#alarm-sound").value,
    vibrate: $("#alarm-vibrate").checked,
    escalate: $("#alarm-escalate").checked,
    enabled: true,
    lastFired: null,
  });
  saveAlarms();
  renderAlarms();
  // ユーザー操作のタイミングでAudioContextを解錠しておく（自動再生制限対策）
  ctx();
  if (Notification && Notification.permission === "default") {
    Notification.requestPermission();
  }
});

// ---------- 鳴動 ----------
function startRinging(alarm) {
  ringing = alarm;
  ringStartTime = Date.now();
  const overlay = $("#ring-overlay");
  overlay.classList.remove("hidden");
  $("#ring-img").src = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
  const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  $("#ring-quote").textContent = `${q.text} — ${q.author}`;
  const timerEl = $("#ring-timer");
  if (timerEl) timerEl.textContent = "⏱ 0秒 — 早く止めるほどコインGET！";
  ringTimerHandle = setInterval(() => {
    const sec = Math.floor((Date.now() - ringStartTime) / 1000);
    if (timerEl) timerEl.textContent = `⏱ ${sec}秒 — 早く止めるほどコインGET！`;
  }, 500);
  playSound(alarm.sound, { loop: true, escalate: alarm.escalate });
  if (alarm.vibrate && navigator.vibrate) {
    // 継続バイブレーション
    const pattern = [600, 200, 600, 200, 1000, 300];
    navigator.vibrate(pattern);
    ringing._vibTimer = setInterval(() => navigator.vibrate(pattern), 3000);
  }
  if (Notification && Notification.permission === "granted") {
    new Notification("⏰ オキロ！アラーム", { body: "朝だ！起きろ！ " + alarm.time });
  }
}

function stopRinging() {
  stopPlayback();
  if (ringing && ringing._vibTimer) clearInterval(ringing._vibTimer);
  if (ringTimerHandle) { clearInterval(ringTimerHandle); ringTimerHandle = null; }
  ringing = null;
  $("#ring-overlay").classList.add("hidden");
}

$("#stop-btn").addEventListener("click", () => {
  if (!ringing) return;
  const elapsedSec = (Date.now() - ringStartTime) / 1000;
  const tier = ECON.stopTiers.find((t) => elapsedSec <= t.within);
  let coins = tier ? tier.coins : 5;
  const penalized = !!ringing.penalty;
  if (penalized) coins = Math.round(coins * ECON.snoozePenaltyFactor);
  const wasFirstStop = !econ.badges.includes("debut");
  if (!penalized) {
    const todayKey = new Date().toDateString();
    if (econ.lastWakeDateKey !== todayKey) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      econ.streak = econ.lastWakeDateKey === y.toDateString() ? econ.streak + 1 : 1;
      econ.lastWakeDateKey = todayKey;
    }
  } else {
    econ.streak = 0;
  }
  saveEcon();
  renderEconBar();
  stopRinging();
  addCoins(coins, "起床ボーナス");
  if (wasFirstStop) unlockBadge("debut");
  if (elapsedSec <= 10) unlockBadge("speedster");
});

$("#snooze-btn").addEventListener("click", () => {
  if (!ringing) return;
  if (econ.tickets <= 0) {
    showCoinToast("😴 チケットが足りません。ショップで購入してください");
    return;
  }
  econ.tickets -= 1;
  econ.streak = 0;
  saveEcon();
  renderEconBar();
  const snoozed = ringing;
  stopRinging();
  const d = new Date(Date.now() + 5 * 60 * 1000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  alarms.push({
    ...snoozed,
    time: `${hh}:${mm}`,
    lastFired: null,
    _vibTimer: undefined,
    snooze: true,
    penalty: true,
  });
  saveAlarms();
  renderAlarms();
});

// 毎秒チェック
setInterval(() => {
  if (ringing) return;
  const now = new Date();
  const hhmm =
    String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  const today = now.toDateString();
  for (const a of alarms) {
    if (!a.enabled) continue;
    if (a.time === hhmm && a.lastFired !== today + hhmm) {
      a.lastFired = today + hhmm;
      // スヌーズで作った一時アラームは発火後に自動削除
      if (a.snooze) {
        const idx = alarms.indexOf(a);
        setTimeout(() => {
          if (idx >= 0) { alarms.splice(idx, 1); saveAlarms(); renderAlarms(); }
        }, 0);
      }
      saveAlarms();
      startRinging(a);
      break;
    }
  }
}, 1000);

// ---------- ショップ: 広告視聴 ----------
$("#watch-ad").addEventListener("click", () => {
  const btn = $("#watch-ad");
  const progress = $("#ad-progress");
  btn.disabled = true;
  let sec = 5;
  progress.textContent = `📺 広告視聴中... 残り${sec}秒`;
  const iv = setInterval(() => {
    sec -= 1;
    if (sec > 0) {
      progress.textContent = `📺 広告視聴中... 残り${sec}秒`;
    } else {
      clearInterval(iv);
      progress.textContent = "✅ 視聴完了！";
      addCoins(ECON.adReward, "広告視聴");
      btn.disabled = false;
      setTimeout(() => {
        progress.textContent = "";
      }, 2500);
    }
  }, 1000);
});

// ---------- ショップ: スヌーズチケット ----------
$("#buy-ticket").addEventListener("click", () => {
  if (spendCoins(ITEM_PRICES.snooze_ticket)) {
    econ.tickets += 1;
    saveEcon();
    renderEconBar();
    showCoinToast("😴 スヌーズチケットを購入しました");
  } else {
    showCoinToast("🪙 コインが足りません");
  }
});

// ---------- ショップ: テーマ ----------
function renderThemeShop() {
  $("#theme-shop").innerHTML = THEMES.map((t) => {
    const owned = econ.ownedThemes.includes(t.id);
    const active = econ.activeTheme === t.id;
    const label = active ? "適用中" : owned ? "適用する" : `${t.price}🪙で購入`;
    return `<div class="sound-item">
      <span>${t.name}</span>
      <button class="btn-secondary" data-theme-id="${t.id}" ${active ? "disabled" : ""}>${label}</button>
    </div>`;
  }).join("");
  $$("button[data-theme-id]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.themeId;
      const t = THEMES.find((x) => x.id === id);
      if (econ.ownedThemes.includes(id)) {
        applyTheme(id);
      } else if (spendCoins(t.price)) {
        econ.ownedThemes.push(id);
        applyTheme(id);
        showCoinToast(`🎨 「${t.name}」を購入しました`);
      } else {
        showCoinToast("🪙 コインが足りません");
      }
      renderThemeShop();
    })
  );
}

// ---------- ショップ: 追加ボイス ----------
function renderVoiceShop() {
  $("#voice-shop").innerHTML = SHOP_VOICES.map((v) => {
    const owned = econ.ownedVoices.includes(v.id);
    return `<div class="sound-item">
      <span>${v.name}</span>
      <button class="btn-secondary" data-voice-buy="${v.id}" ${owned ? "disabled" : ""}>${owned ? "購入済み" : `${v.price}🪙で購入`}</button>
    </div>`;
  }).join("");
  $$("button[data-voice-buy]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.voiceBuy;
      const v = SHOP_VOICES.find((x) => x.id === id);
      if (econ.ownedVoices.includes(id)) return;
      if (spendCoins(v.price)) {
        econ.ownedVoices.push(id);
        saveEcon();
        showCoinToast(`🗣️ 「${v.name}」を購入しました`);
        renderVoiceShop();
        renderSoundLists();
        populateSoundSelect();
      } else {
        showCoinToast("🪙 コインが足りません");
      }
    })
  );
}

// ---------- ショップ: 追加コンテンツパック ----------
function renderPackShop() {
  const packs = [
    { id: "sound_pack", name: "追加アラーム音パック（雷鳴・グリッチ）", price: ITEM_PRICES.sound_pack },
    { id: "quote_pack", name: "追加名言パック（10選）", price: ITEM_PRICES.quote_pack },
  ];
  $("#pack-shop").innerHTML = packs.map((p) => {
    const owned = econ.ownedPacks.includes(p.id);
    return `<div class="sound-item">
      <span>${p.name}</span>
      <button class="btn-secondary" data-pack-buy="${p.id}" ${owned ? "disabled" : ""}>${owned ? "購入済み" : `${p.price}🪙で購入`}</button>
    </div>`;
  }).join("");
  $$("button[data-pack-buy]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.packBuy;
      if (econ.ownedPacks.includes(id)) return;
      const price = id === "sound_pack" ? ITEM_PRICES.sound_pack : ITEM_PRICES.quote_pack;
      if (spendCoins(price)) {
        econ.ownedPacks.push(id);
        saveEcon();
        showCoinToast("🎵 追加コンテンツを解放しました");
        renderPackShop();
        if (id === "sound_pack") {
          renderSoundLists();
          populateSoundSelect();
        }
        if (id === "quote_pack") renderQuotes();
      } else {
        showCoinToast("🪙 コインが足りません");
      }
    })
  );
}

// ---------- ショップ: ガチャ ----------
$("#gacha-btn").addEventListener("click", () => {
  if (!spendCoins(ITEM_PRICES.gacha)) {
    showCoinToast("🪙 コインが足りません");
    return;
  }
  const roll = Math.random();
  let result;
  if (roll < 0.05) {
    result = "🎉 大当たり！ +100🪙";
    addCoins(100, "ガチャ大当たり");
  } else if (roll < 0.35) {
    result = "✨ 当たり！ +30🪙";
    addCoins(30, "ガチャ");
  } else if (roll < 0.55) {
    econ.tickets += 1;
    saveEcon();
    renderEconBar();
    result = "😴 スヌーズチケット×1 ゲット！";
  } else if (roll < 0.8) {
    result = "🙂 +5🪙";
    addCoins(5, "ガチャ");
  } else {
    result = "💪 「今日も一日頑張ろう！」（はずれ）";
  }
  $("#gacha-result").textContent = result;
  unlockBadge("gacha_first");
});

// ---------- 実績バッジ ----------
function renderBadges() {
  $("#badges-list").innerHTML = BADGES.map((b) => {
    const unlocked = econ.badges.includes(b.id);
    return `<div class="badge-item ${unlocked ? "" : "locked"}">
      <div class="badge-icon">${unlocked ? b.icon : "🔒"}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
    </div>`;
  }).join("");
}

// ---------- PWA: Service Worker登録 ----------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

// ---------- 初期化 ----------
(async function init() {
  customSoundBlob = await loadCustomSound();
  if (customSoundBlob) {
    $("#custom-sound-status").innerHTML =
      `<p class="note">✅ カスタム音源が保存済みです。</p>`;
  }
  applyTheme(econ.activeTheme);
  populateSoundSelect();
  renderSoundLists();
  renderQuotes();
  renderTips();
  renderAlarms();
  renderEconBar();
  renderThemeShop();
  renderVoiceShop();
  renderPackShop();
  renderBadges();
})();
