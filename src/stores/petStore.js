import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EXP_BASE = 100;
const EXP_EXPONENT = 1.5;
const STAT_DECAY_INTERVAL = 60000; // 1 menit
const STAT_DECAY_AMOUNT = 1;

function expForLevel(level) {
  return Math.floor(EXP_BASE * Math.pow(level, EXP_EXPONENT));
}

function getEvolutionStage(pokemonData, level) {
  const evolutions = pokemonData.evolutions;
  let stage = 0;
  for (let i = evolutions.length - 1; i >= 0; i--) {
    if (level >= evolutions[i].level) {
      stage = evolutions[i].stage;
      break;
    }
  }
  return stage;
}

function getCurrentForm(pokemonData, level) {
  const stage = getEvolutionStage(pokemonData, level);
  return pokemonData.evolutions[stage];
}

export const usePetStore = create(
  persist(
    (set, get) => ({
      // State
      isInitialized: false,
      petName: '',
      pokemonId: null,
      pokemonData: null,
      level: 1,
      exp: 0,
      happiness: 80,
      hunger: 20,
      energy: 100,
      intelligence: 0,
      evolutionStage: 0,
      feedCount: 0,
      lastInteraction: Date.now(),
      createdAt: null,

      // Computed
      getExpToNextLevel: () => {
        const { level, exp } = get();
        return expForLevel(level) - exp;
      },
      getExpProgress: () => {
        const { level, exp } = get();
        const needed = expForLevel(level);
        return Math.min((exp / needed) * 100, 100);
      },
      getCurrentForm: () => {
        const { pokemonData, level } = get();
        if (!pokemonData) return null;
        return getCurrentForm(pokemonData, level);
      },
      getMood: () => {
        const { happiness, hunger, energy } = get();
        if (hunger > 80) return 'hungry';
        if (happiness < 30) return 'sad';
        if (energy < 20) return 'sleepy';
        if (happiness > 80 && energy > 60) return 'happy';
        if (happiness > 90) return 'excited';
        return 'happy';
      },

      // Actions
      initialize: (petName, starterPokemon) => {
        set({
          isInitialized: true,
          petName,
          pokemonId: starterPokemon.id,
          pokemonData: starterPokemon,
          level: 1,
          exp: 0,
          happiness: 80,
          hunger: 20,
          energy: 100,
          intelligence: 0,
          evolutionStage: 0,
          feedCount: 0,
          lastInteraction: Date.now(),
          createdAt: Date.now(),
        });
      },

      addExp: (amount) => {
        const { level, exp, pokemonData, evolutionStage } = get();
        let newExp = exp + amount;
        let newLevel = level;
        let newStage = evolutionStage;
        let leveledUp = false;
        let evolved = false;

        while (newExp >= expForLevel(newLevel)) {
          newExp -= expForLevel(newLevel);
          newLevel++;
          leveledUp = true;
        }

        if (pokemonData) {
          const newEvolutionStage = getEvolutionStage(pokemonData, newLevel);
          if (newEvolutionStage > evolutionStage) {
            newStage = newEvolutionStage;
            evolved = true;
          }
        }

        set({
          level: newLevel,
          exp: newExp,
          evolutionStage: newStage,
          lastInteraction: Date.now(),
        });

        return { leveledUp, evolved, newLevel, newStage };
      },

      feed: (berry) => {
        const { hunger, happiness, feedCount } = get();
        set({
          hunger: Math.max(0, hunger - berry.hunger_restore),
          happiness: Math.min(100, happiness + berry.happiness_bonus),
          feedCount: feedCount + 1,
          lastInteraction: Date.now(),
        });
      },

      pet: () => {
        const { happiness } = get();
        set({
          happiness: Math.min(100, happiness + 5),
          lastInteraction: Date.now(),
        });
      },

      decayStats: () => {
        const { hunger, happiness, energy, isInitialized } = get();
        if (!isInitialized) return;
        set({
          hunger: Math.min(100, hunger + STAT_DECAY_AMOUNT * 0.5),
          happiness: Math.max(0, happiness - STAT_DECAY_AMOUNT * 0.3),
          energy: Math.max(0, energy - STAT_DECAY_AMOUNT * 0.2),
        });
      },

      restoreEnergy: (amount) => {
        const { energy } = get();
        set({ energy: Math.min(100, energy + amount) });
      },

      addIntelligence: (amount) => {
        const { intelligence } = get();
        set({ intelligence: intelligence + amount });
      },
    }),
    {
      name: 'pokedesk-pet',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        petName: state.petName,
        pokemonId: state.pokemonId,
        pokemonData: state.pokemonData,
        level: state.level,
        exp: state.exp,
        happiness: state.happiness,
        hunger: state.hunger,
        energy: state.energy,
        intelligence: state.intelligence,
        evolutionStage: state.evolutionStage,
        feedCount: state.feedCount,
        lastInteraction: state.lastInteraction,
        createdAt: state.createdAt,
      }),
    }
  )
);
