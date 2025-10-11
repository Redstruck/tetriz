import { memo } from 'react';
import { Play } from 'lucide-react';
import { Piece } from '../types/tetris';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { getPieceData } from '../utils/tetrisShapes';

// Custom Pause icon with perfectly balanced lines
const PauseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="4" height="16" x="6" y="4" rx="1" />
    <rect width="4" height="16" x="14" y="4" rx="1" />
  </svg>
);

// Custom Reset icon with circular arrow
const ResetIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

interface GameUIProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: Piece | null;
  gameOver: boolean;
  gameStarted: boolean;
  paused: boolean;
  baseDropSpeed: number;
  onStart: () => void;
  onReset: () => void;
  onPause: () => void;
  onSpeedChange: (speed: number) => void;
  gameMode?: 'regular' | 'extra' | 'speedrun';
}

export const GameUI = memo(({ 
  score, 
  level, 
  linesCleared, 
  nextPiece, 
  gameOver, 
  gameStarted,
  paused,
  baseDropSpeed,
  onStart,
  onReset,
  onPause,
  onSpeedChange,
  gameMode
}: GameUIProps) => {
  const getCellClasses = (cellType: string, hasBlock: boolean) => {
    const baseClasses = "w-4 h-4 rounded-[2px] transition-all duration-100 relative overflow-hidden";
    
    if (!hasBlock) {
      return `${baseClasses} bg-game-grid border border-game-border/20`;
    }
    
    switch (cellType) {
      // Regular pieces
      case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-cyan-400/30`;
      case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-yellow-400/30`;
      case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-purple-400/30`;
      case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-green-400/30`;
      case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-red-400/30`;
      case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)]`;
      case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-orange-400/30`;
      
      // Extra pieces - use similar colors to their base variants
      case 'I5': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-cyan-400/30`;
      case 'L3': case 'L4': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-orange-400/30`;
      case 'J3': case 'J4': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)]`;
      case 'T3': case 'T4': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-purple-400/30`;
      case 'U': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-yellow-400/30`;
      case 'F': case 'W': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-green-400/30`;
      case 'Y': case 'N': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-red-400/30`;
      case 'P': return `${baseClasses} bg-gradient-to-br from-tetris-p via-tetris-p to-pink-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-pink-400/30`;
      case 'H': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-purple-400/30`;
      case 'B': return `${baseClasses} bg-gradient-to-br from-tetris-b via-tetris-b to-amber-800 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-amber-600/30`;
      
      default: return `${baseClasses} bg-game-grid border border-game-border/20`;
    }
  };

  return (
    <div className="flex flex-col gap-4 min-w-[200px]">
      {/* Score Section - Hidden in speedrun mode */}
      {gameMode !== 'speedrun' && (
        <div className="bg-game-board border border-game-border rounded-lg p-4 text-game-text">
          <h2 className="text-lg font-retro font-bold text-game-accent mb-2 tracking-wider text-retro-glow">SCORE</h2>
          <div className="space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="font-game text-sm">Score:</span>
              <span className="text-game-score font-bold font-mono tracking-wider">{score.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-game text-sm">Level:</span>
              <span className="text-game-accent font-bold font-mono">{level}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-game text-sm">Lines:</span>
              <span className="text-game-accent font-bold font-mono">{linesCleared}</span>
            </div>
          </div>
        </div>
      )}

      {/* Speed Editor */}
      <div className="bg-game-board border border-game-border rounded-lg p-4 text-game-text">
        <h2 className="text-lg font-retro font-bold text-game-accent mb-3 tracking-wider text-retro-glow">SPEED</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Slow', value: 1500 },
            { label: 'Normal', value: 1000 },
            { label: 'Fast', value: 500 }
          ].map(({ label, value }) => (
            <Button
              key={label}
              variant={baseDropSpeed === value ? "gameSelected" : "gameOutline"}
              size="sm"
              onClick={() => onSpeedChange(value)}
              disabled={gameStarted && !gameOver && !paused}
              className={`text-xs h-8 font-game font-medium button-ripple hover-lift focus-ring-enhanced relative overflow-hidden tracking-wide ${
                baseDropSpeed === value 
                  ? 'speed-button-active' 
                  : ''
              }`}
            >
              <span className="relative z-10 font-game tracking-wider">{label}</span>
              {baseDropSpeed === value && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Next Piece */}
      {nextPiece && (
        <div className="bg-game-board border border-game-border rounded-lg p-4">
          <h3 className="text-sm font-retro font-bold text-game-accent mb-2 tracking-wider text-retro-glow">NEXT</h3>
          <div className="flex justify-center">
            <div className="grid gap-[1px] bg-game-grid/50 p-2 rounded" 
                 style={{ gridTemplateColumns: `repeat(6, 1fr)` }}>
              {Array.from({ length: 36 }, (_, i) => {
                const y = Math.floor(i / 6);
                const x = i % 6;
                const shape = getPieceData(nextPiece.type).shape;
                const hasBlock = shape[y] && shape[y][x] === 1;
                
                return (
                  <div
                    key={i}
                    className={cn(getCellClasses(nextPiece.type, hasBlock))}
                  >
                    {hasBlock && (
                      <div className="absolute inset-[1px] rounded-[1px] bg-gradient-to-br from-white/20 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-game-board border border-game-border rounded-lg p-4">
        <h3 className="text-sm font-retro font-bold text-game-accent mb-2 tracking-wider text-retro-glow">CONTROLS</h3>
        <div className="text-xs text-game-text space-y-1 font-mono">
          <div className="font-mono">← → Move</div>
          <div className="font-mono">↑ Rotate</div>
          <div className="font-mono">↓ Soft Drop</div>
          <div className="font-mono">SPACE Hard Drop</div>
          <div className="font-mono">C Hold Piece</div>
          <div className="font-mono">P Pause/Resume</div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-3">
        {!gameStarted ? (
          <Button 
            onClick={onStart}
            variant="gameAccent"
            size="lg"
            className="w-full game-button-glow button-pulse button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2 font-retro tracking-wider">
              START GAME
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Button>
        ) : (
          <div className="space-y-3">
            {gameStarted && !gameOver && (
              <Button 
                onClick={onPause}
                variant="gameOutline"
                size="lg"
                className="w-full font-bold button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2 font-game tracking-wider">
                  {paused ? <Play className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                  {paused ? 'RESUME' : 'PAUSE'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-game-accent/10 via-game-accent/20 to-game-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            )}
            <Button 
              onClick={onReset}
              variant="gameOutline"
              className="w-full button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2 font-game tracking-wider">
                <ResetIcon className="w-4 h-4" />
                RESET
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-destructive/20 to-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        )}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-center animate-pulse">
          <h3 className="text-lg font-retro font-bold text-destructive mb-2 tracking-wider text-glow">GAME OVER</h3>
          <p className="text-sm text-game-text mb-4 font-mono">Final Score: {score.toLocaleString()}</p>
          <Button 
            onClick={onReset}
            variant="gameAccent"
            size="lg"
            className="w-full game-button-glow button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2 font-retro tracking-wider">
              PLAY AGAIN
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Button>
        </div>
      )}
    </div>
  );
});