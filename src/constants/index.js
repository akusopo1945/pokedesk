// Shared constants for PokeDesk

// ─── Mood Constants ───
export const MOOD_EMOJIS = {
  happy: '😊',
  sad: '😢',
  sleepy: '😴',
  excited: '🤩',
  hungry: '😋',
  annoyed: '😤',
};

export const MOOD_LABELS = {
  happy: 'Senang',
  sad: 'Sedih',
  sleepy: 'Ngantuk',
  excited: 'Excited!',
  hungry: 'Lapar',
  annoyed: 'Kesal',
};

export const MOOD_COLORS = {
  happy: 'text-green-400',
  sad: 'text-blue-400',
  sleepy: 'text-purple-400',
  excited: 'text-yellow-400',
  hungry: 'text-orange-400',
  annoyed: 'text-red-400',
};

// ─── Berry Constants ───
export const BERRY_TYPES = {
  ORAN: { id: 'oran', name: 'Oran Berry', emoji: '🫐', hunger_restore: 20, happiness_bonus: 5 },
  PECHA: { id: 'pecha', name: 'Pecha Berry', emoji: '🍑', hunger_restore: 15, happiness_bonus: 8 },
  RAWST: { id: 'rawst', name: 'Rawst Berry', emoji: '🫒', hunger_restore: 25, happiness_bonus: 3 },
  SITRUS: { id: 'sitrus', name: 'Sitrus Berry', emoji: '🍋', hunger_restore: 35, happiness_bonus: 10 },
};

// ─── Task Priority Constants ───
export const PRIORITIES = [
  { id: 'high', label: 'Tinggi', color: 'bg-red-500', emoji: '🔴' },
  { id: 'medium', label: 'Sedang', color: 'bg-yellow-500', emoji: '🟡' },
  { id: 'low', label: 'Rendah', color: 'bg-green-500', emoji: '🟢' },
];

// ─── Task Status Constants ───
export const TASK_COLUMNS = [
  { id: 'todo', label: 'To Do', icon: '📋', color: 'border-blue-500' },
  { id: 'in_progress', label: 'In Progress', icon: '🔄', color: 'border-yellow-500' },
  { id: 'done', label: 'Done', icon: '✅', color: 'border-green-500' },
];

// ─── Note Color Constants ───
export const NOTE_COLORS = [
  { id: '#FACC15', name: 'Kuning' },
  { id: '#FB923C', name: 'Oranye' },
  { id: '#F87171', name: 'Merah' },
  { id: '#A78BFA', name: 'Ungu' },
  { id: '#60A5FA', name: 'Biru' },
  { id: '#34D399', name: 'Hijau' },
  { id: '#F472B6', name: 'Pink' },
];

// ─── Timer Constants ───
export const TIMER_MODES = {
  WORK: { label: 'Fokus', color: 'from-red-500 to-orange-500', ring: '#ef4444', emoji: '🔥' },
  SHORT_BREAK: { label: 'Istirahat', color: 'from-green-500 to-emerald-500', ring: '#22c55e', emoji: '☕' },
  LONG_BREAK: { label: 'Istirahat Panjang', color: 'from-blue-500 to-cyan-500', ring: '#3b82f6', emoji: '🌴' },
};

// ─── Error Messages ───
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

// ─── App Constants ───
export const APP_NAME = 'PokeDesk';
export const APP_VERSION = '0.1.0';
export const APP_AUTHOR = 'CakDoel';

// ─── Storage Keys ───
export const STORAGE_KEYS = {
  PET: 'pokedesk-pet',
  TASKS: 'pokedesk-tasks',
  NOTES: 'pokedesk-notes',
  TIMER: 'pokedesk-timer',
  ACHIEVEMENTS: 'pokedesk-achievements',
  UPDATE_CHECK: 'pokedesk-update-lastcheck',
  CHAT_PREFIX: 'pokedesk-chat-',
};
