import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IN_DIR = path.join(PROJECT_DIR, 'data/incoming');
const OUT_DIR = path.join(PROJECT_DIR, 'public/images');

function createRoundedMask(width, height) {
  const radius = Math.max(1, Math.round(Math.min(width, height) * 0.035));
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" rx="${radius}" fill="white"/></svg>`
  );
}

async function deleteIncomingImage(inPath) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      fs.unlinkSync(inPath);
      return;
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? error.code : undefined;
      if (code === 'ENOENT') return;
      if (!['EBUSY', 'EPERM', 'EACCES'].includes(code) || attempt === 3) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`WebP valmis, kuid sisendfaili kustutamine ebaõnnestus: ${message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
}

if (!fs.existsSync(IN_DIR)) fs.mkdirSync(IN_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(IN_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

if (files.length === 0) {
  console.log('data/incoming tühi - pole midagi teha');
  process.exit(0);
}

const outputNames = new Map();
for (const file of files) {
  const base = path.parse(file).name.replace(/\s+/g, '_');
  const outputName = `${base}.webp`;
  const key = outputName.toLowerCase();
  const previous = outputNames.get(key);
  if (previous) {
    throw new Error(`Väljundfaili nime konflikt: "${previous}" ja "${file}" -> "${outputName}"`);
  }
  outputNames.set(key, file);
}

console.log(`Leitud ${files.length} pilti, alustan...`);

let ok = 0;
let originalBytes = 0;
let webpBytes = 0;
for (const file of files) {
  const inPath = path.join(IN_DIR, file);
  const base = path.parse(file).name.replace(/\s+/g, '_');
  const outPath = path.join(OUT_DIR, base + '.webp');
  const tempPath = path.join(OUT_DIR, `.${base}.${process.pid}.tmp.webp`);

  try {
    const originalSize = fs.statSync(inPath).size;

    const { data: image, info } = await sharp(inPath)
      .rotate()
      .toBuffer({ resolveWithObject: true });

    await sharp(image)
      .composite([{ input: createRoundedMask(info.width, info.height), blend: 'dest-in' }])
      .webp({ quality: 78, effort: 6, smartSubsample: true })
      .toFile(tempPath);

    fs.renameSync(tempPath, outPath);

    const outputSize = fs.statSync(outPath).size;
    await deleteIncomingImage(inPath);
    originalBytes += originalSize;
    webpBytes += outputSize;
    const reduction = originalSize > 0 ? Math.round((1 - outputSize / originalSize) * 100) : 0;
    console.log(`OK ${file} -> ${base}.webp (${reduction}% smaller)`);
    ok++;
  } catch (e) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error(`VIGA ${file}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

console.log(`\nVALMIS - ${ok}/${files.length} teisendatud`);
if (originalBytes > 0) {
  const savedBytes = originalBytes - webpBytes;
  const savedPercent = Math.round((1 - webpBytes / originalBytes) * 100);
  console.log(`Suuruse muutus kokku: ${(originalBytes / 1024 / 1024).toFixed(2)} MB -> ${(webpBytes / 1024 / 1024).toFixed(2)} MB (${savedPercent}% väiksem)`);
  if (savedBytes < 0) console.log(`Märkus: WebP-failid on kokku ${(-savedBytes / 1024).toFixed(1)} KB suuremad kui originaalid.`);
}
console.log(`Uued webp: ${OUT_DIR}`);