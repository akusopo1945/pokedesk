import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { usePetStore } from '../../stores/petStore';
import { chatWithPet, ERROR_MESSAGES } from '../../services/aiService';
import { EXP_REWARDS } from '../../services/expService';
import { MOOD_EMOJIS, MOOD_LABELS, BERRY_TYPES, STORAGE_KEYS } from '../../constants';
import berriesData from '../../../data/pokemon.json';

const BERRIES = berriesData.berries;
const ORAN_BERRY = BERRIES.find((b) => b.id === 'oran');

// ─── Typing Indicator Component ───
function TypingIndicator({ emoji }) {
  return (
    <div className="flex justify-start">
      <div className="bg-pokedex-surface/60 text-pokedex-muted px-3 py-2
        rounded-xl rounded-bl-sm text-xs flex items-center gap-1.5">
        <span className="text-lg">{emoji}</span>
        <div className="flex gap-0.5">
          <span
            className="w-1.5 h-1.5 bg-pokedex-muted rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-pokedex-muted rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-pokedex-muted rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───
export default function PetWidget() {
  const petName = usePetStore((s) => s.petName);
  const pokemonData = usePetStore((s) => s.pokemonData);
  const level = usePetStore((s) => s.level);
  const getMood = usePetStore((s) => s.getMood);
  const getCurrentForm = usePetStore((s) => s.getCurrentForm);
  const getExpProgress = usePetStore((s) => s.getExpProgress);
  const feed = usePetStore((s) => s.feed);
  const petAction = usePetStore((s) => s.pet);
  const addExp = usePetStore((s) => s.addExp);

  const [mode, setMode] = useState('orb'); // orb | expand | chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const collapseTimeoutRef = useRef(null);

  const form = getCurrentForm();
  const mood = getMood();
  const expProgress = getExpProgress();

  // ─── Conversation Storage Key ───
  const conversationKey = useMemo(
    () => `${STORAGE_KEYS.CHAT_PREFIX}${pokemonData?.id || 'default'}`,
    [pokemonData?.id]
  );

  // ─── Load Conversation on Mount ───
  useEffect(() => {
    const saved = localStorage.getItem(conversationKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, [conversationKey]);

  // ─── Save Conversation on Change ───
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(conversationKey, JSON.stringify(messages));
    }
  }, [messages, conversationKey]);

  // ─── Clear History ───
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(conversationKey);
  }, [conversationKey]);

  // ─── Resize window when mode changes ───
  useEffect(() => {
    const sizes = {
      orb: [104, 104],
      expand: [260, 180],
      chat: [300, 420],
    };
    const [w, h] = sizes[mode];
    window.electronAPI?.resizePet(w, h);
  }, [mode]);

  // ─── Scroll chat to bottom ───
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Focus input when entering chat mode ───
  useEffect(() => {
    if (mode === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

  // ─── IPC listeners ───
  useEffect(() => {
    window.electronAPI?.onPetDoFeed(() => handleFeed());
    window.electronAPI?.onPetDoPet(() => handlePet());
    window.electronAPI?.onPetDoChat(() => setMode('chat'));
  }, []);

  // ─── ESC to close chat ───
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && mode === 'chat') {
        setMode('expand');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode]);

  // ─── Handlers ───
  const showFeedback = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleFeed = useCallback(() => {
    feed(ORAN_BERRY);
    addExp(EXP_REWARDS.FEED);
    showFeedback(`🍎 +${ORAN_BERRY.hunger_restore} kenyang`);
  }, [feed, addExp]);

  const handlePet = useCallback(() => {
    petAction();
    addExp(EXP_REWARDS.PET);
    showFeedback(`🤚 ${petName} senang!`);
  }, [petAction, addExp, petName]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const reply = await chatWithPet(
        petName,
        pokemonData?.type || 'normal',
        newMessages.slice(-10)
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const errorMessage = ERROR_MESSAGES[err.message] || 'Terjadi kesalahan';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: errorMessage, isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    window.electronAPI?.requestPetMenu();
  };

  if (!form || !pokemonData) return null;

  // ─── Recent messages for expand mode ───
  const recentMessages = messages.slice(-2);

  // ─── ORB MODE ───
  if (mode === 'orb') {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseEnter={() => {
          clearTimeout(collapseTimeoutRef.current);
          hoverTimeoutRef.current = setTimeout(() => setMode('expand'), 200);
        }}
        onContextMenu={handleContextMenu}
        style={{ WebkitAppRegion: 'drag' }}
      >
        <div
          className="w-20 h-20 rounded-full flex flex-col items-center justify-center
            animate-float select-none transition-all duration-300 hover:scale-110"
          style={{
            background: `radial-gradient(circle, ${pokemonData.color}30, ${pokemonData.color}10)`,
            boxShadow: `0 0 20px ${pokemonData.color}60, 0 0 6px ${pokemonData.color}40`,
            border: `2px solid ${pokemonData.color}50`,
          }}
        >
          <span className="text-5xl">{form.emoji}</span>
          <div
            className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: pokemonData.color + '30',
              color: pokemonData.color,
            }}
          >
            Lv.{level}
          </div>
        </div>
        {feedback && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
              bg-pokedex-card/90 border border-pokedex-surface rounded-lg px-2 py-1
              text-[10px] text-pokedex-yellow shadow-lg"
          >
            {feedback}
          </div>
        )}
      </div>
    );
  }

  // ─── EXPAND MODE ───
  if (mode === 'expand') {
    return (
      <div
        className="w-full h-full p-2"
        onMouseLeave={() => {
          clearTimeout(hoverTimeoutRef.current);
          collapseTimeoutRef.current = setTimeout(() => setMode('orb'), 400);
        }}
        onMouseEnter={() => {
          clearTimeout(collapseTimeoutRef.current);
        }}
        onContextMenu={handleContextMenu}
      >
        <div
          className="w-full h-full rounded-xl p-3 flex flex-col gap-2"
          style={{
            background: `linear-gradient(135deg, ${pokemonData.color}15, #1e293b90)`,
            border: `1px solid ${pokemonData.color}30`,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 4px 20px ${pokemonData.color}20`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'drag' }}>
            <span className="text-3xl">{form.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-bold truncate">{petName}</div>
              <div className="flex items-center gap-1">
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: pokemonData.color + '30',
                    color: pokemonData.color,
                  }}
                >
                  Lv.{level}
                </span>
                <span className="text-sm">{MOOD_EMOJIS[mood]}</span>
                <span className="text-pokedex-muted text-xs">{MOOD_LABELS[mood]}</span>
              </div>
            </div>
          </div>

          {/* EXP Bar */}
          <div className="w-full h-2 bg-pokedex-surface rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${expProgress}%`,
                background: `linear-gradient(90deg, ${pokemonData.color}, ${pokemonData.color}80)`,
              }}
            />
          </div>

          {/* Recent Chat Preview */}
          {recentMessages.length > 0 && (
            <div className="min-h-0 overflow-hidden">
              <div className="text-[9px] text-pokedex-muted mb-1">Chat terakhir:</div>
              <div className="space-y-0.5 max-h-8 overflow-hidden">
                {recentMessages.map((msg, i) => (
                  <div key={i} className="text-[9px] text-pokedex-muted truncate">
                    {msg.role === 'user' ? '👤' : form.emoji} {msg.content}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1.5" style={{ WebkitAppRegion: 'no-drag' }}>
            <button
              onClick={handleFeed}
              className="flex-1 text-[10px] py-1.5 rounded-lg bg-pokedex-surface/50
                hover:bg-pokedex-surface text-pokedex-muted hover:text-white transition-colors"
            >
              🍎 Feed
            </button>
            <button
              onClick={handlePet}
              className="flex-1 text-[10px] py-1.5 rounded-lg bg-pokedex-surface/50
                hover:bg-pokedex-surface text-pokedex-muted hover:text-white transition-colors"
            >
              🤚 Elus
            </button>
            <button
              onClick={() => setMode('chat')}
              className="flex-1 text-[10px] py-1.5 rounded-lg bg-pokedex-surface/50
                hover:bg-pokedex-surface text-pokedex-muted hover:text-white transition-colors"
            >
              💬 Chat
            </button>
          </div>
        </div>

        {feedback && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
              bg-pokedex-card/90 border border-pokedex-surface rounded-lg px-2 py-1
              text-[10px] text-pokedex-yellow shadow-lg"
          >
            {feedback}
          </div>
        )}
      </div>
    );
  }

  // ─── CHAT MODE ───
  return (
    <div
      className="w-full h-full p-2"
      onContextMenu={handleContextMenu}
    >
      <div
        className="w-full h-full rounded-xl flex flex-col overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${pokemonData.color}12, #0f172af0)`,
          border: `1px solid ${pokemonData.color}30`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 8px 32px ${pokemonData.color}15`,
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 border-b border-pokedex-surface/50"
          style={{ WebkitAppRegion: 'drag' }}
        >
          <span className="text-xl">{form.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-bold truncate">{petName}</span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: pokemonData.color + '30',
                  color: pokemonData.color,
                }}
              >
                Lv.{level}
              </span>
            </div>
            <div className="text-pokedex-muted text-xs">{MOOD_LABELS[mood]}</div>
          </div>
          {/* Clear History Button */}
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-pokedex-muted hover:text-white text-xs w-6 h-6
                flex items-center justify-center rounded hover:bg-pokedex-surface/50 transition-colors"
              title="Hapus riwayat chat"
              style={{ WebkitAppRegion: 'no-drag' }}
            >
              🗑️
            </button>
          )}
          <button
            onClick={() => setMode('expand')}
            className="text-pokedex-muted hover:text-white text-xs w-6 h-6
              flex items-center justify-center rounded hover:bg-pokedex-surface/50 transition-colors"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            ✕
          </button>
        </div>

        {/* Quick Actions */}
        <div
          className="flex gap-1.5 px-2 py-2 border-b border-pokedex-surface/30"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <button
            onClick={handlePet}
            className="text-xs px-2.5 py-1 rounded-full bg-pokedex-surface/40
              hover:bg-pokedex-surface text-pokedex-muted hover:text-white transition-colors"
          >
            🤚 Elus
          </button>
          <button
            onClick={handleFeed}
            className="text-xs px-2.5 py-1 rounded-full bg-pokedex-surface/40
              hover:bg-pokedex-surface text-pokedex-muted hover:text-white transition-colors"
          >
            🍎 Feed
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          {messages.length === 0 && (
            <div className="text-center text-pokedex-muted text-xs py-4">
              Tanya apa aja ke {petName}! 💬
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-1.5 rounded-xl text-xs leading-relaxed ${
                  msg.isError
                    ? 'bg-red-500/20 text-red-400 rounded-bl-sm'
                    : msg.role === 'user'
                      ? 'bg-pokedex-yellow/20 text-pokedex-yellow rounded-br-sm'
                      : 'bg-pokedex-surface/60 text-pokedex-text rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' && !msg.isError && (
                  <span className="mr-1">{form.emoji}</span>
                )}
                {msg.isError && <span className="mr-1">⚠️</span>}
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <TypingIndicator emoji={form.emoji} />}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-3 py-2 border-t border-pokedex-surface/50"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ketik pesan..."
              className="flex-1 bg-pokedex-surface/40 border border-pokedex-surface/50
                rounded-lg px-3 py-2 text-xs text-white
                focus:border-pokedex-yellow/50 focus:outline-none transition-colors
                placeholder:text-pokedex-muted"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-8 h-8 rounded-lg bg-pokedex-yellow/20 hover:bg-pokedex-yellow/30
                text-pokedex-yellow flex items-center justify-center text-sm
                disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
