/* zora reader — preload bridge */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("zora", {
  listBooks: () => ipcRenderer.invoke("books:list"),
  listPdfs: (grade) => ipcRenderer.invoke("book:pdfs", grade),
  readPdf: (grade, entry) => ipcRenderer.invoke("book:pdf", grade, entry),
  appInfo: () => ipcRenderer.invoke("app:info"),
  checkUpdate: () => ipcRenderer.invoke("update:check"),
  openExternal: (url) => ipcRenderer.invoke("update:open", url),
  setTitle: (t) => ipcRenderer.invoke("win:setTitle", t),
});
