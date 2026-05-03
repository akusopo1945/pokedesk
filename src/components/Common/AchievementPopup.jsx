import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementPopup({ achievement, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        className="fixed top-6 left-1/2 z-50"
      >
        <div className="bg-gradient-to-r from-yellow-600/90 to-amber-500/90 backdrop-blur-md
          border border-yellow-400/50 rounded-2xl px-6 py-4 shadow-2xl
          flex items-center gap-4 min-w-[300px]">
          <div className="text-4xl">{achievement.icon}</div>
          <div>
            <div className="text-yellow-200 text-xs font-bold uppercase tracking-wider">
              Achievement Unlocked!
            </div>
            <div className="text-white font-bold text-lg">{achievement.name}</div>
            <div className="text-yellow-100/80 text-xs">{achievement.desc}</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-yellow-200/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
