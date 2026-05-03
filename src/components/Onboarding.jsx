import React, { useState } from 'react';
import { usePetStore } from '../stores/petStore';
import startersData from '../../data/pokemon.json';

const STARTERS = startersData.starters;

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedStarter, setSelectedStarter] = useState(null);
  const [petName, setPetName] = useState('');
  const initialize = usePetStore((s) => s.initialize);

  const handleSelectStarter = (pokemon) => {
    setSelectedStarter(pokemon);
    setStep(1);
  };

  const handleStart = () => {
    if (!petName.trim()) return;
    initialize(petName.trim(), selectedStarter);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-pokedex-bg noise-overlay">
      <div className="text-center max-w-2xl px-6">
        {step === 0 && (
          <div className="animate-fade-in">
            <div className="text-6xl mb-6">🎮</div>
            <h1 className="pixel-text text-3xl text-pokedex-yellow mb-4">
              PokeDesk
            </h1>
            <p className="text-pokedex-muted text-lg mb-2">
              Selamat datang, Trainer!
            </p>
            <p className="text-pokedex-muted text-sm mb-10">
              Pilih Pokémon pertamamu untuk menemanimu sehari-hari.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {STARTERS.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handleSelectStarter(pokemon)}
                  className="group bg-pokedex-card border border-pokedex-surface rounded-2xl p-6
                    hover:border-pokedex-yellow hover:scale-105 transition-all duration-300
                    cursor-pointer"
                >
                  <div className="text-6xl mb-4 group-hover:animate-bounce-slow">
                    {pokemon.emoji}
                  </div>
                  <h3 className="text-white font-bold text-lg">{pokemon.name}</h3>
                  <span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase"
                    style={{ backgroundColor: pokemon.color + '30', color: pokemon.color }}
                  >
                    {pokemon.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && selectedStarter && (
          <div className="animate-fade-in">
            <div className="text-7xl mb-6 animate-float">
              {selectedStarter.emoji}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Beri nama untuk {selectedStarter.name}-mu!
            </h2>
            <p className="text-pokedex-muted text-sm mb-8">
              Nama yang bagus akan membuat ikatan kalian lebih kuat.
            </p>

            <div className="max-w-xs mx-auto mb-8">
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Nama Pokémon..."
                maxLength={20}
                className="w-full bg-pokedex-card border-2 border-pokedex-surface rounded-xl
                  px-5 py-3 text-white text-center text-lg font-semibold
                  focus:border-pokedex-yellow focus:outline-none transition-colors
                  placeholder:text-pokedex-muted"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && petName.trim() && handleStart()}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setStep(0); setSelectedStarter(null); }}
                className="px-6 py-3 rounded-xl text-pokedex-muted hover:text-white
                  border border-pokedex-surface hover:border-pokedex-muted transition-all"
              >
                Kembali
              </button>
              <button
                onClick={handleStart}
                disabled={!petName.trim()}
                className="px-8 py-3 rounded-xl font-bold text-pokedex-bg
                  bg-pokedex-yellow hover:bg-yellow-300 transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mulai Petualangan! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
