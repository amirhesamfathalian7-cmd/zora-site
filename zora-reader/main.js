/* zora reader — main process (Electron 22, Win7–Win11) */
const { app, BrowserWindow, ipcMain, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const os = require("os");
const AdmZip = require("adm-zip");

const APP_VERSION = app.getVersion ? app.getVersion() : require("./package.json").version;
const OFFICIAL_SITE = "https://websitezora.dpdns.org";

app.setAppUserModelId("ir.zora.reader"); // taskbar identity + correct icon grouping

/* ---------- books location ---------- */
function booksDir() {
  if (app.isPackaged) {
    const unpacked = path.join(process.resourcesPath, "app.asar.unpacked", "books");
    if (fs.existsSync(unpacked)) return unpacked;
    return path.join(process.resourcesPath, "books");
  }
  return path.join(__dirname, "books");
}

/* zip cache (LRU, max 2 grades in RAM) */
const zipCache = new Map();
function getZip(grade) {
  if (zipCache.has(grade)) return zipCache.get(grade);
  const file = path.join(booksDir(), `grade${grade}.zip`);
  if (!fs.existsSync(file)) return null;
  let zip;
  try { zip = new AdmZip(file); } catch (e) { console.error("zip open fail", e); return null; }
  zipCache.set(grade, zip);
  if (zipCache.size > 2) zipCache.delete(zipCache.keys().next().value);
  return zip;
}

function listPdfsInZip(zip) {
  const out = [];
  for (const e of zip.getEntries()) {
    const n = e.entryName;
    if (e.isDirectory) continue;
    if (n.includes("__MACOSX") || n.split("/").pop().startsWith(".")) continue;
    if (!n.toLowerCase().endsWith(".pdf")) continue;
    out.push({ entry: n, name: n.split("/").pop().replace(/\.pdf$/i, ""), sizeMB: Math.round(e.header.size / 1048576 * 10) / 10 });
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "fa"));
  return out;
}

/* ---------- IPC ---------- */
ipcMain.handle("books:list", () => {
  const dir = booksDir();
  const out = [];
  try {
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^grade(\d+)\.zip$/i);
      if (!m) continue;
      const p = path.join(dir, f);
      out.push({ grade: parseInt(m[1], 10), file: f, sizeMB: Math.round(fs.statSync(p).size / 1048576) });
    }
  } catch (e) { console.error(e); }
  out.sort((a, b) => a.grade - b.grade);
  return out;
});

ipcMain.handle("book:pdfs", (_e, grade) => {
  const zip = getZip(grade);
  if (!zip) return [];
  return listPdfsInZip(zip);
});

ipcMain.handle("book:pdf", (_e, grade, entry) => {
  const zip = getZip(grade);
  if (!zip) throw new Error("book not found");
  const e = zip.getEntry(entry);
  if (!e) throw new Error("pdf not found: " + entry);
  const buf = e.getData();
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
});

ipcMain.handle("app:info", () => ({
  version: APP_VERSION,
  platform: process.platform,
  os: `${os.type()} ${os.arch()}`,
  booksDir: app.isPackaged ? "(داخل برنامه)" : booksDir(),
}));

ipcMain.handle("update:check", async () => {
  return new Promise((resolve) => {
    const req = https.get(`${OFFICIAL_SITE}/version.json?t=${Date.now()}`, { timeout: 12000 }, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => { try { resolve(JSON.parse(d)); } catch { resolve(null); } });
    });
    req.on("timeout", () => { req.destroy(); resolve(null); });
    req.on("error", () => resolve(null));
  });
});

ipcMain.handle("update:open", (_e, url) => { if (typeof url === "string" && /^https:\/\//.test(url)) shell.openExternal(url); });

ipcMain.handle("win:setTitle", (_e, t) => { const w = BrowserWindow.getAllWindows()[0]; if (w && typeof t === "string") w.setTitle("zora reader — " + t); });

/* ---------- window ---------- */
function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    backgroundColor: "#090A0D",
    title: "zora reader",
    icon: path.join(__dirname, "assets", "icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      spellcheck: false,
    },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "renderer", "index.html"));
  win.once("ready-to-show", () => win.show());
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const w = BrowserWindow.getAllWindows()[0];
    if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
  });
  app.whenReady().then(createWindow);
  app.on("window-all-closed", () => app.quit());
}
