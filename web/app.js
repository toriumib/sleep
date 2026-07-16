/* オキロ！アラーム - メインロジック（日英対応） */
"use strict";

// ---------- ユーティリティ ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- 多言語（i18n） ----------
const LANG_KEY = "okiro_lang";
let LANG = localStorage.getItem(LANG_KEY);
if (LANG !== "en" && LANG !== "ja") {
  // 保存がなければブラウザ言語から推定（英語圏なら en、それ以外は ja）
  LANG = (navigator.language || "").toLowerCase().startsWith("en") ? "en" : "ja";
}

function t(key, params) {
  let s = (I18N[LANG] && I18N[LANG][key]) || I18N.ja[key] || key;
  if (params) {
    for (const k in params) s = s.replace("{" + k + "}", params[k]);
  }
  return s;
}
// 言語別アクセサ
const qText = (q) => (LANG === "en" ? q.en : q.ja);
const qAuthor = (q) => (LANG === "en" ? q.authorEn : q.author);
const nameOf = (o) => (LANG === "en" && o.nameEn ? o.nameEn : o.name);
const badgeName = (b) => (LANG === "en" ? b.nameEn : b.name);
const badgeDesc = (b) => (LANG === "en" ? b.descEn : b.desc);
const tipTitle = (tp) => (LANG === "en" ? tp.titleEn : tp.title);
const tipBody = (tp) => (LANG === "en" ? tp.bodyEn : tp.body);

let currentRingQuote = null;

function applyI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  // 動的要素の再描画
  renderEconBar();
  renderQuoteCats();
  renderQuotes();
  renderTips();
  populateSoundSelect();
  renderSoundLists();
  renderAlarms();
  renderNextAlarm();
  renderStats();
  renderThemeShop();
  renderVoiceShop();
  renderPackShop();
  renderBadges();
  // ショップの一部（テンプレ文字列）
  const tl = $("#ticket-label");
  if (tl) tl.textContent = t("ticket_label", { n: econ.tickets });
  const bt = $("#buy-ticket");
  if (bt) bt.textContent = t("buy", { n: ITEM_PRICES.snooze_ticket });
  // 鳴動中なら名言も差し替え
  if (currentRingQuote) {
    $("#ring-quote").textContent = `${qText(currentRingQuote)} — ${qAuthor(currentRingQuote)}`;
  }
}

// 言語切替ボタン
$("#lang-toggle").addEventListener("click", () => {
  LANG = LANG === "ja" ? "en" : "ja";
  localStorage.setItem(LANG_KEY, LANG);
  applyI18n();
});

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
      totalWakes: 0,
      bestStopSec: null,
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
  $("#streak-display").textContent = `🔥 ${econ.streak}${t("day_unit")}`;
  $("#ticket-display").textContent = t("ticket_chip", { n: econ.tickets });
  const sb = $("#shop-balance");
  if (sb) sb.textContent = econ.coins;
  const tc = $("#ticket-count");
  if (tc) tc.textContent = econ.tickets;
  const tl = $("#ticket-label");
  if (tl) tl.textContent = t("ticket_label", { n: econ.tickets });
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
  if (b) showCoinToast(t("badge_unlock", { x: badgeName(b) }));
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
let featuredIdx = null;
let quoteCat = "all"; // 選択中のカテゴリ

// 出典（日本語表記）からカテゴリを推定する
function quoteCategory(q) {
  const a = q.author;
  if (/聖書/.test(a)) return "bible";
  if (/アウレリウス|セネカ|ホラティウス|エピクテトス|キケロ|ウェルギリウス|オウィディウス|ユウェナリス|ラテン/.test(a)) return "roman";
  if (/ダンマパダ|一夜賢者|道元|親鸞|孟子|孔子|老子|朱熹|二宮/.test(a)) return "eastern";
  if (/ことわざ|格言/.test(a)) return "proverb";
  return "greats";
}

const QUOTE_CATS = ["all", "bible", "eastern", "roman", "greats", "proverb"];

function renderQuoteCats() {
  const wrap = $("#quote-cats");
  if (!wrap) return;
  wrap.innerHTML = QUOTE_CATS.map(
    (c) =>
      `<button class="cat-chip ${quoteCat === c ? "active" : ""}" data-cat="${c}">${t("cat_" + c)}</button>`
  ).join("");
  wrap.querySelectorAll("[data-cat]").forEach((b) =>
    b.addEventListener("click", () => {
      quoteCat = b.dataset.cat;
      renderQuoteCats();
      renderQuotes();
    })
  );
}

