/* =====================================================================
   ★★★  CONFIG — EDIT ONLY THIS SECTION TO PERSONALIZE THE WEBSITE  ★★★
   Save the file, then refresh the page in your browser.
   ===================================================================== */
const CONFIG = {

  // 1) NAME — who is the birthday person?
  //    (Use "Khushi Shetty" here if you'd like the full name in the big title.)
  name: "Khushi",

  // 2) BIRTHDAY DATE — 22 November. The countdown counts down to this date every year.
  birthday: { month: 11, day: 22 },

  // 3) MESSAGE — the heading and your heartfelt message.
  //    Use \n\n to start a new paragraph.
  messageHeading: "Every little moment, Khushi",
  message:
    "From Ganpati celebrations to those random nightouts, from playing games and having fun " +
    "to sitting together in the library, every little moment with you has become a beautiful memory for me. ❤️\n\n" +
    "It's crazy how we started with simple moments and slowly created so many memories together. " +
    "Whether we're celebrating, laughing, playing, studying, or just spending time doing absolutely nothing, " +
    "everything feels special when you're around.\n\n" +
    "I don't know if you realise how much these little moments mean to me, but I genuinely cherish every single one of them. " +
    "It's not always about big surprises or fancy dates; sometimes it's just about having you beside me, " +
    "making ordinary days unforgettable.\n\n" +
    "And honestly, I hope we get to make a thousand more memories together. " +
    "From Ganpati to the library, I want many more chapters of this little journey with you. ❤️✨",

  // 4) PHOTOS — put your pictures in the "images" folder (photo1.jpg ... photo6.jpg)
  //    or change the filenames below. A pretty placeholder shows until you add them.
  photos: [
    { file: "photo1.jpg", caption: "Ganpati celebrations" },
    { file: "photo2.jpg", caption: "Countless lies, still laughing" },
    { file: "photo3.jpg", caption: "Joyful moments" },
    { file: "photo4.jpg", caption: "Random nightouts" },
    { file: "photo5.jpg", caption: "Laughing for no reason" },
    { file: "photo6.jpg", caption: "Game time with you" }
  ],

  // 5) TIMELINE — label = the memory, date = the small handwritten tag under it.
  timeline: [
    { label: "Ganpati celebrations",       date: "First memory",    text: "Where so many of our simple moments began. Celebrating with you made it feel like more than just a festival." },
    { label: "Countless lies",             date: "Funniest moment", text: "We both know exactly which ones. I still laugh every time they come up." },
    { label: "Photos and joyful moments",  date: "Best day",        text: "All the pictures, all the smiles, all the days I'd happily live again." },
    { label: "Nightout",                   date: "Favorite memory", text: "Random plans, endless laughs, and you beside me. Those nights are some of my favorites." },
    { label: "Today",                      date: "Your birthday",   text: "Another year of you, and I get to celebrate it with you. That's the best gift I could ask for." }
  ],

  // 6) MUSIC — put your audio file next to index.html and name it song.mp3
  songTitle: "Our song",

  // 7) FINAL SCREEN
  finalLead: "One last thing...",
  finalMessage: "You deserve the happiest birthday ever ❤️",

  // 0) OPENING SCREEN — the short film-style intro (name above is shown too)
  openingLine1: "Some people make ordinary days feel special.",
  openingLine2: "Today is your day.",
  openingButton: "Open Your Surprise",

  // 8) HIDDEN SURPRISE — the small "Click me" near the end of the page
  secretButton: "Click me",
  secretKicker: "A secret, just for you",
  secretMessage: "Will you love me always like the same?",
  secretClose: "Close"
};
/* ===================== END OF CONFIG — no need to edit below ===================== */

const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let observers = [], timers = [], parallaxEls = [], ticking = false;
const later = (fn, ms) => timers.push(setTimeout(fn, ms));

