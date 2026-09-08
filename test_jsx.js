const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

// let's do a simple count of `<div` and `</div` from line 990 to 1230.
let open = 0;
let close = 0;
for (let i = 990; i < 1233; i++) {
  const line = lines[i];
  const opens = (line.match(/<div/g) || []).length;
  const closes = (line.match(/<\/div/g) || []).length;
  open += opens;
  close += closes;
  if (opens !== closes) {
     // console.log(`Line ${i+1}: open ${opens}, close ${closes}`);
  }
}
console.log(`Total open: ${open}, Total close: ${close}`);
