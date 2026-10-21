#!/usr/bin/env python3
"""Patch out/version.json: mark downloads unavailable until exe hosting is ready."""
import json, pathlib

P = pathlib.Path('/home/z/my-project/out/version.json')
d = json.loads(P.read_text(encoding='utf-8'))

for dl in d.get('downloads', []):
    dl['available'] = False
    dl['url'] = ''

d['anyAvailable'] = False

P.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('patched:', P)
print('anyAvailable =', d['anyAvailable'])
for dl in d['downloads']:
    print(f"  - {dl['filename']}: available={dl['available']}")