/* ---------- Build the page from CONFIG ---------- */
function build() {
  document.title = `Happy Birthday, ${CONFIG.name}!`;

  // Birthday title, split into words and letters for the entrance animation
  const title = $("birthdayTitle");
  title.setAttribute("aria-label", `Happy Birthday, ${CONFIG.name}!`);
  title.innerHTML = "";
  let n = 0;
  `Happy Birthday, ${CONFIG.name}!`.split(" ").forEach((word) => {
    const w = document.createElement("span");
    w.className = "w";
    w.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const l = document.createElement("span");
      l.className = "l";
      l.textContent = ch;
      l.style.animationDelay = `${n++ * 60}ms`;
      w.appendChild(l);
    });
    title.appendChild(w);
  });

  $("filmName").textContent = CONFIG.name;
  $("lineOne").textContent = CONFIG.openingLine1;
  $("lineTwo").textContent = CONFIG.openingLine2;
  $("openLabel").textContent = CONFIG.openingButton;
  $("messageHeading").textContent = CONFIG.messageHeading;

  // Message split into words so it can appear gradually
  const msg = $("messageText");
  msg.innerHTML = "";
  CONFIG.message.split(/(\s+)/).forEach((part) => {
    if (!part.trim()) return msg.appendChild(document.createTextNode(part));
    const s = document.createElement("span");
    s.className = "w";
    s.textContent = part;
    msg.appendChild(s);
  });

  // Gallery
  const gallery = $("gallery");
  gallery.innerHTML = "";
  CONFIG.photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "photo reveal-img";
    fig.style.setProperty("--d", (i % 3) * 140 + "ms");
    fig.dataset.p = [0.03, -0.02, 0.04][i % 3];   // parallax speed
    fig.dataset.max = 12;                          // never drift more than 12px
    const img = new Image();
    img.src = "images/" + p.file;
    img.alt = p.caption;
    img.loading = "lazy"; img.decoding = "async";
    img.onerror = () => { img.onerror = null; img.src = placeholder(i); };
    const cap = document.createElement("figcaption");
    cap.textContent = p.caption;
    fig.append(img, cap);
    fig.addEventListener("click", () => {          // tap on phones
      const was = fig.classList.contains("active");
      gallery.querySelectorAll(".active").forEach((f) => f.classList.remove("active"));
      if (!was) fig.classList.add("active");
    });
    gallery.appendChild(fig);
  });

  // Timeline
  const tl = $("timeline");
  tl.innerHTML = "";
  CONFIG.timeline.forEach((t) => {
    const li = document.createElement("li");
    li.className = "fade";
    const h = document.createElement("h3"), d = document.createElement("time"), p = document.createElement("p");
    h.textContent = t.label; d.textContent = t.date; p.textContent = t.text;
    li.append(h, d, p);
    tl.appendChild(li);
  });

  $("songTitle").textContent = CONFIG.songTitle;
  $("finalLead").textContent = CONFIG.finalLead;
  $("finalMessage").textContent = CONFIG.finalMessage;
  decorate();
  buildSecret();
  document.querySelectorAll("#countdown-section, #music-section, #secret-section").forEach((s) => { s.classList.remove("in"); s.classList.add("fade"); });
  // reset animation states (needed for "Replay the Surprise")
  title.classList.remove("go");
  ["finalLead", "finalMessage", "replayBtn"].forEach((id) => $(id).classList.remove("show"));
}

// Soft gradient used when a photo file is missing
function placeholder(i) {
  const hues = [[330, 270], [20, 330], [270, 220], [345, 20], [290, 330], [200, 280]][i % 6];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hues[0]},55%,45%)"/><stop offset="1" stop-color="hsl(${hues[1]},50%,22%)"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><text x="200" y="240" font-size="64" text-anchor="middle" fill="rgba(255,255,255,.55)">♥</text><text x="200" y="290" font-size="18" font-family="sans-serif" text-anchor="middle" fill="rgba(255,255,255,.55)">Add your photo</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Floating particles (always on, very subtle) ---------- */
(function particles() {
  const c = $("particles"), x = c.getContext("2d");
  let W, H, dots = [];
  const size = () => {
    const r = devicePixelRatio || 1;
    W = c.width = innerWidth * r; H = c.height = innerHeight * r;
    dots = Array.from({ length: innerWidth < 700 ? 30 : 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 2 + .6) * r,
      vy: -(Math.random() * .25 + .08) * r, vx: (Math.random() - .5) * .15 * r, a: Math.random() * .5 + .15
    }));
  };
  size(); addEventListener("resize", size);
  (function loop() {
    x.clearRect(0, 0, W, H);
    dots.forEach((d) => {
      d.x += d.vx; d.y += d.vy;
      if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
      x.beginPath(); x.arc(d.x, d.y, d.r, 0, 7);
      x.fillStyle = `rgba(255,225,240,${d.a})`; x.shadowBlur = 8; x.shadowColor = "#f4a9bd"; x.fill();
    });
    if (!reduceMotion) requestAnimationFrame(loop);
  })();
})();

