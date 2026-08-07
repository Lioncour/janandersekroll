import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const xmlPath = path.join(process.env.TEMP || '/tmp', 'gr.xml');
const outPath = path.join(ROOT, 'content', 'books.json');

const xml = fs.readFileSync(xmlPath, 'utf8');
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

function tag(block, name) {
  const cdata = block.match(new RegExp(`<${name}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${name}>`));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`));
  if (plain) return plain[1].trim();
  return null;
}

const books = items.map((m) => {
  const block = m[1];
  let title = tag(block, 'title') || 'Unknown Title';
  // Goodreads sometimes prefixes with "Title: "
  title = title.replace(/^.*: /, '');
  const author = tag(block, 'author_name') || tag(block, 'author') || 'Unknown Author';
  const cover =
    tag(block, 'book_large_image_url') ||
    tag(block, 'book_medium_image_url') ||
    null;
  const ratingRaw = tag(block, 'user_rating');
  const isbn = tag(block, 'isbn');

  return {
    title,
    author,
    cover,
    rating: ratingRaw ? Number(ratingRaw) : null,
    isbn: isbn || null
  };
}).filter((book) => book.title && book.title !== 'Unknown Title');

const payload = {
  goodreadsUrl: 'https://www.goodreads.com/user/show/120322204',
  updatedAt: new Date().toISOString().slice(0, 10),
  books
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`Wrote ${books.length} books to ${outPath}`);
console.log(books.slice(0, 5).map((b) => b.title).join(' | '));
