/**
 * ConstructIQ API Client
 * Interfaces with FastAPI Backend on http://127.0.0.1:8000/api
 * Implements strict JSON contracts and graceful fallbacks.
 */

const API_BASE = "http://127.0.0.1:8000/api";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend offline or unreachable, using local intelligence engine:", err);
    return { status: "offline", gemini_active: false };
  }
}

// 1. Safety Monitoring
export async function getSafetyPreset() {
  const res = await fetch(`${API_BASE}/safety/preset`);
  if (!res.ok) throw new Error("Failed to load safety preset");
  return await res.json();
}

export async function analyzeSafety(payload) {
  const res = await fetch(`${API_BASE}/safety/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Safety analysis request failed");
  return await res.json();
}

// 2. Crack Detection & Analysis
export async function getCrackPreset() {
  const res = await fetch(`${API_BASE}/crack/preset`);
  if (!res.ok) throw new Error("Failed to load crack preset");
  return await res.json();
}

export async function analyzeCrack(payload) {
  const res = await fetch(`${API_BASE}/crack/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Crack analysis request failed");
  return await res.json();
}

// 3. Real Estate Valuation
export async function getValuationPreset() {
  const res = await fetch(`${API_BASE}/valuation/preset`);
  if (!res.ok) throw new Error("Failed to load valuation preset");
  return await res.json();
}

export async function estimateValuation(payload) {
  const res = await fetch(`${API_BASE}/valuation/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Valuation request failed");
  return await res.json();
}

// 4. Project Planning
export async function getPlanningPreset() {
  const res = await fetch(`${API_BASE}/planning/preset`);
  if (!res.ok) throw new Error("Failed to load planning preset");
  return await res.json();
}

export async function generateProjectPlan(payload) {
  const res = await fetch(`${API_BASE}/planning/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Planning request failed");
  return await res.json();
}

// 5. Daily Site Log
export async function getDailyLogPreset() {
  const res = await fetch(`${API_BASE}/daily-log/preset`);
  if (!res.ok) throw new Error("Failed to load daily log preset");
  return await res.json();
}

export async function processDailyLog(payload) {
  const res = await fetch(`${API_BASE}/daily-log/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Daily log request failed");
  return await res.json();
}

// 6. Weather Advisory
export async function getWeatherPreset() {
  const res = await fetch(`${API_BASE}/weather/preset`);
  if (!res.ok) throw new Error("Failed to load weather preset");
  return await res.json();
}

export async function calculateWeatherAdvisory(payload) {
  const res = await fetch(`${API_BASE}/weather/advisory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Weather advisory request failed");
  return await res.json();
}

// 7. Construction Knowledge Assistant
export async function getKnowledgePresets() {
  const res = await fetch(`${API_BASE}/knowledge/preset`);
  if (!res.ok) throw new Error("Failed to load knowledge presets");
  return await res.json();
}

export async function askKnowledgeAssistant(payload) {
  const res = await fetch(`${API_BASE}/knowledge/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Knowledge request failed");
  return await res.json();
}
