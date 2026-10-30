export function getApiBase() {
  const raw = import.meta.env.VITE_BACKEND_DEPLOY_URL?.trim();
  return raw ? raw.replace(/\/+$/, "") : null;
}

export function apiUrl(path) {
  const base = getApiBase();

  if (!base) {
    throw new Error("Set VITE_BACKEND_DEPLOY_URL in frontend/.env.");
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
