import crypto from 'node:crypto';
import { spawn } from 'node:child_process';

const salt = 'verification-salt';
const password = 'VerificationPass!9';
const hash = `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
const env = { ...process.env, PORT: '5055', SWIFTRIDE_TOKEN_SECRET: 'verification-token-secret', SWIFTRIDE_MOBILE_KEY: 'verification-mobile-key', SWIFTRIDE_ADMIN_USERNAME: 'verify-admin', SWIFTRIDE_ADMIN_PASSWORD_HASH: hash };
const server = spawn(process.execPath, ['server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const request = (path, init) => fetch(`http://127.0.0.1:5055${path}`, init);
const mobileHeaders = { 'content-type': 'application/json', 'x-swiftride-client-key': 'verification-mobile-key' };
try {
  await wait(800);
  if (!(await request('/api/health')).ok) throw new Error('health check failed');
  if ((await request('/api/stats')).status !== 401) throw new Error('unauthenticated API access was not rejected');
  const login = await request('/api/auth/login', { method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({ username: 'verify-admin', password }) });
  if (!login.ok) throw new Error(`login failed: ${login.status}`);
  const { token } = await login.json();
  const adminHeaders = { authorization: `Bearer ${token}` };
  if (!(await request('/api/stats', { headers: adminHeaders })).ok) throw new Error('authenticated stats failed');
  if (!(await request('/api/audit-logs', { headers: adminHeaders })).ok) throw new Error('audit log access failed');
  if (!(await request('/api/rides', { headers: { 'x-swiftride-client-key': 'verification-mobile-key' } })).ok) throw new Error('mobile access failed');
  if ((await request('/api/settings', { method: 'PUT', headers: mobileHeaders, body: '{}' })).status !== 403) throw new Error('mobile admin access was not rejected');
  const invalidRide = await request('/api/rides/request', { method: 'POST', headers: mobileHeaders, body: JSON.stringify({ passengerName: 'Test' }) });
  if (invalidRide.status !== 400) throw new Error('invalid ride payload was accepted');
  const invalidSos = await request('/api/emergencies', { method: 'POST', headers: mobileHeaders, body: JSON.stringify({ status: 'active' }) });
  if (invalidSos.status !== 400) throw new Error('invalid SOS payload was accepted');
  console.log('backend security verification passed');
} finally {
  server.kill('SIGTERM');
}
