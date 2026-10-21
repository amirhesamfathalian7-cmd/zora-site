/* zora reader — birds: messenger (science notes) + varqo (page-flip, energy/food) */
"use strict";

const FACTS = {
  general: [
    "قلب نهنگ آبی آن‌قدر بزرگ است که یک انسان می‌تواند از رگ اصلی‌اش رد شود! 🐋",
    "عسل هرگز فاسد نمی‌شود — عسل‌های ۳۰۰۰ ساله‌ی مصر باستان هنوز خوراکی‌اند! 🍯",
    "سرعت نور ۳۰۰ هزار کیلومتر بر ثانیه است؛ یعنی دور زمین را در یک چشم‌به‌هم‌زدن ۷ بار می‌زند! ⚡",
    "مغز تو فقط ۲٪ وزن بدنت را دارد، ولی ۲۰٪ انرژی‌ات را مصرف می‌کند — پس خوب بخور! 🧠",
    "زنبور عسل در یک عمرش فقط یک قاشق چای‌خوری عسل تولید می‌کند! 🐝",
    "چشم جغد ثابت است و نمی‌چرخد؛ برای همین سرش را ۲۷۰ درجه می‌چرخاند! 🦉",
    "کوه دماوند آتشفشانی است و ۵۶۱۰ متر ارتفاع دارد — بلندترین قله‌ی ایران! 🏔",
    "صدا در آب ۴ برابر سریع‌تر از در هوا حرکت می‌کند! 💧",
    "خورشید آن‌قدر بزرگ است که یک میلیون زمین داخلش جا می‌شود! ☀️",
  ],
  farsi: [
    "سعدی شیرازی را «استاد سخن» می‌نامند؛ گلستان او ۷۰۰ سال است که در درس‌های فارسی می‌درخشد! 📖",
    "سعدی کتابش را «گلستان» نامید چون مثل باغی بود از گل‌های حکمت و ادب! 🌹",
    "حافظ شیرازی هنوز هر سال در شب یلدا با فال گرفتن حرف می‌زند! 🎴",
    "فردوسی ۳۰ سال از عمرش را برای شاهنامه گذاشت — منظومه‌ای با ۶۰ هزار بیت! ✍️",
  ],
  riazi: [
    "خوارزمی، ریاضی‌دان ایرانی، پدر «جبر» است؛ کلمه‌ی Algorithm هم از نام او آمده! ➗",
    "فیثاغورس ۲۵۰۰ سال پیش رابطه‌ی ضلع‌های مثلث قائم‌الزاویه را کشف کرد! 📐",
    "عدد صفر را ریاضی‌دانان هندی و ایرانی به دنیا معرفی کردند — بدون صفر، حساب نداشتیم! ۰️⃣",
    "دنباله‌ی فیبوناچی در گل آفتابگردان، صدف حلزون و کهکشان‌ها پیدا می‌شود! 🌻",
  ],
  oloum: [
    "ابوعلی سینا کتاب «قانون در طب» را نوشت که ۶۰۰ سال در دانشگاه‌های اروپا تدریس می‌شد! ⚕️",
    "بدن تو هر روز حدود ۳۰۰ میلیارد سلول می‌سازد — تو یک کارخانه‌ی زنده‌ای! 🧬",
    "رعد و برق ۵ برابر داغ‌تر از سطح خورشید است! 🌩",
    "دلفین‌ها با نام صوتی خودشان یکدیگر را صدا می‌زنند! 🐬",
  ],
  motaleat: [
    "ابوریحان بیرونی ۱۰۰۰ سال پیش شعاع زمین را با خطای فقط ۱۷ کیلومتر اندازه گرفت! 🌍",
    "ایران ۳۱ استان و بیش از ۱۳۳۰ شهر دارد! 🗺",
    "کویر لوت یکی از داغ‌ترین نقاط کره‌ی زمین است؛ دما تا ۷۰ درجه بالا رفته! 🔥",
  ],
  ghoran: [
    "خطوط زیبای نستعلیق را ایرانیان ابداع کردند و به آن «عروس خطوط» می‌گویند! 🖋",
    "تذهیب، هنر تزئین با طلا و رنگ در حاشیه‌ی کتاب‌های خطی است! ✨",
    "نسخه‌های خطی کهن با مرکب انار و زاج نوشته می‌شدند و قرن‌ها ماندگارند! 📜",
  ],
  hedyeh: [
    "مولانا ۸۰۰ سال پیش می‌گفت مهربانی از هزار حرف روشن‌تر است! 💫",
    "غزل‌های مولانا را در دیوان شمس پیدا می‌کنی — پر از عشق و پرواز! 🕊",
    "«شب یلدا» بلندترین شب سال است و ایرانیان هزاران سال است کنار هم جشن می‌گیرند! 🍉",
  ],
  arabi: [
    "سیبویه، ایرانیِ شوشتر، نخستین دستور کامل زبان عربی را نوشت — «الکتاب»! 📚",
    "بیش از هزاران واژه‌ی عربی وارد فارسی شده‌اند و برعکس! زبان‌ها با هم دوست‌اند! 🤝",
    "علائم اعراب‌گذاری را برای درست‌خواندن متن‌ها ابداع کردند! ُ",
  ],
  english: [
    "شکسپیر بیش از ۱۷۰۰ واژه‌ی نو به زبان انگلیسی افزود! ✒️",
    "«Goodbye» کوتاه‌شده‌ی «God be with ye» است — یعنی خدا با تو باشد! 👋",
    "زبان انگلیسی رسمی ۶۷ کشور جهان است! 🌐",
  ],
  kar: [
    "ادیسون بیش از ۱۰۰۰ اختراع ثبت کرد و می‌گفت: «من شکست نخوردم، هزار راهِ ناموفق پیدا کردم!» 💡",
    "لامپ اول ادیسون ۱۳ ساعت روشن ماند — آزمایش‌های قبلی‌اش صدها بار خاموش شده بودند! 🔦",
    "روبات‌های مدرن از ترکیب مکانیک و برنامه‌ریزی ساخته می‌شوند — تو هم می‌توانی بسازی! 🤖",
  ],
  honar: [
    "کمال‌الملک تابلوی «تالار آینه» را طوری کشید که انگار آینه درون نقاشی می‌درخشد! 🖼",
    "رنگ آبی لاجورد نقاشی‌های ایرانی از سنگ لاجورد بدخشان می‌آمد — با هزینه‌ی طلا! 💙",
    "کاشی‌کاری‌های اصفهان با هندسه‌ی دقیق ریاضی طرح می‌شوند! 🕌",
  ],
  tafakkor: [
    "خواجه نصیرالدین طوسی رصدخانه‌ی مراغه را ساخت؛ آن زمان پیشرفته‌ترین مرکز نجوم دنیا بود! 🔭",
    "مغز تو هنگام فکر کردن، جریان الکتریکی ۱۰ واتی تولید می‌کند — مثل یک لامپ کم‌مصرف! ⚡",
    "پرسیدن «چرا؟» قوی‌ترین ابزار دانش است — همه‌ی دانشمندان با آن شروع کردند! ❓",
  ],
  salamat: [
    "رازی الکل را کشف کرد و بیماری‌های آبله و سرخک را از هم تشخیص داد! 🧪",
    "خنده ۲۰٪ اکسیژن بیشتری به بدن می‌رساند — پس بخند! 😄",
    "هشت لیوان آب در روز به مغز و بدن تو جان می‌دهد! 💦",
  ],
  defa: [
    "ایران ۱۵ همسایه‌ی خشکی و دریایی دارد — یکی از حساس‌ترین جایگاه‌های جغرافیایی جهان! 🇮🇷",
    "آرامش و همکاری، دو ستون اصلی آمادگی و توانمندی هر جامعه است! 🤝",
    "زاگرس و البرز مثل دو دژ طبیعی، دشت‌های ایران را در آغوش گرفته‌اند! ⛰",
  ],
};

