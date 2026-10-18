import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IN_DIR = 'data/incoming';
const OUT_DIR = 'public/images';
const ARCHIVE_DIR = 'data/originals'; // kuhu originaalid alles jäävad

if (!fs.existsSync(IN_DIR)) fs.mkdirSync(IN_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

const files = fs.readdirSync(IN_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

if (files.length === 0) {
  console.log('data/incoming tühi - pole midagi teha');
  process.exit(0);
}

console.log(`Leitud ${files.length} pilti, alustan...`);

let ok = 0;
for (const file of files) {
  const inPath = path.join(IN_DIR, file);
  const base = path.parse(file).name;
  const outPath = path.join(OUT_DIR, base + '.webp');
  const archivePath = path.join(ARCHIVE_DIR, file);

  try {
    await sharp(inPath)
      .resize({ width: 1200, withoutEnlargement: true }) // max 1200px, piisab poele
      .webp({ quality: 80 })
      .toFile(outPath);

    // tõsta originaal arhiivi
    fs.renameSync(inPath, archivePath);
    console.log(`OK ${file} -> ${base}.webp`);
    ok++;
  } catch (e) {
    console.error(`VIGA ${file}: ${e.message}`);
  }
}

console.log(`\nVALMIS - ${ok}/${files.length} teisendatud`);
console.log(`Uued webp: ${OUT_DIR}`);
console.log(`Originaalid: ${ARCHIVE_DIR}`);