/* Patch Windows PE resources (icon + version info) in pure JS — no wine needed.
 * Used by electron-builder hooks: afterPack (app exe) + afterAllArtifactBuild (portable). */
const fs = require("fs");
const path = require("path");
const { NtExecutable, NtExecutableResource, Resource, Data } = require("resedit");

const ICON = path.join(__dirname, "..", "assets", "icon.ico");

function patchExe(exePath, { productName = "ZORA Reader", fileDescription = "zora reader — کتاب‌خوان هوشمند مدارس ایران", company = "zora team — ZAK & AXORA", version = "2.4.0" } = {}) {
  if (!fs.existsSync(exePath)) { console.warn("patchExe: not found", exePath); return false; }
  const iconBuf = fs.readFileSync(ICON);
  const exe = NtExecutable.from(fs.readFileSync(exePath));
  const res = NtExecutableResource.from(exe);

  // replace icon group id=1 (the resource id electron.exe uses)
  const iconFile = Data.IconFile.from(iconBuf);
  Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    1033,
    iconFile.icons.map((i) => i.data)
  );

  // version info block (RT_VERSION = 16)
  const RT_VERSION = 16;
  let vi;
  try {
    const viEntries = res.entries.filter((e) => e.type === RT_VERSION);
    vi = Resource.VersionInfo.fromEntries(viEntries)[0] || Resource.VersionInfo.createEmpty();
  } catch {
    vi = Resource.VersionInfo.createEmpty();
  }
  if (vi) {
    const [maj, min, patch] = version.split(".").map((x) => parseInt(x, 10) || 0);
    vi.setProductVersion(maj, min, patch, 0);
    vi.setFileVersion(maj, min, patch, 0);
    vi.setStringValues({
      ProductName: productName,
      FileDescription: fileDescription,
      CompanyName: company,
      LegalCopyright: `Copyright © 2026 ${company}`,
      ProductVersion: version,
      FileVersion: version,
      OriginalFilename: path.basename(exePath),
    });
    res.entries = res.entries.filter((e) => e.type !== RT_VERSION);
    vi.outputToResourceEntries(res.entries);
  }

  res.outputResource(exe);
  fs.writeFileSync(exePath, Buffer.from(exe.generate()));
  console.log("PE patched:", exePath, `(${(fs.statSync(exePath).size / 1048576).toFixed(1)} MB)`);
  return true;
}

module.exports = { patchExe };

/* CLI: node patch-pe.js <exePath> [productName] [version] */
if (require.main === module) {
  const [, , target, name, ver] = process.argv;
  patchExe(target, name ? { productName: name, version: ver || "2.4.0" } : {});
}
