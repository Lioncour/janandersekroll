import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGINALS = path.join(ROOT, 'originals');
const MAX_EDGE = 1600;
const GIF_MAX_EDGE = 1200;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 78;
const MIN_BYTES_TO_TOUCH = 120 * 1024; // skip tiny assets (icons, favicons)

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  'originals',
  'tools-imgopt',
  '.git',
  '.cursor'
]);

function isImage(filePath) {
  return IMAGE_EXTS.has(path.extname(filePath).toLowerCase());
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && isImage(full)) {
      yield full;
    }
  }
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function backupOriginal(absPath) {
  const rel = path.relative(ROOT, absPath);
  const dest = path.join(ORIGINALS, rel);
  try {
    await fs.access(dest);
    return dest; // already backed up
  } catch {
    await ensureDir(dest);
    await fs.copyFile(absPath, dest);
    return dest;
  }
}

function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

async function optimizeStill(absPath, ext) {
  const input = sharp(absPath, { failOn: 'none' });
  const meta = await input.metadata();
  const pipeline = sharp(absPath, { failOn: 'none' }).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: 'inside',
    withoutEnlargement: true
  });

  const tmp = `${absPath}.opt.tmp`;

  if (ext === '.png') {
    // Keep PNG for UI/graphics with possible transparency.
    await pipeline.png({ compressionLevel: 9, palette: false }).toFile(tmp);
  } else {
    // jpg / jpeg / unknown photo-like
    await pipeline
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toFile(tmp);
  }

  const before = (await fs.stat(absPath)).size;
  const after = (await fs.stat(tmp)).size;

  if (after < before * 0.98) {
    await fs.rename(tmp, absPath);
    return { before, after, width: meta.width, height: meta.height, changed: true };
  }

  await fs.unlink(tmp);
  return { before, after: before, width: meta.width, height: meta.height, changed: false };
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function unlinkWithRetry(filePath, attempts = 8) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      await fs.unlink(filePath);
      return;
    } catch (err) {
      lastError = err;
      await sleep(150 * (i + 1));
    }
  }
  throw lastError;
}

async function optimizeGifToWebp(absPath) {
  const webpPath = absPath.replace(/\.gif$/i, '.webp');
  const tmp = `${webpPath}.opt.tmp`;

  // Read into a buffer first so Windows can release the source file handle.
  const inputBuffer = await fs.readFile(absPath);
  const before = inputBuffer.length;

  await sharp(inputBuffer, { animated: true, failOn: 'none' })
    .rotate()
    .resize({
      width: GIF_MAX_EDGE,
      height: GIF_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(tmp);

  const after = (await fs.stat(tmp)).size;
  await fs.rename(tmp, webpPath);
  await unlinkWithRetry(absPath);

  return { before, after, webpPath, changed: true };
}

async function main() {
  const roots = [
    path.join(ROOT, 'content'),
    path.join(ROOT, 'assets')
  ];

  const gifConversions = [];
  let saved = 0;
  let touched = 0;
  let skipped = 0;

  for (const rootDir of roots) {
    try {
      await fs.access(rootDir);
    } catch {
      continue;
    }

    for await (const absPath of walk(rootDir)) {
      const ext = path.extname(absPath).toLowerCase();
      const rel = path.relative(ROOT, absPath);
      const stat = await fs.stat(absPath);

      // Always skip already-generated temp files
      if (absPath.endsWith('.opt.tmp')) continue;

      // Leave tiny icons alone
      if (stat.size < MIN_BYTES_TO_TOUCH && ext !== '.gif') {
        skipped += 1;
        continue;
      }

      await backupOriginal(absPath);

      try {
        if (ext === '.gif') {
          const result = await optimizeGifToWebp(absPath);
          gifConversions.push({
            from: rel,
            to: path.relative(ROOT, result.webpPath)
          });
          saved += result.before - result.after;
          touched += 1;
          console.log(
            `GIF→WebP ${rel}: ${formatMB(result.before)} → ${formatMB(result.after)}`
          );
        } else if (ext === '.webp') {
          // Recompress large webp stills/animations lightly
          const tmp = `${absPath}.opt.tmp`;
          await sharp(absPath, { animated: true, failOn: 'none' })
            .rotate()
            .resize({
              width: MAX_EDGE,
              height: MAX_EDGE,
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: WEBP_QUALITY, effort: 4 })
            .toFile(tmp);
          const after = (await fs.stat(tmp)).size;
          if (after < stat.size * 0.98) {
            await fs.rename(tmp, absPath);
            saved += stat.size - after;
            touched += 1;
            console.log(`WEBP ${rel}: ${formatMB(stat.size)} → ${formatMB(after)}`);
          } else {
            await fs.unlink(tmp);
            skipped += 1;
          }
        } else {
          const result = await optimizeStill(absPath, ext);
          if (result.changed) {
            saved += result.before - result.after;
            touched += 1;
            console.log(
              `IMG ${rel}: ${formatMB(result.before)} → ${formatMB(result.after)}`
            );
          } else {
            skipped += 1;
            console.log(`SKIP (no gain) ${rel}`);
          }
        }
      } catch (err) {
        console.error(`FAIL ${rel}: ${err.message}`);
      }
    }
  }

  const manifestPath = path.join(ORIGINALS, 'gif-conversions.json');
  await ensureDir(manifestPath);
  await fs.writeFile(manifestPath, JSON.stringify(gifConversions, null, 2));

  console.log('\nDone.');
  console.log(`Optimized: ${touched}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Saved:     ${formatMB(saved)}`);
  console.log(`GIF→WebP conversions: ${gifConversions.length}`);
  console.log(`Originals backed up under: ${path.relative(ROOT, ORIGINALS)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
