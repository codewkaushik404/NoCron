
export function getApiBase() {
  const raw = import.meta.env.VITE_BACKEND_DEPLOY_URL?.trim();
  return raw ? raw.replace(/\/+$/, "") : null;
}
