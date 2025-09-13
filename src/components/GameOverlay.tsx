import { memo, useEffect, useState } from 'react';

interface GameOverlayProps {
  gameStarted: boolean;
  gameOver: boolean;
  onStart: () => void;
  onReset: () => void;
}

export const GameOverlay = memo(({ gameStarted, gameOver, onStart, onReset }: GameOverlayProps) => {
  const [showGo, setShowGo] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setShowGo(true);
      const timer = setTimeout(() => {
        setShowGo(false);
      }, 2000); // Show "GO!" for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [gameStarted, gameOver]);

  if (!gameStarted && !gameOver) {
    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-6xl font-bold text-yellow-400 mb-4 font-mono animate-pulse">
            TETRIS
          </div>
          <button 
            onClick={onStart}
            className="px-8 py-3 bg-yellow-400 text-black font-bold text-xl hover:bg-yellow-300 transition-colors"
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  if (gameStarted && !gameOver && showGo) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-8xl font-bold text-yellow-400 font-mono animate-pulse">
          GO!
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-6xl font-bold text-red-500 mb-4 font-mono">
            GAME OVER
          </div>
          <button 
            onClick={onReset}
            className="px-8 py-3 bg-red-500 text-white font-bold text-xl hover:bg-red-400 transition-colors"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return null;
});