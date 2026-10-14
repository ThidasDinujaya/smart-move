const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
const API_BASE_URL = configuredApiBaseUrl.replace(/\/api$/i, '');

const CURRENT_USER_KEY = 'smartmove_authenticated_user';

function getCurrentUserId() {
  const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    || sessionStorage.getItem(CURRENT_USER_KEY);
  if (!savedUser) return '';

  try {
    const user = JSON.parse(savedUser);
    return user?.userId == null ? '' : String(user.userId);
  } catch {
    return '';
  }
}

export async function apiRequest(path, options = {}) {
  const { body, headers = {}, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  const userId = getCurrentUserId();
  if (userId) requestHeaders.set('X-User-Id', userId);

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
      // Spring Boot returns RFC 9457 Problem Details for ResponseStatusException,
      // where the actionable validation text is in `detail`.
      ? result.message || result.detail || result.error || result.title
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

export { API_BASE_URL };
