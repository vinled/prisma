const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const name of ['dist', 'server.js']) {
  const target = path.resolve(root, name);
  if (path.dirname(target) !== root) throw new Error('Destino inválido.');
  fs.rmSync(target, { recursive: true, force: true });
}
console.log('Arquivos de compilação removidos.');
