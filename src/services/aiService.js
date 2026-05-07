const BASE_URL = import.meta.env.VITE_MIMO_BASE_URL;
const API_KEY = import.meta.env.VITE_MIMO_API_KEY;
const MODEL = import.meta.env.VITE_MIMO_MODEL || 'mimo-v2.5-pro';

export async function chatWithPet(petName, pokemonType, messages) {
  const systemPrompt = `Kamu adalah ${petName}, seekor Pokémon tipe ${pokemonType}.
Bicara dengan gaya yang lucu, menggemaskan, dan sesuai karaktermu.
Gunakan bahasa Indonesia yang santai. Jawaban singkat max 2-3 kalimat.
Kadang sisipi emoji yang sesuai dengan tipe Pokémonmu.
Jangan pernah keluar dari karaktermu sebagai Pokémon.`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const res = await fetch(BASE_URL, {
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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