function renderQuotes() {
  const list = $("#quotes-list");
  const unlocked = econ.ownedPacks.includes("quote_pack");
  let pool = unlocked ? QUOTES.concat(EXTRA_QUOTES) : QUOTES;
  if (quoteCat !== "all") pool = pool.filter((q) => quoteCategory(q) === quoteCat);
  list.innerHTML = pool
    .map(
      (q) =>
        `<div class="quote-item"><p>${qText(q)}</p><p class="quote-author">— ${qAuthor(q)}</p></div>`
    )
    .join("");
  const locked = $("#quotes-locked");
  if (locked) locked.classList.toggle("hidden", unlocked);
  if (featuredIdx === null) featuredIdx = new Date().getDate() % QUOTES.length;
  renderFeaturedQuote();
}
function renderFeaturedQuote() {
  const q = QUOTES[featuredIdx] || QUOTES[0];
  $("#quote-of-day-text").textContent = qText(q);
  $("#quote-of-day-author").textContent = "— " + qAuthor(q);
}
function pickQuoteOfDay(random = false) {
  featuredIdx = random
    ? Math.floor(Math.random() * QUOTES.length)
    : new Date().getDate() % QUOTES.length;
  renderFeaturedQuote();
}
$("#shuffle-quote").addEventListener("click", () => pickQuoteOfDay(true));

// ---------- 睡眠Tips ----------
function renderTips() {
  $("#tips-list").innerHTML = TIPS.map(
    (tp) =>
      `<div class="tip-item"><div class="icon">${tp.icon}</div><div><h3>${tipTitle(tp)}</h3><p>${tipBody(tp)}</p></div></div>`
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
    `<p class="note">${t("custom_saved", { x: file.name })}</p>`;
  populateSoundSelect();
});

// ---------- サウンド一覧 ----------
function allSounds() {
  const packSounds = econ.ownedPacks.includes("sound_pack") ? PACK_SOUNDS : [];
  const shopVoices = SHOP_VOICES.filter((v) => econ.ownedVoices.includes(v.id));
  const sounds = [...BUILTIN_SOUNDS, ...packSounds, ...VOICE_SOUNDS, ...shopVoices];
  if (customSoundBlob) {
    sounds.push({ id: "custom", name: t("custom_sound_name"), nameEn: t("custom_sound_name"), file: null });
  }
  return sounds;
}

function populateSoundSelect() {
  const sel = $("#alarm-sound");
  const prev = sel.value;
  sel.innerHTML = allSounds()
    .map((s) => `<option value="${s.id}">${nameOf(s)}</option>`)
    .join("");
  if (prev) sel.value = prev;
}

function renderSoundLists() {
  const mk = (s) =>
    `<div class="sound-item"><span>${nameOf(s)}</span>
     <button class="btn-secondary" data-play="${s.id}">${t("preview")}</button></div>`;
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
    ul.innerHTML = `<li><span class="meta">${t("no_alarms")}</span></li>`;
    return;
  }
  const soundName = (id) => {
    const s = allSounds().find((x) => x.id === id);
    return s ? nameOf(s) : id;
  };
  ul.innerHTML = alarms
    .map(
      (a, i) => `<li>
        <div>
          <div class="time">${a.time}</div>
          <div class="meta">${soundName(a.sound)}${a.vibrate ? " / " + t("meta_vibrate") : ""}${a.escalate ? " / " + t("meta_escalate") : ""}</div>
        </div>
        <input type="checkbox" class="toggle" data-i="${i}" ${a.enabled ? "checked" : ""} title="ON/OFF">
        <button class="del" data-i="${i}" title="×">🗑</button>
      </li>`
    )
    .join("");
  ul.querySelectorAll(".del").forEach((b) =>
    b.addEventListener("click", () => {
      alarms.splice(Number(b.dataset.i), 1);
      saveAlarms();
      renderAlarms();
      renderNextAlarm();
    })
  );
  ul.querySelectorAll(".toggle").forEach((b) =>
    b.addEventListener("change", () => {
      alarms[Number(b.dataset.i)].enabled = b.checked;
      saveAlarms();
      renderNextAlarm();
    })
  );
}

// ---------- 次のアラームまでのカウントダウン ----------
function nextAlarmDate() {
  let best = null;
  const now = new Date();
  for (const a of alarms) {
    if (!a.enabled) continue;
    const [hh, mm] = a.time.split(":").map(Number);
    const d = new Date(now);
    d.setHours(hh, mm, 0, 0);
    if (d <= now) d.setDate(d.getDate() + 1);
    if (!best || d < best) best = d;
  }
  return best;
}

