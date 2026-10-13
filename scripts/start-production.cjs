const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
process.chdir(root);
const server = path.join(root, 'dist', 'server.cjs');
if (!fs.existsSync(server)) {
  console.error('Execute npm run build antes de iniciar a versão de produção.');
  process.exitCode = 1;
} else {
  process.env.NODE_ENV = 'production';
  require(server);
}
