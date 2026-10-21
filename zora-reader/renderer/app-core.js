/* zora reader — core: state, views, clock, calibration, settings, updater */
"use strict";

const ZORA = {
  version: "",
  grade: null,
  books: [],
  settings: JSON.parse(localStorage.getItem("zora:settings") || "{}"),
};
const FA_D = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
const toFa = (s) => String(s).replace(/\d/g, (d) => FA_D[d]);
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

/* ================= GRADE META ================= */
const GRADE_COLORS = ["#A99BFF","#88B9F8","#78C9A5","#E8B86D","#F08080","#BDB3FF","#8D7DE8","#6FC7D6","#D9A7F0"];
const GRADE_NAMES = { 1:"اول", 2:"دوم", 3:"سوم", 4:"چهارم", 5:"پنجم", 6:"ششم", 7:"هفتم", 8:"هشتم", 9:"نهم" };
const GRADE_LEVEL = (g) => g <= 6 ? "دبستان" : "متوسطه‌ی اول";

/* ================= HOME ================= */
async function renderHome() {
  const grid = $("grades-grid");
  grid.innerHTML = "";
  const books = ZORA.books;
  for (const b of books) {
    const c = el("article", "grade-card");
    c.innerHTML = `
      <span class="grade-num">${toFa(b.grade)}</span>
      <span class="grade-badge" style="background:${GRADE_COLORS[(b.grade - 1) % 9]}">${toFa(b.grade)}</span>
      <div class="grade-name">پایه‌ی ${GRADE_NAMES[b.grade]}</div>
      <div class="grade-meta">${GRADE_LEVEL(b.grade)} · ${toFa(b.sizeMB)} مگابایت</div>`;
    c.addEventListener("click", () => openGrade(b.grade));
    grid.appendChild(c);
  }
  if (!books.length) {
    grid.appendChild(el("p", "grade-hint", "کتاب‌ها یافت نشد — اپ را دوباره نصب کن یا با تیم zora تماس بگیر."));
  }
}

async function openGrade(grade) {
  ZORA.grade = grade;
  $("grade-title").textContent = `پایه‌ی ${GRADE_NAMES[grade]} — ${GRADE_LEVEL(grade)}`;
  const grid = $("subjects-grid");
  grid.innerHTML = `<div class="reader-loading" style="position:static;background:transparent"><div class="spinner"></div><p>در حال بازکردن بسته‌ی پایه…</p></div>`;
  showView("grade");
  const pdfs = await window.zora.listPdfs(grade);
  grid.innerHTML = "";
  if (!pdfs.length) {
    grid.appendChild(el("p", "grade-hint", "کتابی در این پایه پیدا نشد."));
    return;
  }
  for (const p of pdfs) {
    const meta = SUBJECT_META(p.entry || p.name);
    const card = el("article", "subject-card");
    const cover = `covers/${meta.cover}.jpg`;
    const disp = meta.name || p.name;
    card.innerHTML = `
      <div class="subject-cover">
        <img src="${cover}" alt="${disp}" loading="lazy"
             onerror="this.outerHTML='<div class=\\'cover-fallback\\'>${disp.slice(0,1)}</div>'" />
        <span class="subject-famous">${meta.famous}</span>
        <span class="subject-name">${disp}<small>${toFa(p.sizeMB)} مگابایت</small></span>
      </div>`;
    card.addEventListener("click", () => Reader.open(grade, p));
    grid.appendChild(card);
  }
}

/* ================= VIEW SWITCH ================= */
function showView(name) {
  for (const v of ["home", "grade", "reader"]) $("view-" + v).classList.toggle("hidden", v !== name);
  if (name === "home") { window.zora.setTitle("کتاب‌خانه"); renderHome(); }
  const vq = $("varqo"); if (vq) vq.style.display = name === "reader" ? "flex" : "none";
}

