const ACCOUNTS_KEY = 'smartmove_customer_accounts';
const CURRENT_CUSTOMER_KEY = 'smartMoveUser';
const PASSWORD_ITERATIONS = 120_000;

function readAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function encodeBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Account sign-in requires a secure browser connection.');
  }

  const saltBytes = Uint8Array.from(atob(salt), (character) => character.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const digest = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltBytes,
    iterations: PASSWORD_ITERATIONS,
    hash: 'SHA-256',
  }, key, 256);

  return encodeBase64(new Uint8Array(digest));
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return encodeBase64(bytes);
}

function publicCustomer(account) {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    phone: account.phone || '',
  };
}

function saveSession(customer) {
  localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
}

export function getCurrentCustomer() {
  try {
    const customer = JSON.parse(localStorage.getItem(CURRENT_CUSTOMER_KEY) || 'null');
    return customer && customer.id && customer.email ? customer : null;
  } catch {
    return null;
  }
}

export async function registerCustomer({ fullName, email, phone, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts();

  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const salt = createSalt();
  const account = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordSalt: salt,
    passwordHash: await hashPassword(password, salt),
  };

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([account, ...accounts]));
  const customer = publicCustomer(account);
  saveSession(customer);
  return customer;
}

export async function loginCustomer({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readAccounts().find((item) => item.email === normalizedEmail);

  if (!account) throw new Error('Email or password is incorrect.');

  const candidateHash = await hashPassword(password, account.passwordSalt);
  if (candidateHash !== account.passwordHash) {
    throw new Error('Email or password is incorrect.');
  }

  const customer = publicCustomer(account);
  saveSession(customer);
  return customer;
}

export function updateCurrentCustomer(updates) {
  const currentCustomer = getCurrentCustomer();
  if (!currentCustomer) throw new Error('Please log in again to update your profile.');

  const normalizedEmail = updates.email.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.id !== currentCustomer.id && account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const updatedAccounts = accounts.map((account) => (
    account.id === currentCustomer.id
      ? { ...account, fullName: updates.fullName.trim(), email: normalizedEmail, phone: updates.phone.trim() }
      : account
  ));
  const updatedCustomer = { ...currentCustomer, ...updates, email: normalizedEmail };

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  saveSession(updatedCustomer);
  return updatedCustomer;
}

export function logoutCustomer() {
  localStorage.removeItem(CURRENT_CUSTOMER_KEY);
}
