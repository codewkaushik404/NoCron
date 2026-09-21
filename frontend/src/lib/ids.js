/** Stable id helpers shared by the store and the webhook URL builder. */

const uid = () =>
  (crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)).replace(/-/g, "");

const host_name = import.meta.env.VITE_BACKEND_DEPLOY_URL;
export const makeNodeId = () => `node-${uid().slice(0, 6)}`;
export const makeEdgeId = () => `edge-${uid().slice(0, 6)}`;
export const makeHookId = () => `wh_${uid().slice(0, 8)}`;

export const hookUrl = (hookId) => `${host_name}/hooks/${hookId}`;