/* ================= CLOCK (Jalali) ================= */
let focusTimer = null;
function tickClock() {
  const now = new Date();
  const t = now.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  const d = now.toLocaleDateString("fa-IR", { weekday: "long", day: "numeric", month: "long" });
  $("clock-time").textContent = t;
  $("clock-date").textContent = d;
  const t2 = $("clock-time2"); if (t2) t2.textContent = t;
}
function startFocus() {
  if (focusTimer) { stopFocus(); return; }
  let remain = 25 * 60;
  $("focus-time").classList.add("running");
  $("focus-start").textContent = "توقف";
  focusTimer = setInterval(() => {
    remain--;
    const m = String(Math.floor(remain / 60)).padStart(2, "0");
    const s = String(remain % 60).padStart(2, "0");
    $("focus-time").textContent = `${m}:${s}`;
    if (remain <= 0) { stopFocus(); Birds.toast("آفرین! 🎉 ۲۵ دقیقه تمرکز کامل شد — ۵ دقیقه استراحت حق توست!"); }
  }, 1000);
}
function stopFocus() {
  clearInterval(focusTimer); focusTimer = null;
  $("focus-time").textContent = "25:00"; $("focus-time").classList.remove("running");
  $("focus-start").textContent = "شروع";
}

/* ================= CALIBRATION (smart board) ================= */
const Cal = {
  pts: [], scale: ZORA.settings.calScale || 1,
  open() {
    $("calibration-overlay").classList.remove("hidden");
    this.pts = []; this.step(1);
  },
  step(n) {
    const names = ["بالا-راست", "بالا-چپ", "پایین-چپ", "پایین-راست"];
    $("cal-step").innerHTML = `روی نقطه‌ی <b>${toFa(n)} از ۴</b> (${names[n - 1]}) کلیک کن — همان‌جایی که تصویر روی تخته تمام می‌شود.`;
    $("cal-dot").style.alignSelf = ["flex-start", "flex-start", "flex-end", "flex-end"][n - 1];
    $("cal-dot").style.marginRight = ["auto", "0", "0", "auto"][n - 1];
    $("cal-dot").style.marginLeft = ["0", "auto", "auto", "0"][n - 1];
  },
  clickCorner(e) {
    const box = e.currentTarget.getBoundingClientRect();
    this.pts.push({ x: e.clientX - box.left, y: e.clientY - box.top });
    if (this.pts.length < 4) { this.step(this.pts.length + 1); return; }
    const xs = this.pts.map((p) => p.x), ys = this.pts.map((p) => p.y);
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const s = Math.min(1.6, Math.max(0.6, Math.max(w / (box.width - 40), h / (box.height - 40))));
    this.scale = s;
    this.apply();
    Birds.toast(`کالیبراسیون انجام شد ✨ بزرگ‌نمایی ${toFa(Math.round(s * 100))}٪ اعمال شد.`);
    this.close();
  },
  fine(delta) { this.scale = Math.min(1.8, Math.max(0.55, this.scale + delta)); this.apply(); },
  apply() {
    const app = $("app");
    app.style.transform = `scale(${this.scale})`;
    ZORA.settings.calScale = this.scale;
    localStorage.setItem("zora:settings", JSON.stringify(ZORA.settings));
    const w = innerWidth, h = innerHeight;
    app.style.marginLeft = `${(w - w * this.scale) / 2}px`;
    app.style.marginTop = `${(h - h * this.scale) / 2}px`;
  },
  reset() {
    this.scale = 1; $("app").style.transform = ""; $("app").style.marginLeft = ""; $("app").style.marginTop = "";
    delete ZORA.settings.calScale; localStorage.setItem("zora:settings", JSON.stringify(ZORA.settings));
    Birds.toast("کالیبراسیون حذف شد.");
  },
  close() { $("calibration-overlay").classList.add("hidden"); },
};

/* ================= SETTINGS POP ================= */
function toggleSettings() {
  $("settings-pop").classList.toggle("hidden");
  $("focus-pop").classList.add("hidden");
}

