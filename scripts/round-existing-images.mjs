import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createTemporaryDirectory } from './temporary-workspace.mjs';

const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGE_DIR = path.join(PROJECT_DIR, 'public', 'images');
const ORIGINALS_DIR = path.join(PROJECT_DIR, 'data', 'originals');
const RADIUS_RATIO = 0.035;
const EXCLUDED_NAMES = new Set([
  'logo_canman_värvi.webp',
  'placeholder.webp',
]);

function createRoundedMask(width, height) {
  const radius = Math.max(1, Math.round(Math.min(width, height) * RADIUS_RATIO));
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" rx="${radius}" fill="white"/></svg>`
  );
}

async function validateRoundedImage(data, filename) {
  const image = sharp(data).ensureAlpha();
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Image has invalid dimensions: ${filename}`);
  }

  const [corner, center] = await Promise.all([
    sharp(data)
      .ensureAlpha()
      .extract({ left: 0, top: 0, width: 1, height: 1 })
      .raw()
      .toBuffer(),
    sharp(data)
      .ensureAlpha()
      .extract({
        left: Math.floor(metadata.width / 2),
        top: Math.floor(metadata.height / 2),
        width: 1,
        height: 1,
      })
      .raw()
      .toBuffer(),
  ]);
  if (corner[3] > 10 || center[3] < 245) {
    throw new Error(
      `Rounded-corner validation failed for ${filename} (corner alpha ${corner[3]}, center alpha ${center[3]})`
    );
  }
  return metadata;
}

async function main() {
  const files = fs.readdirSync(IMAGE_DIR)
    .filter(filename =>
      filename.toLowerCase().endsWith('.webp') &&
      !EXCLUDED_NAMES.has(filename.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));

  if (!files.length) {
    console.log(`No product WebP images found in ${IMAGE_DIR}`);
    return;
  }

  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const backupDir = path.join(ORIGINALS_DIR, `rounded-corners-once-${timestamp}`);
  const estimatedTempBytes = files.reduce(
    (total, filename) => total + fs.statSync(path.join(IMAGE_DIR, filename)).size * 2,
    0
  );
  fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
  const stagingDir = createTemporaryDirectory('canman-rounded-', estimatedTempBytes);

  const staged = [];
  let replacementStarted = false;
  try {
    for (const filename of files) {
      const inputPath = path.join(IMAGE_DIR, filename);
      const original = fs.readFileSync(inputPath);
      const before = await sharp(original).metadata();
      if (!before.width || !before.height) {
        throw new Error(`Image has invalid dimensions: ${filename}`);
      }

      const output = await sharp(original)
        .composite([
          {
            input: createRoundedMask(before.width, before.height),
            blend: 'dest-in',
          },
        ])
        .webp({ quality: 78, effort: 6, smartSubsample: true })
        .toBuffer();
      const after = await validateRoundedImage(output, filename);
      if (after.width !== before.width || after.height !== before.height) {
        throw new Error(
          `Dimensions changed for ${filename}: ${before.width}x${before.height} -> ${after.width}x${after.height}`
        );
      }

      const stagedPath = path.join(stagingDir, filename);
      fs.writeFileSync(stagedPath, output);
      staged.push({ filename, original, stagedPath });
    }

    fs.mkdirSync(backupDir, { recursive: false });
    for (const entry of staged) {
      const backupPath = path.join(backupDir, entry.filename);
      fs.copyFileSync(path.join(IMAGE_DIR, entry.filename), backupPath, fs.constants.COPYFILE_EXCL);
      if (!fs.readFileSync(backupPath).equals(entry.original)) {
        throw new Error(`Backup verification failed: ${entry.filename}`);
      }
    }

    replacementStarted = true;
    for (const entry of staged) {
      fs.copyFileSync(entry.stagedPath, path.join(IMAGE_DIR, entry.filename));
    }

    for (const entry of staged) {
      await validateRoundedImage(
        fs.readFileSync(path.join(IMAGE_DIR, entry.filename)),
        entry.filename
      );
    }

    fs.rmSync(stagingDir, { recursive: true, force: true });
    console.log(`Rounded and verified ${staged.length} product images.`);
    console.log('Original dimensions were preserved.');
    console.log(`Exact backups: ${backupDir}`);
  } catch (error) {
    if (replacementStarted && fs.existsSync(backupDir)) {
      const restoreErrors = [];
      for (const entry of staged) {
        const backupPath = path.join(backupDir, entry.filename);
        if (!fs.existsSync(backupPath)) continue;
        try {
          fs.copyFileSync(backupPath, path.join(IMAGE_DIR, entry.filename));
          if (!fs.readFileSync(path.join(IMAGE_DIR, entry.filename)).equals(entry.original)) {
            throw new Error('restored bytes do not match backup');
          }
        } catch (restoreError) {
          restoreErrors.push(`${entry.filename}: ${restoreError.message}`);
        }
      }
      if (restoreErrors.length) {
        throw new Error(
          `${error.message}; rollback failed for ${restoreErrors.join('; ')}. Backups retained at ${backupDir}`
        );
      }
    }
    throw error;
  } finally {
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
  }
}

main().catch(error => {
  console.error(`Image rounding failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