/* ---------- Confetti (only used for the birthday reveal) ---------- */
function confetti() {
  if (reduceMotion) return;
  const c = $("confetti"), x = c.getContext("2d"), r = devicePixelRatio || 1;
  c.width = innerWidth * r; c.height = innerHeight * r;
  const colors = ["#ffffff", "#ff9fc2", "#ffd6e7", "#b794f6", "#ff7eb3"];
  const pieces = Array.from({ length: innerWidth < 700 ? 110 : 200 }, () => ({
    x: Math.random() * c.width, y: -Math.random() * c.height * .6,
    w: (Math.random() * 8 + 5) * r, h: (Math.random() * 5 + 3) * r,
    vy: (Math.random() * 2.5 + 2) * r, vx: (Math.random() - .5) * 2 * r,
    rot: Math.random() * 6, vr: (Math.random() - .5) * .25, col: colors[Math.random() * colors.length | 0]
  }));
  const end = performance.now() + 6000;
  let last = performance.now();
  (function frame(t) {
    const dt = Math.min(3, Math.max(.2, (t - last) / 16.67)); last = t;   // 1 = one 60Hz frame
    x.clearRect(0, 0, c.width, c.height);
    let alive = 0;
    pieces.forEach((p) => {
      p.x += (p.vx + Math.sin(p.y / 60) * .6 * r) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (t >= end) p.vy *= 1 + .01 * dt;
      if (t < end && p.y > c.height) { p.y = -20; p.x = Math.random() * c.width; }
      if (p.y < c.height + 20) alive++;
      x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.col;
      x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore();
    });
    if (alive) requestAnimationFrame(frame); else x.clearRect(0, 0, c.width, c.height);
  })(performance.now());
}

/* ---------- Extra polish: heading word reveal + parallax targets ---------- */
function decorate() {
  $("story").classList.remove("enter");
  $("countdownTitle").classList.remove("in"); $("countdownTitle").classList.add("fade");
  document.querySelectorAll(".title:not(#countdownTitle), #messageHeading").forEach((el) => {
    const t = el.dataset.t || (el.dataset.t = el.textContent);
    el.classList.remove("in"); el.classList.add("reveal-text");
    el.setAttribute("aria-label", t); el.textContent = "";
    t.split(" ").forEach((word, i) => {
      const o = document.createElement("span"), s = document.createElement("span");
      o.className = "rw"; o.setAttribute("aria-hidden", "true"); o.style.setProperty("--i", i);
      s.textContent = word; o.appendChild(s); el.append(o, " ");
    });
  });
  $("birthdayTitle").dataset.p = -0.06;      // parallax speeds: small numbers = subtle
  $("smallLine").dataset.p = -0.1;
  parallaxEls = [...document.querySelectorAll("[data-p]")];
}

/* ---------- Hidden surprise ---------- */
let heartsTimer = null, lastFocus = null, cleanTimer = null;
function buildSecret() {
  $("secretLabel").textContent = CONFIG.secretButton;
  $("secretKicker").textContent = CONFIG.secretKicker;
  $("secretClose").textContent = CONFIG.secretClose;
  $("secret").setAttribute("aria-label", CONFIG.secretMessage);
  const msg = $("secretMsg");
  msg.innerHTML = "";
  CONFIG.secretMessage.split(" ").forEach((word, i) => {
    const w = document.createElement("span");
    w.className = "sw"; w.setAttribute("aria-hidden", "true");
    w.style.setProperty("--i", i); w.textContent = word;
    msg.append(w, " ");
  });
}
function spawnHeart() {
  const box = $("secretHearts");
  if (box.childElementCount > 26) return;
  const h = document.createElement("span");
  h.className = "fh";
  h.textContent = Math.random() < .25 ? "✦" : "♥";
  h.style.left = Math.random() * 100 + "%";
  h.style.fontSize = 12 + Math.random() * 22 + "px";
  h.style.color = ["#ff9fc2", "#ffd6e7", "#ffffff", "#ff7eb3", "#c9a7ff"][Math.random() * 5 | 0];
  h.style.setProperty("--dx", Math.random() * 80 - 40 + "px");
  h.style.animationDuration = 7 + Math.random() * 5 + "s";
  h.addEventListener("animationend", () => h.remove());
  box.appendChild(h);
}
function openSecret() {
  const o = $("secret"), b = $("secretBtn").getBoundingClientRect();
  clearTimeout(cleanTimer);
  o.style.setProperty("--ox", b.left + b.width / 2 + "px");   // the card opens outward from the button
  o.style.setProperty("--oy", b.top + b.height / 2 + "px");
  lastFocus = document.activeElement;
  o.classList.add("open"); o.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  if (!reduceMotion) { for (let i = 0; i < 6; i++) setTimeout(spawnHeart, 700 + i * 220); heartsTimer = setInterval(spawnHeart, 450); }
  setTimeout(() => $("secretClose").focus({ preventScroll: true }), 300);
}
function closeSecret() {
  const o = $("secret");
  if (!o.classList.contains("open")) return;
  o.classList.remove("open"); o.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  clearInterval(heartsTimer);
  cleanTimer = setTimeout(() => { $("secretHearts").innerHTML = ""; }, 1000);
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}

