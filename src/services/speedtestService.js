// src/services/speedtestService.js

// Limpiamos barras al final y armamos endpoints correctos
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

// Fetch con timeout para que no quede colgado
async function fetchWithTimeout(url, { timeoutMs = 60000, ...opts } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}

export async function ejecutarSpeedtest({ timeoutMs = 60000 } = {}) {
  if (!BASE) throw new Error("Falta VITE_SPEEDTEST_API_URL en el frontend");

  // “Despierta” el backend (Render a veces duerme)
  await wakeBackend();

  const res = await fetchWithTimeout(SPEEDTEST_URL, { method: "GET" });
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text || "error al ejecutar speedtest"}`);
  }

  // Si por error pegamos al /health, corta acá con mensaje claro
  if (text.trim() === "ok" || !/application\/json/i.test(contentType)) {
    throw new Error("El backend respondió 'ok' (health). Revisá VITE_SPEEDTEST_API_URL y que apunte al BASE, no a /health.");
  }

  // Parseo seguro
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no es JSON válido desde /api/speedtest");
  }
}
