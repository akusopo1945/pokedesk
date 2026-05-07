import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadUpdate } from '../../services/updateService';

export default function UpdateBanner({ updateInfo, onDismiss }) {
  const [status, setStatus] = useState('idle'); // idle | downloading | ready | error
  const [progress, setProgress] = useState(0);

  if (!updateInfo?.hasUpdate) return null;

  const handleDownload = async () => {
    setStatus('downloading');
    setProgress(0);

    try {
      const blob = await downloadUpdate(updateInfo.downloadUrls, (p) => {
        setProgress(p);
      });

      // Konversi Blob ke ArrayBuffer untuk IPC
      const buffer = await blob.arrayBuffer();
      const result = await window.electronAPI.installUpdate(buffer);

      if (result.success) {
        setStatus('ready');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="flex items-center gap-2"
      >
        {status === 'idle' && (
          <div className="flex items-center gap-2 bg-pokedex-yellow/10 border border-pokedex-yellow/30
            rounded-lg px-3 py-1.5 text-xs">
            <span className="animate-pulse">🔄</span>
            <span className="text-pokedex-yellow font-medium">
              v{updateInfo.version} tersedia!
            </span>
            <button
              onClick={handleDownload}
              className="bg-pokedex-yellow/20 hover:bg-pokedex-yellow/30 text-pokedex-yellow
                px-2.5 py-0.5 rounded-md font-semibold transition-colors"
            >
              Update
            </button>
            <button
              onClick={onDismiss}
              className="text-pokedex-muted hover:text-white transition-colors ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {status === 'downloading' && (
          <div className="flex items-center gap-2 bg-pokedex-yellow/10 border border-pokedex-yellow/30
            rounded-lg px-3 py-1.5 text-xs">
            <span className="animate-spin">⏳</span>
            <span className="text-pokedex-yellow">Downloading {progress}%</span>
            <div className="w-20 h-1.5 bg-pokedex-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-pokedex-yellow rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30
            rounded-lg px-3 py-1.5 text-xs">
            <span>✅</span>
            <span className="text-green-400 font-medium">Siap diinstall!</span>
            <button
              onClick={() => window.electronAPI.quit()}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400
                px-2.5 py-0.5 rounded-md font-semibold transition-colors"
            >
              Restart
            </button>
            <button
              onClick={onDismiss}
              className="text-pokedex-muted hover:text-white transition-colors ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30
            rounded-lg px-3 py-1.5 text-xs">
            <span>❌</span>
            <span className="text-red-400">Gagal download</span>
            <button
              onClick={handleDownload}
              className="text-pokedex-yellow hover:underline transition-colors"
            >
              Coba lagi
            </button>
            <button
              onClick={onDismiss}
              className="text-pokedex-muted hover:text-white transition-colors ml-1"
            >
              ✕
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
