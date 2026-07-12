/* オキロ！アラーム Service Worker */
const CACHE_NAME = "okiro-alarm-v1";
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
  "./assets/voices/voice_okoshite.wav",
  "./assets/voices/voice_asa_desuyo.wav",
  "./assets/voices/voice_chikoku.wav",
  "./assets/voices/voice_mezamete.wav",
  "./assets/voices/voice_ganbare.wav",
];

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
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
