const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE_URL = configuredApiBaseUrl.replace(/\/api$/i, '');

const TOKEN_KEY = 'smartmove_access_token';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
}

export async function apiRequest(path, options = {}) {
  const { body, headers = {}, token = getAccessToken(), ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers: requestHeaders,
      body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new Error(`Cannot reach the SmartMove API at ${API_BASE_URL}. Start the backend and try again.`);
  }

  if (response.status === 204) return null;

  const responseText = await response.text();
  let result = null;
  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      result = responseText;
    }
  }

  if (!response.ok) {
    const message = typeof result === 'object' && result !== null
      ? result.message || result.error
      : result;
    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  return result;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
};

export { API_BASE_URL, TOKEN_KEY };
