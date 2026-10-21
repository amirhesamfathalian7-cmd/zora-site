#!/bin/bash
# Cover generation v2 — SHORT prompts (long prompts get ignored by the API)
OUT="/home/z/my-project/zora-reader/renderer/covers"
mkdir -p "$OUT"

declare -A JOBS
JOBS[farsi]="Classical oil painting portrait of Saadi, the medieval Persian poet: elderly wise man with white beard, green turban, beige robe, rose garden background, dark graphite backdrop, warm candlelight, painterly brushwork, no text"
JOBS[riazi]="Classical oil painting portrait of Al-Khwarizmi, Persian mathematician: black beard, deep blue robe, white turban, brass astrolabe and geometric diagrams behind him, dark graphite backdrop, painterly, no text"
JOBS[oloum]="Classical oil painting portrait of Avicenna Ibn Sina, Persian physician: dark beard, crimson robe, white turban, dried herbs and old medical manuscripts behind him, dark graphite backdrop, painterly, no text"
JOBS[motaleat]="Classical oil painting portrait of Al-Biruni, Persian geographer scholar: grey beard, ochre robe, antique brass globe and rolled maps behind him, dark graphite backdrop, painterly, no text"
JOBS[ghoran]="Open antique illuminated book with golden ornamental pages on a carved wooden bookstand, hanging lantern glowing warmly, Islamic geometric patterns, classical oil painting, dark graphite background, no text"
JOBS[hedyeh]="Classical oil painting portrait of Rumi, Persian mystic poet: long white beard, honey-brown robe, tall felt cap, soft ethereal golden light, dark graphite backdrop, painterly, no text"
JOBS[arabi]="Classical oil painting portrait of a medieval scholar of languages: dark beard, teal robe, rolled parchment scrolls and a brass inkwell behind him, old library shelves, dark graphite backdrop, painterly, no text"
JOBS[english]="Classical oil painting portrait of William Shakespeare: receding hairline, moustache, Elizabethan ruff collar, holding a white quill, timber Globe Theatre behind him, dark tones, painterly, no text"
JOBS[kar]="Classical oil painting portrait of Thomas Edison, the inventor: neatly combed hair, dark Victorian waistcoat, glowing vintage light bulb and workshop tools behind him, dark graphite backdrop, painterly, no text"
JOBS[honar]="Classical oil painting portrait of Kamal-ol-Molk, Persian master painter: black moustache, elegant black Qajar suit, astrakhan kolah hat, wooden easel and palette behind him, dark graphite backdrop, painterly, no text"
JOBS[tafakkor]="Classical oil painting portrait of Nasir al-Din Tusi, Persian astronomer: white beard, grey-blue robe, brass astrolabe and star charts behind him, dark graphite backdrop, painterly, no text"
JOBS[salamat]="Classical oil painting portrait of Rhazes Razi, Persian physician alchemist: trimmed beard, white physician robe, glowing alembic vessels and glass bottles behind him, dark graphite backdrop, painterly, no text"
JOBS[defa]="Heroic panoramic painting of Iran Zagros mountains at dawn, snow peaks, silhouette of a young student gazing at the horizon, warm amber sky, compass and folded maps in foreground, classical style, dark tones, no text"

KEYS="${@:-farsi riazi oloum motaleat ghoran hedyeh arabi english kar honar tafakkor salamat defa}"
for key in $KEYS; do
  f="$OUT/$key.jpg"
  [ -s "$f" ] && { echo "$key exists, skip"; continue; }
  echo "-- generating $key ..."
  z-ai image -p "${JOBS[$key]}" -s 864x1152 -o "$f" >/dev/null 2>&1 || \
  z-ai image -p "${JOBS[$key]}" -s 864x1152 -o "$f" >/dev/null 2>&1
  [ -s "$f" ] && echo "   OK" || echo "   FAILED"
done
echo "BATCH DONE"