/* ================= SMART DOWNLOAD (no GitHub visible) ================= */
async function smartDownload() {
  $("dl-overlay").classList.remove("hidden");
  const box = $("dl-mirrors");
  box.innerHTML = "";
  let release = null;
  try { release = await window.zora.checkUpdate(); } catch {}
  const dl = release && release.downloads && release.downloads.find((d) => d.id === "setup" && d.available) || null;
  const mirrors = dl ? (dl.mirrors && dl.mirrors.length ? dl.mirrors : [{ id: "primary", label: "سرور zora", url: dl.url }]) : [];
  $("dl-size").textContent = dl ? toFa(dl.sizeMB) + " مگابایت" : "…";
  if (!mirrors.length) {
    box.appendChild(el("p", "dl-note", "فعلاً لینکی یافت نشد — بعداً دوباره امتحان کن یا از سایت رسمی zora دانلود کن."));
    return;
  }
  const results = [];
  for (const m of mirrors) {
    const row = el("button", "dl-mirror checking",
      `<span><span class="m-name">${m.label}</span><span class="m-sub">${m.sub || ""}</span></span><span class="m-lat">…</span>`);
    box.appendChild(row);
    const t0 = performance.now();
    let ms = null;
    try {
      await Promise.race([
        fetch(m.url, { method: "HEAD", mode: "no-cors", cache: "no-store" }),
        new Promise((_, rj) => setTimeout(rj, 3500)),
      ]);
      ms = Math.round(performance.now() - t0);
    } catch { ms = 9999; }
    results.push({ m, ms, row });
  }
  results.sort((a, b) => a.ms - b.ms);
  const best = results[0];
  results.forEach((r) => {
    r.row.classList.remove("checking");
    if (r === best) r.row.classList.add("best");
    r.row.querySelector(".m-lat").textContent = r.ms >= 9999 ? "کند" : toFa(r.ms) + " ms";
    r.row.addEventListener("click", () => window.zora.openExternal(r.m.url));
  });
  setTimeout(() => { if (best) window.zora.openExternal(best.m.url); }, 2500);
}

/* ================= UPDATER ================= */
const UPD_KEY = "zora:dismissedVer";
async function checkUpdate(manual) {
  let rel = null;
  try { rel = await window.zora.checkUpdate(); } catch {}
  if (!rel) { if (manual) Birds.toast("اتصال برقرار نشد — آفلاین هستی یا اینترنت کند است."); return; }
  const newer = cmpVer(rel.version, ZORA.version) > 0;
  if (manual && !newer) { Birds.toast(`آخرین نسخه را داری (${toFa(ZORA.version)}) — آفرین! 🎉`); return; }
  if (newer && localStorage.getItem(UPD_KEY) !== rel.version) {
    $("ut-ver").textContent = `نسخه‌ی ${toFa(rel.version)} — ${rel.codeName || ""}`;
    $("update-toast").classList.remove("hidden");
  }
}
function cmpVer(a, b) {
  const p = (s) => String(s).split(".").map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 3; i++) { if ((p(a)[i] || 0) > (p(b)[i] || 0)) return 1; if ((p(a)[i] || 0) < (p(b)[i] || 0)) return -1; }
  return 0;
}

