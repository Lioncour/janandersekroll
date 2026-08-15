import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(process.env.TEMP, 'fylgja-play.html'), 'utf8');

// Phone screenshots usually use w240-h480 / w480-h960 suffixes in the listing HTML.
const phoneBases = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/([A-Za-z0-9_-]+)=w240-h480/g)]
  .map((m) => m[1]);
const uniquePhone = [...new Set(phoneBases)];

// Feature graphic / header images often use w526-h296
const featureBases = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/([A-Za-z0-9_-]+)=w526-h296/g)]
  .map((m) => m[1]);
const uniqueFeature = [...new Set(featureBases)];

// App icon often appears with =s something or near beginning - try to find large square icon
// Common pattern: icon without size or =s512
console.log('phone screenshots:', uniquePhone.length);
uniquePhone.forEach((id, i) => console.log(`  phone[${i}]`, id));
console.log('feature graphics:', uniqueFeature.length);
uniqueFeature.forEach((id, i) => console.log(`  feature[${i}]`, id));

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', (err) => {
      try { fs.unlinkSync(dest); } catch {}
      reject(err);
    });
  });
}

const outDir = path.join(ROOT, 'content', 'projects', 'Fylgja', 'images');
fs.mkdirSync(outDir, { recursive: true });

// Keep a backup folder for old images if present
const backupDir = path.join(ROOT, 'originals', 'content', 'projects', 'Fylgja', 'images');
fs.mkdirSync(backupDir, { recursive: true });

for (const name of fs.readdirSync(outDir)) {
  const src = path.join(outDir, name);
  if (fs.statSync(src).isFile()) {
    const dest = path.join(backupDir, name);
    if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
  }
}

const downloads = [];

// Feature graphics first (wide promo), then phone screenshots
uniqueFeature.forEach((id, i) => {
  const n = String(i + 1).padStart(2, '0');
  downloads.push({
    url: `https://play-lh.googleusercontent.com/${id}=w1920-h1080`,
    file: `play-feature-${n}.jpg`
  });
});

uniquePhone.forEach((id, i) => {
  const n = String(i + 1).padStart(2, '0');
  downloads.push({
    url: `https://play-lh.googleusercontent.com/${id}=w1080-h1920`,
    file: `play-screen-${n}.jpg`
  });
});

// Also grab a high-res icon if we can find a likely candidate from page (first unique without size in og:image)
const og = html.match(/property="og:image" content="(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"/);
if (og) {
  const base = og[1].split('=')[0];
  downloads.unshift({
    url: `${base}=s512-rw`,
    file: 'play-icon.png'
  });
  console.log('og:image', og[1]);
}

const saved = [];
for (const item of downloads) {
  const dest = path.join(outDir, item.file);
  try {
    await download(item.url, dest);
    const size = fs.statSync(dest).size;
    console.log('OK', item.file, size);
    if (size > 1000) saved.push(item.file);
    else fs.unlinkSync(dest);
  } catch (err) {
    console.log('FAIL', item.file, err.message);
  }
}

fs.writeFileSync(
  path.join(outDir, 'playstore-manifest.json'),
  JSON.stringify({ saved, phone: uniquePhone, feature: uniqueFeature }, null, 2)
);
console.log('Saved files:', saved.join(', '));
