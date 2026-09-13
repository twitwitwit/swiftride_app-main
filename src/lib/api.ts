const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function getAuthToken(): string | null {
  return sessionStorage.getItem('swiftride_admin_token');
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem('swiftride_admin_token', token);
}

export function clearAuthToken(): void {
  sessionStorage.removeItem('swiftride_admin_token');
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (response.status === 401) clearAuthToken();
  return response;
}

export function getWebSocketUrl(): string {
  const apiUrl = new URL(API_BASE_URL);
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  apiUrl.pathname = '';
  apiUrl.search = '';
  const token = getAuthToken();
  if (token) apiUrl.searchParams.set('token', token);
  return apiUrl.toString();
}

export async function loginAdmin(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.token) {
    throw new Error(payload.error || 'Unable to authenticate with the SwiftRide server.');
  }
  setAuthToken(payload.token);
}
