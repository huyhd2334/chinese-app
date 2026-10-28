const fs = require('fs');

const isbns = [
  { level: 1, isbn: '9787561937099', name: 'hsk1' },
  { level: 2, isbn: '9787561937266', name: 'hsk2' },
  { level: 3, isbn: '9787561938188', name: 'hsk3' },
  { level: 4, isbn: '9787561939031', name: 'hsk4' },
  { level: 5, isbn: '9787561940334', name: 'hsk5' },
  { level: 6, isbn: '9787561942543', name: 'hsk6' }
];

async function checkIsbns() {
  for (const item of isbns) {
    const url = `https://books.google.com/books/content?vid=isbn${item.isbn}&printsec=frontcover&img=1&zoom=1`;
    try {
      const res = await fetch(url);
      console.log(item.name, res.status, res.headers.get('content-type'), res.url);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        console.log(item.name, 'bytes:', buf.byteLength);
        if (buf.byteLength > 2000) {
          fs.writeFileSync(`frontend/public/books/${item.name}.jpg`, Buffer.from(buf));
        }
      }
    } catch (e) {
      console.error(item.name, e);
    }
  }
}

if (!fs.existsSync('frontend/public/books')) {
  fs.mkdirSync('frontend/public/books', { recursive: true });
}

checkIsbns();
