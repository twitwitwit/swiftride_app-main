import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const salt = 'verification-salt';
const password = 'VerificationPass!9';
const hash = `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
const env = {
  ...process.env,
  PORT: '5055',
  SWIFTRIDE_TOKEN_SECRET: 'verification-token-secret',
  SWIFTRIDE_MOBILE_KEY: 'verification-mobile-key',
  SWIFTRIDE_ADMIN_USERNAME: 'verify-admin',
  SWIFTRIDE_ADMIN_PASSWORD_HASH: hash,
};
const server = spawn(process.execPath, ['server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const request = (path, init) => fetch(`http://127.0.0.1:5055${path}`, init);
try {
  await wait(800);
  const health = await request('/api/health');
  if (!health.ok) throw new Error(`health expected 200, got ${health.status}`);
  const unauth = await request('/api/stats');
  if (unauth.status !== 401) throw new Error(`stats expected 401, got ${unauth.status}`);
  const login = await request('/api/auth/login', { method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({ username: 'verify-admin', password }) });
  if (!login.ok) throw new Error(`login expected 200, got ${login.status}`);
  const { token } = await login.json();
  const stats = await request('/api/stats', { headers: { authorization: `Bearer ${token}` } });
  if (!stats.ok) throw new Error(`authenticated stats expected 200, got ${stats.status}`);
  const mobile = await request('/api/rides', { headers: { 'x-swiftride-client-key': 'verification-mobile-key' } });
  if (!mobile.ok) throw new Error(`mobile access expected 200, got ${mobile.status}`);
  const forbidden = await request('/api/settings', { method: 'PUT', headers: {'content-type': 'application/json', 'x-swiftride-client-key': 'verification-mobile-key'}, body: '{}' });
  if (forbidden.status !== 403) throw new Error(`mobile settings expected 403, got ${forbidden.status}`);
  console.log('backend verification passed');
} finally {
  server.kill('SIGTERM');
}