/* ---------- Parallax + scroll progress (one cheap rAF per scroll frame) ---------- */
function frame() {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  $("progress").style.transform = `scaleX(${Math.min(1, y / ((document.documentElement.scrollHeight - vh) || 1))})`;
  if (reduceMotion) return;
  $("aurora").style.setProperty("--sy", y);
  parallaxEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (!r.height || r.bottom < -300 || r.top > vh + 300) return;
    const cur = el._t || 0;                               // remove our own offset to get the true position
    el._t = (r.top - cur + r.height / 2 - vh / 2) * parseFloat(el.dataset.p);
    if (el.dataset.max) el._t = Math.max(-el.dataset.max, Math.min(el.dataset.max, el._t));
    el.style.translate = `0 ${el._t.toFixed(1)}px`;
  });
}

/* ---------- Scroll-triggered reveals ---------- */
function watch(el, cb, threshold = .35) {
  const o = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { cb(e.target); o.unobserve(e.target); }
  }), { threshold });
  o.observe(el); observers.push(o);
}
function setupReveals() {
  document.querySelectorAll(".fade, .reveal-img, .reveal-text").forEach((el) => watch(el, (t) => t.classList.add("in"), .2));
  watch($("messageText"), (t) => {
    t.querySelectorAll(".w").forEach((w, i) => later(() => w.classList.add("on"), reduceMotion ? 0 : i * 70));
  }, .15);
  watch($("final"), () => {
    $("finalLead").classList.add("show");
    later(() => { $("finalMessage").classList.add("show"); $("replayBtn").classList.add("show"); }, 1600);
  }, .5);
}

/* ---------- Countdown ---------- */
function tick() {
  const now = new Date(), { month, day } = CONFIG.birthday;
  let target = new Date(now.getFullYear(), month - 1, day);
  const endOfDay = new Date(now.getFullYear(), month - 1, day + 1);
  const isToday = now >= target && now < endOfDay;
  if (now >= endOfDay) target = new Date(now.getFullYear() + 1, month - 1, day);
  const ms = isToday ? 0 : target - now;
  const v = { days: Math.floor(ms / 864e5), hours: Math.floor(ms / 36e5) % 24, minutes: Math.floor(ms / 6e4) % 60, seconds: Math.floor(ms / 1e3) % 60 };
  $("cd-days").textContent = v.days;
  $("cd-hours").textContent = String(v.hours).padStart(2, "0");
  $("cd-minutes").textContent = String(v.minutes).padStart(2, "0");
  $("cd-seconds").textContent = String(v.seconds).padStart(2, "0");
  $("countdownTitle").textContent = isToday ? "Today is the day!" : "Until your birthday";
}

/* ---------- Music player (never autoplays) ---------- */
function setupMusic() {
  const a = $("audio"), btn = $("playBtn"), status = $("songStatus"), fill = $("barFill");
  let failed = false;                                   // true when song.mp3 is missing / unreadable
  const fail = () => { failed = true; btn.classList.remove("on"); status.textContent = "song.mp3 not found. Add it next to index.html"; };
  btn.addEventListener("click", () => {
    if (a.paused) { failed = false; a.play().catch(() => { if (a.error || failed) fail(); else status.textContent = "Tap play again to start the song"; }); }
    else a.pause();
  });
  a.addEventListener("play", () => { failed = false; btn.classList.add("on"); btn.setAttribute("aria-label", "Pause song"); status.textContent = "Playing"; });
  a.addEventListener("pause", () => { btn.classList.remove("on"); btn.setAttribute("aria-label", "Play song"); if (!a.ended && !failed) status.textContent = "Paused"; });
  a.addEventListener("ended", () => { fill.style.width = "0"; status.textContent = "Press play to hear it again"; });
  a.addEventListener("error", fail);
  a.addEventListener("timeupdate", () => { if (a.duration) fill.style.width = (a.currentTime / a.duration * 100) + "%"; });
  $("bar").addEventListener("click", (e) => {
    if (!a.duration) return;
    const b = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - b.left) / b.width) * a.duration;
  });
}

