import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const cli = new URL('../node_modules/tailwindcss/lib/cli.js', import.meta.url);
const args = [fileURLToPath(cli), '-i', './src/input.css', '-o', './src/generated.css'];
const firstBuild = spawn(process.execPath, args, { stdio: 'inherit' });
await new Promise((resolve, reject) => {
  firstBuild.on('error', reject);
  firstBuild.on('exit', code => code === 0 ? resolve() : reject(new Error(`Tailwind exited with ${code}`)));
});
const watcher = spawn(process.execPath, [...args, '--watch=always'], { stdio: 'inherit' });
const server = await createServer({ server: { host: '127.0.0.1' } });
await server.listen();
server.printUrls();
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  watcher.kill();
  await server.close();
  process.exit();
}
process.on('SIGINT', close);
process.on('SIGTERM', close);
watcher.on('exit', () => { if (!closing) close(); });
