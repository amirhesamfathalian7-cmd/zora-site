/* zora reader — PDF engine: render, zoom, annotations, search, thumbs, bookmarks */
"use strict";

pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";

const Reader = {
  doc: null, current: null, slots: [], scale: 1.0,
  tool: "select", color: "#A99BFF", size: 4,
  searchMatches: [], searchIdx: -1,
  _searchToken: 0, _cur: 0,

  COLORS: ["#A99BFF","#88B9F8","#78C9A5","#E8B86D","#F08080","#E89BD6","#F2F3F5","#20232A","#FF9D5C","#6FC7D6"],
  SIZES: [2, 4, 8, 14],

  async open(grade, meta) {
    const sm = SUBJECT_META(meta.entry || meta.name);
    this.current = {
      grade, entry: meta.entry, name: meta.name,
      subjectKey: sm.key || "general",
    };
    $("reader-title").textContent = sm.name || meta.name;
    window.zora.setTitle(sm.name || meta.name);
    showView("reader");
    $("reader-loading").classList.remove("hidden");
    $("reader-error").classList.add("hidden");
    $("thumbs-list").innerHTML = "";
    try {
      const data = await window.zora.readPdf(grade, meta.entry);
      if (this.doc) { try { this.doc.destroy(); } catch {} }
      this.doc = await pdfjsLib.getDocument({ data }).promise;
      this.scale = this._fitScale();
      this._build();
      Varqo.onPageTurn();
    } catch (err) {
      console.error(err);
      $("reader-loading").classList.add("hidden");
      const e = $("reader-error");
      e.classList.remove("hidden");
      e.innerHTML = `<p>این کتاب باز نشد 😕</p><p style="color:var(--text2);font-size:12.5px">${String(err && err.message || err)}</p>`;
    }
  },

  close() {
    if (this.doc) { try { this.doc.destroy(); } catch {} this.doc = null; }
    $("pdf-stage").querySelectorAll(".pslot").forEach((s) => s.remove());
    this.slots = []; this.searchMatches = []; this.searchIdx = -1; this._cur = 0;
  },

  /* ---------- build page slots ---------- */
  _fitScale() {
    const w = $("pdf-scroll").clientWidth - 64;
    return Math.min(1.6, Math.max(0.4, w / 620));
  },
  _build() {
    const stage = $("pdf-stage");
    stage.querySelectorAll(".pslot").forEach((s) => s.remove());
    $("pdf-canvas-wrap").style.display = "none";
    $("reader-loading").classList.add("hidden");
    $("page-total").textContent = toFa(this.doc.numPages);
    this.slots = [];
    for (let p = 1; p <= this.doc.numPages; p++) this._slot(p);
    this._observe();
    setTimeout(() => this.slots[0] && this.slots[0].root.scrollIntoView({ block: "start" }), 40);
  },
  _slot(p) {
    const root = el("div", "pslot");
    root.style.cssText = "position:relative;margin:0 auto 22px;box-shadow:0 10px 50px rgba(0,0,0,.5);border-radius:3px;overflow:hidden;background:#fff";
    const pdf = el("canvas"); pdf.style.display = "block";
    const anno = el("canvas"); anno.style.cssText = "position:absolute;inset:0;cursor:crosshair";
    const text = el("div", "text-layer"); text.style.opacity = "0.35";
    const search = el("div", "search-layer");
    const num = el("span", null, toFa(p));
    num.style.cssText = "position:absolute;bottom:6px;right:10px;background:rgba(9,10,13,.65);color:#C8CDD6;font-size:10px;border-radius:5px;padding:0 7px;font-variant-numeric:tabular-nums";
    root.append(pdf, anno, text, search, num);
    $("pdf-stage").appendChild(root);
    const slot = { p, root, pdf, anno, text, search, rendered: false, renderTask: null, textRendered: false };
    root.addEventListener("pointerdown", (e) => this._pointerDown(e, slot));
    this.slots.push(slot);
    return slot;
  },
  _observe() {
    if (this._io) this._io.disconnect();
    this._io = new IntersectionObserver((ents) => {
      let cur = null;
      for (const en of ents) {
        const slot = this.slots.find((s) => s.root === en.target);
        if (!slot) continue;
        if (en.isIntersecting) { this._renderSlot(slot); cur = slot; }
      }
      if (cur) { $("page-cur").textContent = toFa(cur.p); this._cur = cur.p; }
    }, { root: $("pdf-scroll"), rootMargin: "600px 0px" });
    this.slots.forEach((s) => this._io.observe(s.root));
  },

  /* ---------- rendering ---------- */
  async _renderSlot(slot) {
    if (slot.rendered || !this.doc) return;
    slot.rendered = true;
    try {
      const page = await this.doc.getPage(slot.p);
      const vp = page.getViewport({ scale: this.scale });
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (slot.renderTask) { try { slot.renderTask.cancel(); } catch {} }
      slot.pdf.width = Math.round(vp.width * dpr);
      slot.pdf.height = Math.round(vp.height * dpr);
      slot.pdf.style.width = Math.round(vp.width) + "px";
      slot.pdf.style.height = Math.round(vp.height) + "px";
      slot.root.style.width = Math.round(vp.width) + "px";
      slot.root.style.height = Math.round(vp.height) + "px";
      slot.anno.width = Math.round(vp.width); slot.anno.height = Math.round(vp.height);
      slot.anno.style.width = Math.round(vp.width) + "px";
      slot.anno.style.height = Math.round(vp.height) + "px";
      const ctx = slot.pdf.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      slot.renderTask = page.render({ canvasContext: ctx, viewport: vp });
      await slot.renderTask.promise;
      if (!slot.textRendered) {
        slot.textRendered = true;
        slot.text.style.setProperty("--scale-factor", this.scale);
        const tc = await page.getTextContent();
        slot.text.innerHTML = "";
        const tl = new pdfjsLib.TextLayer({ textContentSource: tc, container: slot.text, viewport: vp });
        await tl.render();
      }
      this.redrawAnnots(slot);
      this._applySearchTo(slot);
    } catch (e) {
      if (String(e && e.name) !== "RenderingCancelledException") { slot.rendered = false; console.error(e); }
    }
  },
  _renderVisible() {
    const sc = $("pdf-scroll").getBoundingClientRect();
    for (const s of this.slots) {
      const r = s.root.getBoundingClientRect();
      if (r.bottom > sc.top - 700 && r.top < sc.bottom + 700) this._renderSlot(s);
    }
  },

  /* ---------- annotations ---------- */
  _annotsKey() { return "zora:annots:" + this.current.grade + "/" + this.current.entry; },
  _annots() { return JSON.parse(localStorage.getItem(this._annotsKey()) || "{}"); },
  _saveAnnots(a) {
    try { localStorage.setItem(this._annotsKey(), JSON.stringify(a)); } catch {}
  },
  refreshAnnots() { if (this.doc) this.slots.forEach((s) => this.redrawAnnots(s)); },
  redrawAnnots(slot) {
    const ctx = slot.anno.getContext("2d");
    ctx.clearRect(0, 0, slot.anno.width, slot.anno.height);
    const a = this._annots()[slot.p] || [];
    const k = this.scale;
    for (const st of a) this._drawStroke(ctx, st, k, slot);
  },
  _drawStroke(ctx, st, k, slot) {
    if (!st.points.length) return;
    ctx.save();
    ctx.globalAlpha = st.tool === "marker" ? 0.34 : 1;
    ctx.strokeStyle = st.color; ctx.fillStyle = st.color;
    ctx.lineWidth = Math.max(1, (st.tool === "marker" ? st.size * 3.2 : st.size) * k);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(st.points[0][0] * slot.anno.width, st.points[0][1] * slot.anno.height);
    for (const [x, y] of st.points.slice(1)) ctx.lineTo(x * slot.anno.width, y * slot.anno.height);
    ctx.stroke();
    ctx.restore();
  },
  _pointerDown(e, slot) {
    if (this.tool === "select") return;
    e.preventDefault();
    const rect = slot.anno.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width, ny = (e.clientY - rect.top) / rect.height;
    if (this.tool === "eraser") {
      const thr = 0.012 + this.size * 0.001;
      const wipe = (ev) => {
        const r = slot.anno.getBoundingClientRect();
        const x2 = (ev.clientX - r.left) / r.width, y2 = (ev.clientY - r.top) / r.height;
        const a = this._annots();
        const before = (a[slot.p] || []).length;
        a[slot.p] = (a[slot.p] || []).filter((st) => !st.points.some(([px, py]) => Math.hypot(px - x2, py - y2) < thr));
        if ((a[slot.p] || []).length !== before) this._saveAnnots(a);
        this.redrawAnnots(slot);
      };
      wipe(e);
      const up = () => { window.removeEventListener("pointermove", wipe); window.removeEventListener("pointerup", up); };
      window.addEventListener("pointermove", wipe); window.addEventListener("pointerup", up);
      return;
    }
    const stroke = { tool: this.tool, color: this.color, size: this.size, points: [[nx, ny]] };
    const mv = (ev) => {
      const r = slot.anno.getBoundingClientRect();
      stroke.points.push([(ev.clientX - r.left) / r.width, (ev.clientY - r.top) / r.height]);
      const ctx = slot.anno.getContext("2d");
      ctx.clearRect(0, 0, slot.anno.width, slot.anno.height);
      const a = this._annots()[slot.p] || []; const k = this.scale;
      for (const st of a) this._drawStroke(ctx, st, k, slot);
      this._drawStroke(ctx, stroke, k, slot);
    };
    const up = () => {
      window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up);
      if (stroke.points.length > 1) {
        const a = this._annots(); (a[slot.p] = a[slot.p] || []).push(stroke);
        this._saveAnnots(a);
      }
      this.redrawAnnots(slot);
    };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  },

  /* ---------- zoom ---------- */
  zoomBy(f) { this.scale = Math.min(3, Math.max(0.35, this.scale * f)); this._layoutAll(); },
  fitWidth() {
    const w = $("pdf-scroll").clientWidth - 56;
    this.scale = Math.max(0.35, Math.min(3, w / 595));
    this._layoutAll();
  },
  _layoutAll() {
    $("zoom-label").textContent = Math.round(this.scale * 100) + "%";
    this._renderVisible();
  },

  /* ---------- thumbs / bookmarks ---------- */
  async toggleThumbs() {
    const p = $("thumbs-panel");
    p.classList.toggle("hidden");
    if (!p.classList.contains("hidden")) this._buildThumbs();
  },
  async _buildThumbs() {
    const list = $("thumbs-list"); list.innerHTML = "";
    if (!this.doc) return;
    const page1 = await this.doc.getPage(1);
    const v1 = page1.getViewport({ scale: 1 });
    const ratio = v1.width / v1.height;
    const marks = JSON.parse(localStorage.getItem("zora:marks:" + this.current.grade + "/" + this.current.entry) || "[]");
    for (let p = 1; p <= this.doc.numPages; p++) {
      const t = el("div", "thumb" + (this._cur === p ? " cur" : ""));
      t.innerHTML = `<canvas></canvas><span class="t-num tabular">${toFa(p)}</span>${marks.includes(p) ? '<span class="t-mark">★</span>' : ""}`;
      t.addEventListener("click", () => { this._goto(p); });
      list.appendChild(t);
      const cvs = t.querySelector("canvas");
      const W = 150, H = Math.round(W / ratio);
      cvs.width = W; cvs.height = H;
      this._thumbQueue.push({ p, cvs, W });
    }
    this._thumbPump();
  },
  _thumbQueue: [],
  async _thumbPump() {
    while (this._thumbQueue.length) {
      const job = this._thumbQueue.shift();
      if (!this.doc || !document.body.contains(job.cvs)) continue;
      try {
        const page = await this.doc.getPage(job.p);
        const v1 = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: job.W / v1.width });
        const ctx = job.cvs.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, job.cvs.width, job.cvs.height);
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
      } catch {}
    }
  },
  async renderMarks() {
    const list = $("marks-list"); list.innerHTML = "";
    const marks = JSON.parse(localStorage.getItem("zora:marks:" + this.current.grade + "/" + this.current.entry) || "[]");
    if (!marks.length) { list.appendChild(el("p", "grade-hint", "هنوز صفحه‌ای نشان نکرده‌ای — با دکمه‌ی ★ صفحه‌ی فعلی را نشان کن.")); return; }
    for (const p of marks.sort((a, b) => a - b)) {
      const it = el("div", "mark-item", `<span>صفحه‌ی ${toFa(p)}</span><span style="color:var(--warn)">★</span>`);
      it.addEventListener("click", () => { this._goto(p); });
      list.appendChild(it);
    }
  },
  toggleBookmark() {
    if (!this.doc || !this._cur) return;
    const key = "zora:marks:" + this.current.grade + "/" + this.current.entry;
    const marks = JSON.parse(localStorage.getItem(key) || "[]");
    const i = marks.indexOf(this._cur);
    if (i >= 0) { marks.splice(i, 1); Birds.toast(`نشان صفحه‌ی ${toFa(this._cur)} برداشته شد.`); }
    else { marks.push(this._cur); Birds.toast(`صفحه‌ی ${toFa(this._cur)} نشان شد ★`); }
    localStorage.setItem(key, JSON.stringify(marks));
    $("btn-bookmark").classList.toggle("active", i < 0);
  },
  _goto(p) {
    const s = this.slots[p - 1];
    if (s) s.root.scrollIntoView({ block: "start", behavior: "smooth" });
    $("page-cur").textContent = toFa(p); this._cur = p;
    this._renderSlot(s);
  },

  /* ---------- search ---------- */
  openSearch() {
    $("search-bar").classList.remove("hidden");
    $("search-input").focus(); $("search-input").select();
  },
  closeSearch() {
    $("search-bar").classList.add("hidden");
    this.searchMatches = []; this.searchIdx = -1;
    this.slots.forEach((s) => (s.search.innerHTML = ""));
  },
  _norm(s) { return String(s).replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\u200c/g, " ").toLowerCase(); },
  async runSearch(q) {
    if (!this.doc || !q || q.trim().length < 2) { this.searchMatches = []; this._searchInfo(); return; }
    const token = ++this._searchToken;
    const nq = this._norm(q.trim());
    const matches = [];
    for (let p = 1; p <= this.doc.numPages && token === this._searchToken; p++) {
      const page = await this.doc.getPage(p);
      const vp = page.getViewport({ scale: 1 });
      const tc = await page.getTextContent();
      for (const item of tc.items) {
        const hay = this._norm(item.str);
        if (hay.indexOf(nq) >= 0) {
          const tx = pdfjsLib.Util.transform(vp.transform, item.transform);
          const h = Math.hypot(tx[2], tx[3]);
          matches.push({ p, x: tx[4], y: vp.height - tx[5] - h, w: item.width, h: h * 1.15 });
        }
      }
      if (matches.length > 400) break;
    }
    if (token !== this._searchToken) return;
    this.searchMatches = matches;
    this.searchIdx = matches.length ? 0 : -1;
    this.slots.forEach((s) => this._applySearchTo(s));
    this._searchInfo();
    if (matches.length) this._goto(matches[0].p);
  },
  _applySearchTo(slot) {
    slot.search.innerHTML = "";
    if (!this.searchMatches.length) return;
    for (let i = 0; i < this.searchMatches.length; i++) {
      const m = this.searchMatches[i];
      if (m.p !== slot.p) continue;
      const hit = el("i");
      hit.style.left = (m.x * this.scale) + "px";
      hit.style.top = (m.y * this.scale) + "px";
      hit.style.width = (m.w * this.scale) + "px";
      hit.style.height = (m.h * this.scale) + "px";
      if (i === this.searchIdx) hit.classList.add("cur");
      slot.search.appendChild(hit);
    }
  },
  _searchInfo() {
    $("search-count").textContent = this.searchMatches.length
      ? `${toFa(this.searchIdx + 1)} از ${toFa(this.searchMatches.length)}`
      : "۰ از ۰";
  },
  searchStep(d) {
    if (!this.searchMatches.length) return;
    this.searchIdx = (this.searchIdx + d + this.searchMatches.length) % this.searchMatches.length;
    const m = this.searchMatches[this.searchIdx];
    this.slots.forEach((s) => this._applySearchTo(s));
    this._goto(m.p);
    this._searchInfo();
  },

  /* ---------- wiring ---------- */
  init() {
    const setTool = (t) => {
      this.tool = t;
      for (const id of ["select", "pen", "marker", "eraser"]) $("tool-" + id).classList.toggle("active", t === id);
    };
    $("tool-select").addEventListener("click", () => setTool("select"));
    $("tool-pen").addEventListener("click", () => setTool("pen"));
    $("tool-marker").addEventListener("click", () => setTool("marker"));
    $("tool-eraser").addEventListener("click", () => setTool("eraser"));
    setTool("select");

    const pal = $("color-palette");
    this.COLORS.forEach((c, i) => {
      const s = el("button", "swatch" + (i === 0 ? " active" : ""));
      s.style.background = c; s.title = "رنگ";
      s.addEventListener("click", () => {
        this.color = c;
        pal.querySelectorAll(".swatch").forEach((x) => x.classList.remove("active"));
        s.classList.add("active");
      });
      pal.appendChild(s);
    });
    const szs = $("size-picker");
    this.SIZES.forEach((sz, i) => {
      const b = el("button", "size-dot" + (i === 1 ? " active" : ""));
      const d = el("i"); const px = 3 + i * 3;
      d.style.width = px + "px"; d.style.height = px + "px";
      b.appendChild(d); b.title = "ضخامت " + toFa(sz);
      b.addEventListener("click", () => {
        this.size = sz;
        szs.querySelectorAll(".size-dot").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
      });
      szs.appendChild(b);
    });

    $("btn-zoom-in").addEventListener("click", () => this.zoomBy(1.15));
    $("btn-zoom-out").addEventListener("click", () => this.zoomBy(1 / 1.15));
    $("btn-fit").addEventListener("click", () => this.fitWidth());
    $("btn-page-prev").addEventListener("click", () => this._goto(Math.max(1, (this._cur || 1) - 1)));
    $("btn-page-next").addEventListener("click", () => this._goto(Math.min(this.doc.numPages, (this._cur || 1) + 1)));
    $("btn-thumbs").addEventListener("click", () => this.toggleThumbs());
    $("btn-bookmark").addEventListener("click", () => { this.toggleBookmark(); this.renderMarks(); });
    $("btn-fullscreen").addEventListener("click", () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    });
    $("tab-thumbs").addEventListener("click", () => {
      $("tab-thumbs").classList.add("active"); $("tab-marks").classList.remove("active");
      $("thumbs-list").classList.remove("hidden"); $("marks-list").classList.add("hidden");
    });
    $("tab-marks").addEventListener("click", () => {
      $("tab-marks").classList.add("active"); $("tab-thumbs").classList.remove("active");
      $("marks-list").classList.remove("hidden"); $("thumbs-list").classList.add("hidden");
      this.renderMarks();
    });

    $("btn-search").addEventListener("click", () => this.openSearch());
    $("search-close").addEventListener("click", () => this.closeSearch());
    $("search-next").addEventListener("click", () => this.searchStep(1));
    $("search-prev").addEventListener("click", () => this.searchStep(-1));
    let deb = null;
    $("search-input").addEventListener("input", (e) => {
      clearTimeout(deb);
      deb = setTimeout(() => this.runSearch(e.target.value), 350);
    });

    document.addEventListener("keydown", (e) => {
      if ($("view-reader").classList.contains("hidden")) return;
      if (e.target.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") this._goto(Math.min(this.doc ? this.doc.numPages : 1, (this._cur || 1) + 1));
      else if (e.key === "ArrowRight") this._goto(Math.max(1, (this._cur || 1) - 1));
      else if (e.key === "+" || e.key === "=") this.zoomBy(1.15);
      else if (e.key === "-") this.zoomBy(1 / 1.15);
      else if (e.key.toLowerCase() === "p") setTool("pen");
      else if (e.key.toLowerCase() === "h") setTool("marker");
      else if (e.key.toLowerCase() === "e") setTool("eraser");
      else if (e.key.toLowerCase() === "s") setTool("select");
      else if (e.key.toLowerCase() === "f") this.fitWidth();
    });

    let lastPage = 0;
    $("pdf-scroll").addEventListener("scroll", () => {
      clearTimeout(this._st);
      this._st = setTimeout(() => this._renderVisible(), 120);
      const cur = this._cur || 0;
      if (lastPage && cur !== lastPage) Varqo.onPageTurn();
      lastPage = cur;
    }, { passive: true });
  },
};

window.addEventListener("DOMContentLoaded", () => Reader.init());
