const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync, execFile } = require('node:child_process');
const root = path.resolve(__dirname, '..');
process.chdir(root);

function openBrowser(url) {
  if (process.argv.includes('--no-browser')) return;
  if (process.platform === 'win32') {
    execFile(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `start "" "${url}"`],
      { windowsHide: true }, (error) => {
        if (error) console.log(`Abra no navegador: ${url}`);
      });
  } else console.log(`Abra no navegador: ${url}`);
}

async function health(url) {
  try {
    const response = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (!response.ok) return false;
    const data = await response.json();
    return data.app === 'PostNaMao' && data.mode !== 'production';
  } catch { return false; }
}

async function main() {
  if (Number(process.versions.node.split('.')[0]) < 22) {
    throw new Error('Instale o Node.js 22 ou superior: https://nodejs.org/');
  }
  const cli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  if (!fs.existsSync(cli)) {
    console.log('Preparando o PostNaMão. A primeira execução precisa de internet...');
    const result = process.platform === 'win32'
      ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm ci --no-audit --no-fund'], { cwd: root, stdio: 'inherit', windowsHide: true })
      : spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: root, stdio: 'inherit' });
    if (result.error || result.status !== 0) throw new Error('Falha ao instalar dependências. Verifique a internet e tente novamente.');
  }
  const { loadEnv } = await import('vite');
  const env = loadEnv('development', root, '');
  const port = Number(process.env.PORT || env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválida no .env.local.');
  const baseUrl = `http://127.0.0.1:${port}`;
  const url = `${baseUrl}/demo`;
  if (await health(baseUrl)) {
    console.log(`O PostNaMão já está aberto: ${url}`);
    openBrowser(url);
    return;
  }
  console.log('Iniciando o PostNaMão... Mantenha esta janela aberta.');
  console.log('Para encerrar, pressione Ctrl+C ou feche esta janela.');
  const child = spawn(process.execPath, [cli, 'server.ts'], {
    cwd: root, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development', HOST: '127.0.0.1' },
  });
  let finished = false;
  const timer = setInterval(async () => {
    if (!finished && await health(baseUrl)) {
      finished = true;
      clearInterval(timer);
      console.log(`Pronto! ${url}`);
      openBrowser(url);
    }
  }, 750);
  const timeout = setTimeout(() => {
    clearInterval(timer);
    if (!finished) console.log('A inicialização está demorando. Confira as mensagens acima.');
  }, 60_000);
  timeout.unref();
  child.on('error', (error) => { clearInterval(timer); console.error(error.message); process.exitCode = 1; });
  child.on('exit', (code) => { clearInterval(timer); clearTimeout(timeout); process.exitCode = code || 0; });
  process.on('SIGINT', () => { child.kill(); });
  process.on('SIGTERM', () => { child.kill(); });
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
