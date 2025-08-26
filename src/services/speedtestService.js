// src/services/speedtestService.js

const BASE = (import.meta.env.VITE_SPEEDTEST_API_URL || "").replace(/\/+$/, "");
const HEALTH_URL = `${BASE}/health`;
const SPEEDTEST_URL = `${BASE}/api/speedtest`;

async function wakeBackend() {
  try {
    const r = await fetch(HEALTH_URL, { method: "GET", cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url, { timeoutMs = 45000, ...opts } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function ejecutarSpeedtest({ timeoutMs = 45000 } = {}) {
  await wakeBackend();

  let res;
  try {
    res = await fetchWithTimeout(SPEEDTEST_URL, {
      timeoutMs,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    res = null;
  }

  if (!res || [502, 503, 504].includes(res.status)) {
    await new Promise(r => setTimeout(r, 3000)); // backoff 3s
    res = await fetchWithTimeout(SPEEDTEST_URL, {
      timeoutMs,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Error HTTP ${res.status} ${txt || ""}`.trim());
  }

  try {
    return await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }
}