/* ================= SUBJECT → COVER MAP ================= */
function baseName(entry) {
  return String(entry).split("/").pop().replace(/\.pdf$/i, "");
}
const SUBJECTS = [
  { key: "farsi", cover: "farsi", famous: "سعدی", name: "فارسی",
    en: ["farsi", "readfarsi", "writefarsi", "negaresh", "khattahriri"], fa: ["فارسی", "بخوان", "بنویس", "نگارش", "خط"] },
  { key: "riazi", cover: "riazi", famous: "خوارزمی", name: "ریاضی",
    en: ["riazi", "lovelymath"], fa: ["ریاض"] },
  { key: "oloum", cover: "oloum", famous: "ابوعلی‌سینا", name: "علوم تجربی",
    en: ["oloom"], fa: ["علوم"] },
  { key: "motaleat", cover: "motaleat", famous: "ابوریحان بیرونی", name: "مطالعات اجتماعی",
    en: ["motaleat", "motaleaat"], fa: ["مطالعات", "اجتماعی"] },
  { key: "ghoran", cover: "ghoran", famous: "نور و تذهیب", name: "قرآن",
    en: ["quran"], fa: ["قرآن", "قران"] },
  { key: "hedyeh", cover: "hedyeh", famous: "مولانا", name: "هدیه‌های آسمان",
    en: ["hediyeh", "hediye", "payamhaye-aseman", "payam", "jahaanpiramon"], fa: ["هدیه", "پیام", "جهان پیرامون"] },
  { key: "arabi", cover: "arabi", famous: "سیبویه", name: "عربی",
    en: ["arabi"], fa: ["عربی"] },
  { key: "english", cover: "english", famous: "شکسپیر", name: "زبان انگلیسی",
    en: ["english", "workbook"], fa: ["انگلیسی"] },
  { key: "kar", cover: "kar", famous: "ادیسون", name: "کار و فناوری",
    en: ["karofanavari", "fanavari", "move-game"], fa: ["کار و فناوری", "فناوری", "حرکت"] },
  { key: "honar", cover: "honar", famous: "کمال‌الملک", name: "هنر",
    en: ["honar"], fa: ["هنر"] },
  { key: "tafakkor", cover: "tafakkor", famous: "خواجه نصیر", name: "تفکر و پژوهش",
    en: ["tafakkor", "takfakkor", "azmantakhoda"], fa: ["تفکر", "پژوهش", "مراقبتی"] },
  { key: "salamat", cover: "salamat", famous: "رازی", name: "سلامت و بهداشت",
    en: ["salamat", "behdasht"], fa: ["سلامت", "بهداشت"] },
  { key: "defa", cover: "defa", famous: "ایران‌پناهی", name: "آمادگی دفاعی",
    en: ["protectiran", "amadegi"], fa: ["دفاعی", "آمادگی"] },
];
const DISPLAY_NAMES = {
  readfarsi: "بخوانیم", writefarsi: "بنویسیم", farsi: "فارسی", negaresh: "نگارش",
  khattahriri: "خط تحریری", riazi: "ریاضی", lovelymath: "ریاضی دوست‌داشتنی",
  oloom: "علوم تجربی", motaleat: "مطالعات اجتماعی", motaleaat: "مطالعات اجتماعی",
  quran: "قرآن", hediyeh: "هدیه‌های آسمان", hediye: "هدیه‌های آسمان",
  "payamhaye-aseman": "پیام‌های آسمان", payam: "پیام‌های آسمان",
  jahaanpiramon: "جهانِ پیرامون", arabi: "عربی", english: "زبان انگلیسی",
  workbook: "کتاب کار انگلیسی", karofanavari: "کار و فناوری", fanavari: "کار و فناوری",
  "move-game": "حرکت و بازی", honar: "هنر", tafakkor: "تفکر و پژوهش",
  takfakkor: "تفکر و پژوهش", azmantakhoda: "از خودمراقبتی کن!",
  salamat: "سلامت و بهداشت", protectiran: "آمادگی دفاعی", amadegi: "آمادگی دفاعی",
};
function faNorm(s) {
  return String(s).replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\d۰-۹\s\-–_():.،]/g, "").trim();
}
function SUBJECT_META(entry) {
  const base = baseName(entry);
  const low = base.toLowerCase();
  const enKey = low.replace(/[-_]?\d+.*/, "").replace(/_.*$/, "");
  const fa = faNorm(base);
  for (const s of SUBJECTS) {
    if (s.en.some((k) => low.includes(k)) || s.fa.some((k) => fa.includes(k))) {
      return { cover: s.cover, famous: s.famous, key: s.key, name: DISPLAY_NAMES[enKey] || s.name };
    }
  }
  return { cover: "farsi", famous: "zora", key: "general", name: base };
}

