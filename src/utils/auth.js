export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function getTokenExpiryMs(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp * 1000;
}

export function getTokenRemainingMs(token) {
  const expiresAtMs = getTokenExpiryMs(token);
  if (!expiresAtMs) return null;
  return expiresAtMs - Date.now();
}

export function isTokenExpired(token) {
  const remainingMs = getTokenRemainingMs(token);
  if (remainingMs === null) return true;
  return remainingMs <= 0;
}
