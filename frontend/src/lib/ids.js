/** Stable id helpers shared by the store and the webhook URL builder. */

const uid = () =>
  (crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)).replace(/-/g, "");

export const makeNodeId = () => `node-${uid().slice(0, 6)}`;
export const makeEdgeId = () => `edge-${uid().slice(0, 6)}`;
export const makeHookId = () => `wh_${uid().slice(0, 8)}`;

export const hookUrl = (hookId) => `https://nocron.dev/hooks/${hookId}`;
