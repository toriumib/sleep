/* オキロ！アラーム Service Worker */
// CACHE_NAME を更新すると旧キャッシュは activate 時に削除される。
// コア（HTML/JS/CSS）はネットワーク優先で常に最新を配信し、オフライン時のみキャッシュへフォールバック。
// アセット（音源・画像）はキャッシュ優先で高速化。
const CACHE_NAME = "okiro-alarm-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/img/sunrise.svg",
  "./assets/img/fire.svg",
  "./assets/img/curtain.svg",
  "./assets/img/rocket.svg",
  "./assets/img/icon-192.png",
  "./assets/img/icon-512.png",
  "./assets/sounds/alarm_classic_beep.wav",
  "./assets/sounds/alarm_chiptune.wav",
  "./assets/sounds/alarm_bell.wav",
  "./assets/sounds/alarm_siren.wav",
  "./assets/sounds/alarm_morning_chime.wav",
  "./assets/sounds/alarm_urgent.wav",
  "./assets/sounds/alarm_thunder.wav",
  "./assets/sounds/alarm_glitch.wav",
  "./assets/voices/voice_okoshite.wav",
  "./assets/voices/voice_asa_desuyo.wav",
  "./assets/voices/voice_chikoku.wav",
  "./assets/voices/voice_mezamete.wav",
  "./assets/voices/voice_ganbare.wav",
  "./assets/voices/voice_ouen.wav",
  "./assets/voices/voice_guntai.wav",
  "./assets/voices/voice_sasayaki.wav",
  "./assets/voices/voice_shitsuji.wav",
];

// ネットワーク優先にするパス（コアファイル）
const NETWORK_FIRST = /\/(index\.html)?$|\.(js|css|webmanifest)$/;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.mode === "navigate" || NETWORK_FIRST.test(url.pathname)) {
    // ネットワーク優先：成功したらキャッシュも更新
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // アセットはキャッシュ優先
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});