/* ================= WIRING ================= */
window.addEventListener("DOMContentLoaded", async () => {
  const info = await window.zora.appInfo();
  ZORA.version = info.version;
  $("footer-ver").textContent = `zora reader v${info.version}`;
  $("pop-ver").textContent = `zora reader v${info.version} · ${info.os}`;

  ZORA.books = await window.zora.listBooks();
  await renderHome();
  showView("home");

  if (ZORA.settings.calScale && ZORA.settings.calScale !== 1) Cal.apply();
  tickClock(); setInterval(tickClock, 15000);

  // nav
  $("btn-back-home").addEventListener("click", () => showView("home"));
  $("btn-back-grade").addEventListener("click", () => { Reader.close(); openGrade(ZORA.grade); });
  $("clock").addEventListener("click", () => { $("focus-pop").classList.toggle("hidden"); $("settings-pop").classList.add("hidden"); });
  $("btn-settings").addEventListener("click", toggleSettings);
  $("open-calibration").addEventListener("click", () => { toggleSettings(); Cal.open(); });
  $("check-updates").addEventListener("click", () => { toggleSettings(); checkUpdate(true); });
  $("clear-annots").addEventListener("click", () => {
    if (confirm("همه‌ی یادداشت‌ها و هایلایت‌های همه‌ی کتاب‌ها پاک شود؟")) {
      Object.keys(localStorage).filter((k) => k.startsWith("zora:annots")).forEach((k) => localStorage.removeItem(k));
      Birds.toast("همه‌ی یادداشت‌ها پاک شد."); toggleSettings(); Reader.refreshAnnots();
    }
  });
  $("focus-start").addEventListener("click", startFocus);
  $("focus-stop").addEventListener("click", stopFocus);

  // calibration interactions
  document.querySelector(".cal-visual").addEventListener("click", (e) => Cal.clickCorner(e));
  $("cal-close").addEventListener("click", () => Cal.close());
  $("cal-reset").addEventListener("click", () => Cal.reset());
  $("cal-fine-plus").addEventListener("click", () => Cal.fine(+0.05));
  $("cal-fine-minus").addEventListener("click", () => Cal.fine(-0.05));

  // updater
  $("ut-download").addEventListener("click", () => { smartDownload(); });
  $("ut-dismiss").addEventListener("click", () => {
    $("update-toast").classList.add("hidden");
    window.zora.checkUpdate().then((r) => { if (r) localStorage.setItem(UPD_KEY, r.version); });
  });
  $("dl-close").addEventListener("click", () => $("dl-overlay").classList.add("hidden"));
  setTimeout(() => checkUpdate(false), 20000);
  setInterval(() => checkUpdate(false), 6 * 3600 * 1000);

  // click-away for popovers
  document.addEventListener("mousedown", (e) => {
    if (!$("settings-pop").contains(e.target) && e.target.id !== "btn-settings") $("settings-pop").classList.add("hidden");
    if (!$("focus-pop").contains(e.target) && !$("clock").contains(e.target)) $("focus-pop").classList.add("hidden");
  });

  // global keys
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("dl-overlay").classList.contains("hidden")) { $("dl-overlay").classList.add("hidden"); return; }
      if (!$("calibration-overlay").classList.contains("hidden")) { Cal.close(); return; }
      if (!$("search-bar").classList.contains("hidden")) { Reader.closeSearch(); return; }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f" && !$("view-reader").classList.contains("hidden")) {
      e.preventDefault(); Reader.openSearch();
    }
    if (e.key === "F11" && !$("view-reader").classList.contains("hidden")) {
      e.preventDefault();
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    }
  });
});
