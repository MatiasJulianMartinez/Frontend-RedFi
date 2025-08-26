// src/services/speedtestService.js

// Base del backend (sin slash final)
const BASE = (import.meta.env.VITE_SPEEDTEST_API_URL || "").replace(/\/+$/, "");

// Endpoints
const HEALTH_URL = `${BASE}/health`;
const SPEEDTEST_URL = `${BASE}/api/speedtest`;

/**
 * Ping liviano para “despertar” el server en Render.
 */
async function wakeBackend() {
  try {
    const r = await fetch(HEALTH_URL, { method: "GET", cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch con timeout (AbortController)
 */
async function fetchWithTimeout(url, { timeoutMs = 60000, ...opts } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Ejecuta el speedtest en el backend.
 * - Despierta el server
 * - Llama al endpoint real
 * - Reintenta 1 vez en 502/503/504 o error de red
 */
export async function ejecutarSpeedtest({ timeoutMs = 60000 } = {}) {
  // 1) Wake-up (no falla si no responde)
  await wakeBackend();

  // 2) Primer intento
  let res;
  try {
    res = await fetchWithTimeout(SPEEDTEST_URL, {
      timeoutMs,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch (e) {
    // Reintento si fallo de red/timeout
    res = null;
  }

  // 3) Si falló o vino 502/503/504, reintento rápido
  if (!res || [502, 503, 504].includes(res.status)) {
    await new Promise(r => setTimeout(r, 1200));
    res = await fetchWithTimeout(SPEEDTEST_URL, {
      timeoutMs,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  }

  // 4) Manejo de error HTTP
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Error HTTP ${res.status} ${txt || ""}`.trim());
  }

  // 5) Parseo
  try {
    return await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor");
  }
}
