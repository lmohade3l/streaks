/**
 * Generates the PWA icon set: a full-bleed accent tile with a check mark.
 * Written by hand so the repo needs no image toolchain — run `npm run gen:icons`
 * if the mark ever changes.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const ACCENT = [0x65, 0xa3, 0x0d];
const MARK = [0xfc, 0xfc, 0xfb];
const SS = 3; // supersampling factor, for antialiased edges

/** Check mark as a normalised polyline, drawn with round joins and caps. */
const STROKE = [
  [0.27, 0.52],
  [0.435, 0.685],
  [0.735, 0.335],
];

function distanceToSegment(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function coverage(nx, ny, halfWidth) {
  let nearest = Infinity;
  for (let i = 0; i < STROKE.length - 1; i += 1) {
    nearest = Math.min(nearest, distanceToSegment(nx, ny, STROKE[i], STROKE[i + 1]));
  }
  return nearest <= halfWidth ? 1 : 0;
}

/** @param scale shrinks the mark so maskable icons stay inside the safe zone. */
function render(size, scale) {
  const halfWidth = 0.045 * scale;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  let offset = 0;

  for (let y = 0; y < size; y += 1) {
    raw[offset] = 0; // filter type: none
    offset += 1;
    for (let x = 0; x < size; x += 1) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy += 1) {
        for (let sx = 0; sx < SS; sx += 1) {
          const nx = (x + (sx + 0.5) / SS) / size;
          const ny = (y + (sy + 0.5) / SS) / size;
          hits += coverage((nx - 0.5) / scale + 0.5, (ny - 0.5) / scale + 0.5, halfWidth / scale);
        }
      }
      const alpha = hits / (SS * SS);
      for (let c = 0; c < 3; c += 1) {
        raw[offset + c] = Math.round(ACCENT[c] + (MARK[c] - ACCENT[c]) * alpha);
      }
      raw[offset + 3] = 255;
      offset += 4;
    }
  }
  return raw;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(size, scale) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(render(size, scale), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true });

const ICONS = [
  ['icon-192.png', 192, 1],
  ['icon-512.png', 512, 1],
  // Maskable art must survive a circular crop: keep it in the middle 80%.
  ['maskable-512.png', 512, 0.7],
  ['apple-touch-icon.png', 180, 1],
];

for (const [name, size, scale] of ICONS) {
  const url = new URL(`../public/icons/${name}`, import.meta.url);
  writeFileSync(url, png(size, scale));
  console.log(`wrote public/icons/${name}`);
}
