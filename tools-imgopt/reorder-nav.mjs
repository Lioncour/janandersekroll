import fs from 'fs';

const path = new URL('../index.html', import.meta.url);
let html = fs.readFileSync(path, 'utf8');

html = html.replace(
  '<h2 role="button" tabindex="0" aria-expanded="false">Projects</h2>',
  '<h2 role="button" tabindex="0" aria-expanded="false">Projects / work</h2>'
);

function categoryBounds(html, h2Pos) {
  const open = html.lastIndexOf('<div class="category">', h2Pos);
  let i = open + '<div class="category">'.length;
  let depth = 1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      i = nextClose + 6;
      if (depth === 0) return { open, close: nextClose + 6 };
    }
  }
  return null;
}

const projH2 = html.indexOf('>Projects / work</h2>');
const ytH2 = html.indexOf('>YouTube</h2>');
const proj = categoryBounds(html, projH2);
const yt = categoryBounds(html, ytH2);

if (!proj || !yt) {
  console.error('Could not find category bounds', { proj, yt });
  process.exit(1);
}

const projBlock = html.slice(proj.open, proj.close);
const ytBlock = html.slice(yt.open, yt.close);
const betweenStart = Math.min(proj.open, yt.open);
const betweenEnd = Math.max(proj.close, yt.close);
const reordered = `${ytBlock}\n\n            ${projBlock}`;
html = html.slice(0, betweenStart) + reordered + html.slice(betweenEnd);

html = html.replace(
  '<div class="category">\n                <h2 role="button" tabindex="0" aria-expanded="false">Blog / newsletter',
  '<div class="category category-blog">\n                <h2 role="button" tabindex="0" aria-expanded="false">Blog / newsletter'
);

fs.writeFileSync(path, html);
console.log('YouTube index:', html.indexOf('>YouTube</h2>'));
console.log('Projects index:', html.indexOf('>Projects / work</h2>'));
console.log('Has blog spacing class:', html.includes('category-blog'));