/* ================= MESSENGER BIRD ================= */
const Birds = {
  msTimer: null,
  toast(msg) {
    $("ms-title").textContent = "پیام zora";
    $("ms-text").textContent = msg;
    const m = $("messenger");
    m.classList.remove("hidden");
    requestAnimationFrame(() => m.classList.add("show"));
    clearTimeout(this._t);
    this._t = setTimeout(() => m.classList.remove("show"), 4200);
  },
  flyFact(subjectKey) {
    const base = (subjectKey && FACTS[subjectKey] && FACTS[subjectKey].length ? FACTS[subjectKey] : FACTS.general);
    const pool = base.concat(FACTS.general);
    const fact = pool[Math.floor(Math.random() * pool.length)];
    const titles = { farsi: "ادبیات با سعدی", riazi: "ریاضی با خوارزمی", oloum: "علوم با ابوعلی‌سینا", motaleat: "با بیرونی", ghoran: "هنر کتاب", hedyeh: "با مولانا", arabi: "عربی با سیبویه", english: "English با شکسپیر", kar: "فناوری با ادیسون", honar: "هنر با کمال‌الملک", tafakkor: "اندیشه با خواجه نصیر", salamat: "سلامت با رازی", defa: "ایران‌شناسی" };
    $("ms-title").textContent = `نکته‌ی علمی — ${titles[subjectKey] || "با پرنده‌ی zora"}`;
    $("ms-text").textContent = fact;
    const m = $("messenger");
    m.classList.remove("hidden");
    requestAnimationFrame(() => m.classList.add("show"));
    clearTimeout(this._t);
    this._t = setTimeout(() => m.classList.remove("show"), 9000);
  },
  startMessenger() {
    clearTimeout(this.msTimer);
    const loop = () => {
      const key = (Reader.current && Reader.current.subjectKey) || null;
      this.flyFact(key);
      this.msTimer = setTimeout(loop, 100000 + Math.random() * 70000);
    };
    this.msTimer = setTimeout(loop, 45000);
  },
};