/* ---------- Cinematic opening: a timeline of stages (times in milliseconds) ---------- */
let filmTimers = [];
const FILM_STAGES = [          // [when, class]  — edit the times to speed up or slow down the intro
  [800, "s1"],    // small glowing light
  [2400, "s2"],   // name fades in
  [4400, "s3"],   // tiny particles
  [5200, "s4"],   // background slowly becomes visible
  [7000, "s5"],   // "Some people make ordinary days feel special."
  [10000, "s6"],  // "Today is your day."
  [12000, "s7"]   // "Open Your Surprise →"
];
function startFilm() {
  filmTimers.forEach(clearTimeout); filmTimers = [];
  const o = $("opening"), dust = $("filmDust");
  o.className = "screen";                       // back to pure black
  if (!dust.childElementCount) {
    for (let i = 0; i < (innerWidth < 700 ? 24 : 42); i++) {
      const p = document.createElement("span"), z = 1 + Math.random() * 2.2;
      p.className = "op";
      p.style.left = Math.random() * 100 + "%"; p.style.top = Math.random() * 100 + "%";
      p.style.width = p.style.height = z + "px";
      p.style.setProperty("--x", Math.random() * 60 - 30 + "px");
      p.style.setProperty("--y", -20 - Math.random() * 50 + "px");
      p.style.setProperty("--t", 6 + Math.random() * 8 + "s");
      p.style.setProperty("--dl", -Math.random() * 8 + "s");
      dust.appendChild(p);
    }
  }
  FILM_STAGES.forEach(([ms, cls]) => filmTimers.push(setTimeout(() => o.classList.add(cls), reduceMotion ? 0 : ms)));
}
function skipFilm() {                           // tap / Enter while the intro plays = jump to the button
  const o = $("opening");
  if (o.classList.contains("s7") || o.classList.contains("out")) return;
  filmTimers.forEach(clearTimeout);
  o.classList.add("skip", "s1", "s2", "s3", "s4", "s5", "s6", "s7");
}

/* ---------- Open / Replay ---------- */
function openSurprise() {
  $("opening").classList.add("out");
  $("story").hidden = false;
  document.body.classList.remove("locked");
  scrollTo({ top: 0, behavior: "instant" });
  setupReveals();
  $("story").classList.add("enter");
  frame();
  later(() => { $("birthdayTitle").classList.add("go"); confetti(); }, 700);
  $("openBtn").blur();
}
function replay() {
  observers.forEach((o) => o.disconnect()); observers = [];
  timers.forEach(clearTimeout); timers = [];
  const a = $("audio"); a.pause(); a.currentTime = 0; $("barFill").style.width = "0"; $("songStatus").textContent = "Press play when you are ready";
  scrollTo({ top: 0, behavior: "smooth" });
  later(() => {
    build();                                   // resets every animation state
    $("story").hidden = true;
    document.body.classList.add("locked");
    const o = $("opening");
    startFilm();                               // restarts the cinematic intro from black
  }, reduceMotion ? 0 : 700);
}

build();
setupMusic();
tick(); setInterval(tick, 1000);
$("openBtn").addEventListener("click", openSurprise);
$("opening").addEventListener("click", (e) => { if (!(e.target.closest && e.target.closest("#openBtn"))) skipFilm(); });
document.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") skipFilm(); });
// start the intro once fonts are ready (or after 2 seconds at most)
Promise.race([document.fonts ? document.fonts.ready : 0, new Promise((r) => setTimeout(r, 2000))]).then(startFilm);
$("replayBtn").addEventListener("click", replay);

addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
addEventListener("resize", frame);
// soft glow on glass cards follows the pointer (mouse / pen only)
document.addEventListener("pointermove", (e) => {
  const g = e.target.closest && e.target.closest(".glass");
  if (!g || e.pointerType === "touch") return;
  const r = g.getBoundingClientRect();
  g.style.setProperty("--mx", e.clientX - r.left + "px");
  g.style.setProperty("--my", e.clientY - r.top + "px");
}, { passive: true });

$("secretBtn").addEventListener("click", openSecret);
$("secretClose").addEventListener("click", closeSecret);
document.addEventListener("keydown", (e) => {
  if (!$("secret").classList.contains("open")) return;
  if (e.key === "Escape") closeSecret();
  else if (e.key === "Tab") { e.preventDefault(); $("secretClose").focus(); }   // keep focus inside the card
});