function renderNextAlarm() {
  const el = $("#next-alarm");
  if (!el) return;
  const next = nextAlarmDate();
  if (!next) {
    el.classList.add("hidden");
    return;
  }
  const diff = Math.max(0, Math.floor((next - Date.now()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  const tstr = h > 0 ? t("countdown_hms", { h, m, s }) : t("countdown_ms", { m, s });
  el.textContent = t("next_alarm", { t: tstr });
  el.classList.remove("hidden");
}

// ---------- 起床統計 ----------
function renderStats() {
  const el = $("#wake-stats");
  if (!el) return;
  if (!econ.totalWakes) {
    el.classList.add("hidden");
    return;
  }
  el.textContent = t("stats_line", { w: econ.totalWakes, s: econ.bestStopSec ?? "-" });
  el.classList.remove("hidden");
}

// ---------- Wake Lock（鳴動中は画面を消灯させない） ----------
let wakeLock = null;
async function acquireWakeLock() {
  try {
    if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
  } catch (_) {}
}
function releaseWakeLock() {
  try { wakeLock && wakeLock.release(); } catch (_) {}
  wakeLock = null;
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
  renderNextAlarm();
  // ユーザー操作のタイミングでAudioContextを解錠しておく（自動再生制限対策）
  ctx();
  if (Notification && Notification.permission === "default") {
    Notification.requestPermission();
  }
});

// ---------- 鳴動テスト（コイン加算なし） ----------
$("#test-ring").addEventListener("click", () => {
  ctx(); // ユーザー操作で AudioContext を解錠
  startRinging({
    time: $("#alarm-time").value || "07:00",
    sound: $("#alarm-sound").value,
    vibrate: $("#alarm-vibrate").checked,
    escalate: $("#alarm-escalate").checked,
    test: true,
  });
});

// ---------- 鳴動 ----------
function startRinging(alarm) {
  ringing = alarm;
  ringStartTime = Date.now();
  const overlay = $("#ring-overlay");
  overlay.classList.remove("hidden");
  $("#ring-img").src = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
  currentRingQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  $("#ring-quote").textContent = `${qText(currentRingQuote)} — ${qAuthor(currentRingQuote)}`;
  const timerEl = $("#ring-timer");
  if (alarm.test) {
    // テストモード：コイン加算なしの旨を表示
    if (timerEl) timerEl.textContent = t("test_badge");
  } else {
    if (timerEl) timerEl.textContent = t("ring_timer", { n: 0 });
    ringTimerHandle = setInterval(() => {
      const sec = Math.floor((Date.now() - ringStartTime) / 1000);
      if (timerEl) timerEl.textContent = t("ring_timer", { n: sec });
    }, 500);
  }
  acquireWakeLock();
  playSound(alarm.sound, { loop: true, escalate: alarm.escalate });
  if (alarm.vibrate && navigator.vibrate) {
    const pattern = [600, 200, 600, 200, 1000, 300];
    navigator.vibrate(pattern);
    ringing._vibTimer = setInterval(() => navigator.vibrate(pattern), 3000);
  }
  if (Notification && Notification.permission === "granted") {
    new Notification(t("notif_title"), { body: t("notif_body") + alarm.time });
  }
}

function stopRinging() {
  stopPlayback();
  releaseWakeLock();
  if (ringing && ringing._vibTimer) clearInterval(ringing._vibTimer);
  if (ringTimerHandle) { clearInterval(ringTimerHandle); ringTimerHandle = null; }
  ringing = null;
  currentRingQuote = null;
  $("#ring-overlay").classList.add("hidden");
}

$("#stop-btn").addEventListener("click", () => {
  if (!ringing) return;
  if (ringing.test) { stopRinging(); return; } // テストは報酬なしで閉じるだけ
  const elapsedSec = (Date.now() - ringStartTime) / 1000;
  const tier = ECON.stopTiers.find((tt) => elapsedSec <= tt.within);
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
  // 起床統計を更新
  econ.totalWakes = (econ.totalWakes || 0) + 1;
  const sec = Math.round(elapsedSec * 10) / 10;
  if (econ.bestStopSec == null || sec < econ.bestStopSec) econ.bestStopSec = sec;
  saveEcon();
  renderEconBar();
  renderStats();
  stopRinging();
  addCoins(coins, t("label_wake_bonus"));
  if (wasFirstStop) unlockBadge("debut");
  if (elapsedSec <= 10) unlockBadge("speedster");
});

$("#snooze-btn").addEventListener("click", () => {
  if (!ringing) return;
  if (ringing.test) { stopRinging(); return; } // テストはチケット消費なしで閉じる
  if (econ.tickets <= 0) {
    showCoinToast(t("no_ticket"));
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
  renderNextAlarm();
  if (ringing) return;
  const now = new Date();
  const hhmm =
    String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  const today = now.toDateString();
  for (const a of alarms) {
    if (!a.enabled) continue;
    if (a.time === hhmm && a.lastFired !== today + hhmm) {
      a.lastFired = today + hhmm;
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
  progress.textContent = t("ad_watching", { n: sec });
  const iv = setInterval(() => {
    sec -= 1;
    if (sec > 0) {
      progress.textContent = t("ad_watching", { n: sec });
    } else {
      clearInterval(iv);
      progress.textContent = t("ad_done");
      addCoins(ECON.adReward, t("label_ad_watch"));
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
    showCoinToast(t("ticket_bought"));
  } else {
    showCoinToast(t("not_enough_coins"));
  }
});

// ---------- ショップ: テーマ ----------
function renderThemeShop() {
  $("#theme-shop").innerHTML = THEMES.map((th) => {
    const owned = econ.ownedThemes.includes(th.id);
    const active = econ.activeTheme === th.id;
    const label = active ? t("theme_active") : owned ? t("theme_apply") : t("buy", { n: th.price });
    return `<div class="sound-item">
      <span>${nameOf(th)}</span>
      <button class="btn-secondary" data-theme-id="${th.id}" ${active ? "disabled" : ""}>${label}</button>
    </div>`;
  }).join("");
  $$("button[data-theme-id]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.themeId;
      const th = THEMES.find((x) => x.id === id);
      if (econ.ownedThemes.includes(id)) {
        applyTheme(id);
      } else if (spendCoins(th.price)) {
        econ.ownedThemes.push(id);
        applyTheme(id);
        showCoinToast(t("theme_bought", { x: nameOf(th) }));
      } else {
        showCoinToast(t("not_enough_coins"));
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
      <span>${nameOf(v)}</span>
      <button class="btn-secondary" data-voice-buy="${v.id}" ${owned ? "disabled" : ""}>${owned ? t("owned") : t("buy", { n: v.price })}</button>
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
        showCoinToast(t("voice_bought", { x: nameOf(v) }));
        renderVoiceShop();
        renderSoundLists();
        populateSoundSelect();
      } else {
        showCoinToast(t("not_enough_coins"));
      }
    })
  );
}

// ---------- ショップ: 追加コンテンツパック ----------
function renderPackShop() {
  const packs = [
    { id: "sound_pack", name: t("pack_sound_name"), price: ITEM_PRICES.sound_pack },
    { id: "quote_pack", name: t("pack_quote_name"), price: ITEM_PRICES.quote_pack },
  ];
  $("#pack-shop").innerHTML = packs
    .map((p) => {
      const owned = econ.ownedPacks.includes(p.id);
      return `<div class="sound-item">
      <span>${p.name}</span>
      <button class="btn-secondary" data-pack-buy="${p.id}" ${owned ? "disabled" : ""}>${owned ? t("owned") : t("buy", { n: p.price })}</button>
    </div>`;
    })
    .join("");
  $$("button[data-pack-buy]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.packBuy;
      if (econ.ownedPacks.includes(id)) return;
      const price = id === "sound_pack" ? ITEM_PRICES.sound_pack : ITEM_PRICES.quote_pack;
      if (spendCoins(price)) {
        econ.ownedPacks.push(id);
        saveEcon();
        showCoinToast(t("pack_unlocked"));
        renderPackShop();
        if (id === "sound_pack") {
          renderSoundLists();
          populateSoundSelect();
        }
        if (id === "quote_pack") renderQuotes();
      } else {
        showCoinToast(t("not_enough_coins"));
      }
    })
  );
}

// ---------- ショップ: ガチャ ----------
$("#gacha-btn").addEventListener("click", () => {
  if (!spendCoins(ITEM_PRICES.gacha)) {
    showCoinToast(t("not_enough_coins"));
    return;
  }
  const roll = Math.random();
  let result;
  if (roll < 0.05) {
    result = t("gacha_jackpot");
    addCoins(100, t("label_gacha_jackpot"));
  } else if (roll < 0.35) {
    result = t("gacha_win30");
    addCoins(30, t("label_gacha"));
  } else if (roll < 0.55) {
    econ.tickets += 1;
    saveEcon();
    renderEconBar();
    result = t("gacha_ticket");
  } else if (roll < 0.8) {
    result = t("gacha_win5");
    addCoins(5, t("label_gacha"));
  } else {
    result = t("gacha_miss");
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
      <div class="badge-name">${badgeName(b)}</div>
      <div class="badge-desc">${badgeDesc(b)}</div>
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
    $("#custom-sound-status").innerHTML = `<p class="note">${t("custom_saved_short")}</p>`;
  }
  applyTheme(econ.activeTheme);
  applyI18n(); // 全UIとリストを現在の言語で描画
})();
