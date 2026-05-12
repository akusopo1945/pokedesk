const BASE_URL = import.meta.env.VITE_MIMO_BASE_URL;
const API_KEY = import.meta.env.VITE_MIMO_API_KEY;
const MODEL = import.meta.env.VITE_MIMO_MODEL || 'mimo-v2.5-pro';

// ─── Error Classification ───
function classifyError(status, errorData) {
  const message = errorData?.error?.message || '';

  if (status === 401 || message.includes('Invalid API Key')) {
    return 'API_KEY_INVALID';
  }
  if (status === 429 || message.includes('rate limit')) {
    return 'RATE_LIMIT_EXCEEDED';
  }
  if (status === 402 || message.includes('quota')) {
    return 'QUOTA_EXCEEDED';
  }
  if (status >= 500) {
    return 'SERVER_ERROR';
  }
  return `API_ERROR_${status}`;
}

// ─── Validation ───
export function validateApiKey() {
  if (!API_KEY || API_KEY === 'your-api-key-here') {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }
  if (!BASE_URL) {
    throw new Error('BASE_URL_NOT_CONFIGURED');
  }
}

// ─── Helper Functions ───
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSystemPrompt(petName, pokemonType) {
  return `Kamu adalah ${petName}, seekor Pokémon tipe ${pokemonType}.
Bicara dengan gaya yang lucu, menggemaskan, dan sesuai karaktermu.
Gunakan bahasa Indonesia yang santai. Jawaban singkat max 2-3 kalimat.
Kadang sisipi emoji yang sesuai dengan tipe Pokémonmu.
Jangan pernah keluar dari karaktermu sebagai Pokémon.`;
}

// ─── Fetch with Timeout ───
async function fetchWithTimeout(url, options, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('REQUEST_TIMEOUT');
    }
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      throw new Error('NETWORK_ERROR');
    }
    throw err;
  }
}

// ─── Fetch with Retry ───
async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetchWithTimeout(url, options, 30000);

      if (res.ok) return res;

      // Jangan retry untuk error client (4xx)
      if (res.status >= 400 && res.status < 500) {
        const err = await res.json().catch(() => ({}));
        throw new Error(classifyError(res.status, err));
      }

      // Retry untuk server error (5xx)
      lastError = new Error(classifyError(res.status, {}));

      if (i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff: 1s, 2s, 4s
        continue;
      }
    } catch (err) {
      lastError = err;

      // Jangan retry untuk error yang sudah diklasifikasi
      if (err.message.startsWith('API_') ||
          err.message.startsWith('RATE_') ||
          err.message.startsWith('QUOTA_') ||
          err.message === 'API_KEY_NOT_CONFIGURED' ||
          err.message === 'API_KEY_INVALID' ||
          err.message === 'REQUEST_TIMEOUT' ||
          err.message === 'NETWORK_ERROR') {
        throw err;
      }

      if (i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
    }
  }

  throw lastError;
}

// ─── Main Chat Function ───
export async function chatWithPet(petName, pokemonType, messages) {
  validateApiKey();

  const systemPrompt = buildSystemPrompt(petName, pokemonType);
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetchWithRetry(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: apiMessages,
      max_tokens: 150,
      temperature: 0.8,
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─── Error Messages (for UI) ───
export const ERROR_MESSAGES = {
  API_KEY_NOT_CONFIGURED: 'API key belum dikonfigurasi',
  API_KEY_INVALID: 'API key tidak valid',
  BASE_URL_NOT_CONFIGURED: 'Base URL belum dikonfigurasi',
  RATE_LIMIT_EXCEEDED: 'Terlalu banyak permintaan, tunggu sebentar',
  QUOTA_EXCEEDED: 'Kuota habis, coba lagi nanti',
  SERVER_ERROR: 'Server sedang sibuk, coba lagi nanti',
  REQUEST_TIMEOUT: 'Waktu tunggu habis, coba lagi',
  NETWORK_ERROR: 'Koneksi internet bermasalah',
};