/* ================= VARQO (page-flip bird) ================= */
const Varqo = {
  KEY: "zora:varqo",
  get energy() { return JSON.parse(localStorage.getItem(this.KEY) || '{"energy":100}')["energy"]; },
  set energy(v) { localStorage.setItem(this.KEY, JSON.stringify({ energy: Math.max(0, Math.min(100, v)) })); },
  init() {
    this.render();
    $("varqo-feed").addEventListener("click", () => this.feed());
    $("varqo-bird").addEventListener("click", () => this.cheer("چیه؟ بغذا بده تا با انرژی ورق بزنم! 🌾"));
  },
  render() {
    const e = this.energy;
    $("varqo-bar").style.width = e + "%";
    $("varqo-val").textContent = toFa(Math.round(e));
    $("varqo-bird").classList.toggle("tired", e < 30);
  },
  onPageTurn() {
    this.energy = this.energy - 7;
    this.render();
    if (this.energy < 30) this.cheer("خسته شدم… کمی دانه بده! 🥱");
    else if (Math.random() < 0.45) this.cheer(["ایول! 🎉", "ادامه بده! 💪", "چه صفحه‌ای! ✨", "عالی بودی! 👏"][Math.floor(Math.random() * 4)]);
  },
  feed() {
    const btn = $("varqo-feed");
    if (btn.disabled) return;
    if (this.energy >= 99) { this.cheer("سیرم! برو صفحه ورق بزن 😄"); return; }
    this.energy = this.energy + 16;
    this.render();
    this.cheer(["به‌به! 🌾", "قوت قلب! 💪", "نوچه شدم! ⚡"][Math.floor(Math.random() * 3)]);
    btn.disabled = true;
    setTimeout(() => (btn.disabled = false), 15000);
  },
  cheer(text) {
    const b = $("varqo-bird");
    b.classList.remove("happy"); void b.offsetWidth; b.classList.add("happy");
    if (text) Birds.toast(text);
    for (let i = 0; i < 3; i++) {
      const h = el("span", "heart-float", ["💛","🧡","💜"][i]);
      h.style.right = `${20 + Math.random() * 20}px`;
      h.style.bottom = `${80 + Math.random() * 20}px`;
      h.style.animationDelay = `${i * 0.15}s`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1400);
    }
  },
};

window.addEventListener("DOMContentLoaded", () => {
  Varqo.init();
  Birds.startMessenger();
  $("ms-close").addEventListener("click", () => $("messenger").classList.remove("show"));
  document.querySelector(".ms-bird").addEventListener("click", () => {
    const key = (Reader.current && Reader.current.subjectKey) || null;
    Birds.flyFact(key);
  });
});
