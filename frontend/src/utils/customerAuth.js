import { api } from '../api/client.js';
import { ROLES } from './roleAccess.js';

const CURRENT_USER_KEY = 'smartmove_authenticated_user';
const TOKEN_KEY = 'smartmove_access_token';
const AUTH_CHANGED_EVENT = 'smartmove-auth-changed';

function userStorage() {
  return localStorage.getItem(CURRENT_USER_KEY) !== null
    ? localStorage
    : sessionStorage;
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    roles: Array.isArray(user.roles) ? user.roles.map((role) => String(role).toLowerCase()) : [],
  };
}

function saveAuth(result, rememberMe = true) {
  const storage = rememberMe ? localStorage : sessionStorage;
  const otherStorage = rememberMe ? sessionStorage : localStorage;
  otherStorage.removeItem(CURRENT_USER_KEY);
  otherStorage.removeItem(TOKEN_KEY);
  storage.setItem(TOKEN_KEY, result.accessToken);
  storage.setItem(CURRENT_USER_KEY, JSON.stringify(normalizeUser(result.customer)));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  return normalizeUser(result.customer);
}

export function getCurrentUser() {
  try {
    return normalizeUser(JSON.parse(userStorage().getItem(CURRENT_USER_KEY) || 'null'));
  } catch {
    return null;
  }
}

export function getCurrentCustomer() {
  const user = getCurrentUser();
  return user?.roles.includes(ROLES.CUSTOMER) ? user : null;
}

export function getCurrentStaffUser() {
  const user = getCurrentUser();
  return user && user.roles.some((role) => [ROLES.ADMIN, ROLES.OPERATIONS, ROLES.FINANCE].includes(role))
    ? user
    : null;
}

export function subscribeToAuthChanges(callback) {
  window.addEventListener(AUTH_CHANGED_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export async function registerCustomer({ fullName, email, phone, password, confirmPassword }) {
  const result = await api.post('/api/auth/register', {
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
    confirmPassword,
  }, { token: '' });
  return saveAuth(result);
}

async function login({ email, password }, rememberMe = true) {
  const result = await api.post('/api/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  }, { token: '' });
  return { result, user: normalizeUser(result.customer), rememberMe };
}

export async function loginCustomer(credentials, rememberMe = true) {
  const { result, user } = await login(credentials, rememberMe);
  if (!user?.roles.includes(ROLES.CUSTOMER)) {
    await api.post('/api/auth/logout', undefined, { token: result.accessToken }).catch(() => {});
    throw new Error('This account is not a customer account. Use the staff sign-in page.');
  }
  return saveAuth(result, rememberMe);
}

export async function loginStaff(credentials, rememberMe = true) {
  const { result, user } = await login(credentials, rememberMe);
  if (!user?.roles.some((role) => [ROLES.ADMIN, ROLES.OPERATIONS, ROLES.FINANCE].includes(role))) {
    await api.post('/api/auth/logout', undefined, { token: result.accessToken }).catch(() => {});
    throw new Error('This account does not have a staff role.');
  }
  return saveAuth(result, rememberMe);
}

export async function fetchCurrentProfile() {
  return api.get('/api/passengers/me');
}

export async function updateCurrentCustomer(updates) {
  const updated = await api.put('/api/passengers/me', {
    fullName: updates.fullName.trim(),
    email: updates.email.trim().toLowerCase(),
    phone: updates.phone.trim(),
    nic: updates.nic?.trim() || null,
  });
  const current = getCurrentUser();
  if (current) {
    const normalized = normalizeUser({ ...current, fullName: updated.fullName, email: updated.email, phone: updated.phone });
    userStorage().setItem(CURRENT_USER_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
  return updated;
}

export async function logoutCustomer() {
  try {
    await api.post('/api/auth/logout', undefined);
  } finally {
    clearAuth();
  }
}

export function clearAuth() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
