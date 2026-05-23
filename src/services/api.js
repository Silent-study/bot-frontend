// ─── API Service Layer ─────────────────────────────────────────────────────
// Central service for all backend API calls. Uses environment variable for base URL.
// Manages JWT token storage and provides authenticated fetch wrappers.

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

// ─── Token Management ──────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('ss_token');
}

export function setAuth(data) {
  if (data.token) localStorage.setItem('ss_token', data.token);
  if (data.plan) localStorage.setItem('ss_plan', data.plan);
  if (data.expiresAt) localStorage.setItem('ss_expiresAt', data.expiresAt);
  if (data.addons) localStorage.setItem('ss_addons', JSON.stringify(data.addons));
  if (data.userId) localStorage.setItem('ss_userId', data.userId);
  if (data.email) localStorage.setItem('ss_email', data.email);
}

export function getAuthData() {
  return {
    token: localStorage.getItem('ss_token'),
    plan: localStorage.getItem('ss_plan'),
    expiresAt: localStorage.getItem('ss_expiresAt'),
    addons: JSON.parse(localStorage.getItem('ss_addons') || '[]'),
    userId: localStorage.getItem('ss_userId'),
    email: localStorage.getItem('ss_email'),
  };
}

export function clearAuth() {
  localStorage.removeItem('ss_token');
  localStorage.removeItem('ss_plan');
  localStorage.removeItem('ss_expiresAt');
  localStorage.removeItem('ss_addons');
  localStorage.removeItem('ss_userId');
  localStorage.removeItem('ss_email');
  // Also clear old keys from previous auth system
  localStorage.removeItem('isPaid');
  localStorage.removeItem('userId');
}

export function isAuthenticated() {
  const token = getToken();
  const expiresAt = localStorage.getItem('ss_expiresAt');
  if (!token) return false;
  if (expiresAt && new Date(expiresAt) < new Date()) return false;
  return true;
}

// ─── Fetch Wrappers ────────────────────────────────────────────────────────

async function authFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  return res;
}

async function publicFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return res;
}

// ─── Public API Calls (no auth needed) ─────────────────────────────────────

export async function sendOtp(email) {
  return publicFetch('/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function register({ email, password, plan, addons, otp }) {
  return publicFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, plan, addons, otp }),
  });
}

export async function createCheckout({ planId, addons, userId }) {
  return publicFetch('/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ planId, addons, userId }),
  });
}

export async function forgotPassword(email) {
  return publicFetch('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ email, otp, newPassword }) {
  return publicFetch('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

export async function login({ email, password }) {
  const res = await publicFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.ok) {
    const data = await res.json();
    setAuth({
      token: data.token,
      plan: data.plan,
      expiresAt: data.expiresAt,
      addons: data.addons,
      email,
    });
    return { success: true, ...data };
  }
  const err = await res.json();
  return { success: false, error: err.error || 'Login failed' };
}

// ─── Protected API Calls (auth needed) ─────────────────────────────────────

export async function getStats() {
  const res = await authFetch('/api/stats');
  if (res.ok) return res.json();
  throw new Error('Failed to load stats');
}

export async function getUser() {
  const res = await authFetch('/api/user');
  if (res.ok) return res.json();
  throw new Error('Failed to load user data');
}

export async function downloadExtension() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/download-extension`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to download extension');
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'silent-study-extension.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function getConfig() {
  const res = await authFetch('/api/config');
  if (res.ok) return res.json();
  throw new Error('Failed to load bot config');
}

export async function saveConfig(config) {
  const res = await authFetch('/api/config', {
    method: 'POST',
    body: JSON.stringify(config)
  });
  if (res.ok) return res.json();
  const err = await res.json();
  throw new Error(err.error || 'Failed to save bot config');
}

export async function getNotes(page = 1, limit = 20) {
  const res = await authFetch(`/api/notes?page=${page}&limit=${limit}`);
  if (res.ok) return res.json();
  throw new Error('Failed to load notes');
}

// ─── Socket.IO Helper ──────────────────────────────────────────────────────

export function getSocketUrl() {
  return API_BASE;
}
