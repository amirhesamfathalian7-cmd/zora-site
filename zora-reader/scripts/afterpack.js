/* electron-builder afterPack hook — embed icon+version into the app exe (no wine) */
const path = require("path");
const { patchExe } = require("./patch-pe");

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "win32") return;
  const exePath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.exe`);
  patchExe(exePath, { version: context.packager.appInfo.version });
};
