#!/bin/bash
# electron-builder patches for building Windows NSIS on this sandbox (no wine possible).
# Run AFTER `npm install` and BEFORE `npm run dist`.
# Patches (app-builder-lib/out/targets/nsis/NsisTarget.js):
#   1) UninstallerReader path forced (skip wine installer-run; native NSIS data extraction)
#   2) Portable target never uses SetCompress off (this FS cannot mmap big files -> SIGBUS)
#   3) Debug dumps removed (keep clean)
set -e
cd "$(dirname "$0")/.."
F=node_modules/app-builder-lib/out/targets/nsis/NsisTarget.js

python3 - "$F" <<'EOF'
import sys
p = sys.argv[1]
s = open(p).read()
if "PATCHED" in s:
    print("already patched"); raise SystemExit
old1 = "if ((0, macosVersion_1.isMacOsCatalina)()) {"
new1 = "if (true) { /* PATCHED-1: wine-free uninstaller extraction */"
assert old1 in s, "pattern1 missing"
s = s.replace(old1, new1, 1)
old2 = 'if (packager.compression === "store") {\n            commands.SetCompress = "off";'
new2 = 'if (packager.compression === "store" && !this.isPortable) { /* PATCHED-2: portable must stream zlib (no mmap) */'
assert old2 in s, "pattern2 missing"
s = s.replace(old2, new2, 1)
open(p, "w").write(s)
print("NsisTarget.js patched (2 patches) OK")
EOF
echo "done — now: CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --win nsis / --win portable"
