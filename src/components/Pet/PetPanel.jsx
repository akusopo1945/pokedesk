import React, { useState, useEffect } from 'react';
import { usePetStore } from '../../stores/petStore';
import { EXP_REWARDS } from '../../services/expService';
import { MOOD_EMOJIS, MOOD_LABELS, MOOD_COLORS } from '../../constants';
import berriesData from '../../../data/pokemon.json';

const BERRIES = berriesData.berries;

export default function PetPanel() {
  const petName = usePetStore((s) => s.petName);
  const pokemonData = usePetStore((s) => s.pokemonData);
  const level = usePetStore((s) => s.level);
  const happiness = usePetStore((s) => s.happiness);
  const hunger = usePetStore((s) => s.hunger);
  const energy = usePetStore((s) => s.energy);
  const intelligence = usePetStore((s) => s.intelligence);
  const getMood = usePetStore((s) => s.getMood);
  const getCurrentForm = usePetStore((s) => s.getCurrentForm);
  const feed = usePetStore((s) => s.feed);
  const petAction = usePetStore((s) => s.pet);
  const addExp = usePetStore((s) => s.addExp);
  const getExpProgress = usePetStore((s) => s.getExpProgress);
  const getExpToNextLevel = usePetStore((s) => s.getExpToNextLevel);

  const [idleMessage, setIdleMessage] = useState('');
  const [showFeedMenu, setShowFeedMenu] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const form = getCurrentForm();
  const mood = getMood();

  // Idle message rotation
  useEffect(() => {
    if (!pokemonData) return;
    const messages = pokemonData.idle_messages;
    const update = () => {
      setIdleMessage(messages[Math.floor(Math.random() * messages.length)]);
    };
    update();
    const interval = setInterval(update, 8000);
    return () => clearInterval(interval);
  }, [pokemonData]);

  const handleFeed = (berry) => {
    feed(berry);
    addExp(EXP_REWARDS.FEED);
    setShowFeedMenu(false);
    showFeedback(`Memberi ${berry.name}! +${berry.hunger_restore} kenyang, +${EXP_REWARDS.FEED} EXP`);
  };

  const handlePet = () => {
    petAction();
    addExp(EXP_REWARDS.PET);
    showFeedback(`${petName} senang dielus! +${EXP_REWARDS.PET} EXP`);
  };

  const showFeedback = (text) => {
    setActionFeedback(text);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  if (!form || !pokemonData) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: pokemonData.color }}
        />
      </div>

      {/* Action feedback */}
      {actionFeedback && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-pokedex-card/90 border border-pokedex-yellow/30 rounded-xl px-5 py-2.5
            text-pokedex-yellow font-semibold text-sm shadow-xl animate-bounce">
            {actionFeedback}
          </div>
        </div>
      )}

      {/* Pet Display */}
      <div className="relative mb-6">
        <div className="text-[120px] animate-float select-none">
          {form.emoji}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
          <span className={`text-3xl`}>{MOOD_EMOJIS[mood]}</span>
        </div>
      </div>

      {/* Pet Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{petName}</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-pokedex-muted">Lv.</span>
          <span className="text-pokedex-yellow font-bold">{level}</span>
          <span className="text-pokedex-muted mx-1">•</span>
          <span className={MOOD_COLORS[mood]}>{MOOD_LABELS[mood]}</span>
        </div>

        {/* EXP Bar */}
        <div className="mt-3 w-64 mx-auto">
          <div className="flex justify-between text-xs text-pokedex-muted mb-1">
            <span>EXP</span>
            <span>{getExpToNextLevel()} lagi</span>
          </div>
          <div className="w-full h-2.5 bg-pokedex-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full stat-bar-fill"
              style={{ width: `${getExpProgress()}%` }}
            />
          </div>
        </div>
      </div>

      {/* Idle Message */}
      <div className="bg-pokedex-card/60 border border-pokedex-surface rounded-xl px-5 py-3 mb-6 max-w-sm text-center">
        <p className="text-pokedex-muted text-sm italic">"{idleMessage}"</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mb-6">
        <StatBar icon="❤️" label="Happiness" value={happiness} color="bg-green-500" />
        <StatBar icon="🍎" label="Hunger" value={hunger} color="bg-orange-500" inverted />
        <StatBar icon="⚡" label="Energy" value={energy} color="bg-blue-500" />
        <StatBar icon="🧠" label="Intelligence" value={intelligence} color="bg-purple-500" isRaw />
      </div>

      {/* Actions */}
      <div className="flex gap-3 relative">
        <button
          onClick={handlePet}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-pink-500 to-rose-500 text-white
            hover:scale-105 active:scale-95 transition-all shadow-lg shadow-pink-500/20"
        >
          <span>🤚</span> Elus
        </button>

        <div className="relative">
          <button
            onClick={() => setShowFeedMenu(!showFeedMenu)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-green-500 to-emerald-500 text-white
              hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/20"
          >
            <span>🍎</span> Beri Makan
          </button>

          {showFeedMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-pokedex-card
              border border-pokedex-surface rounded-xl p-2 shadow-2xl min-w-[180px] z-20">
              {BERRIES.map((berry) => (
                <button
                  key={berry.id}
                  onClick={() => handleFeed(berry)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                    hover:bg-pokedex-surface transition-colors text-left"
                >
                  <span className="text-xl">{berry.emoji}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{berry.name}</div>
                    <div className="text-pokedex-muted text-xs">
                      +{berry.hunger_restore} kenyang · +{berry.happiness_bonus} senang
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBar({ icon, label, value, color, inverted, isRaw }) {
  const displayValue = isRaw ? value : Math.round(value);
  const barWidth = isRaw ? Math.min(value, 100) : value;

  return (
    <div className="bg-pokedex-card/60 border border-pokedex-surface rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-pokedex-muted">
          {icon} {label}
        </span>
        <span className="text-xs font-bold text-white">
          {isRaw ? displayValue : `${displayValue}%`}
        </span>
      </div>
      {!isRaw && (
        <div className="w-full h-2 bg-pokedex-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full stat-bar-fill ${color} ${inverted ? '' : ''}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      )}
    </div>
  );
}
