import { memo } from 'react';
import { Piece } from '../types/tetris';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { PIECES } from '../utils/tetrisShapes';

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
  onSpeedChange
}: GameUIProps) => {
  const getCellClasses = (cellType: string, hasBlock: boolean) => {
    const baseClasses = "w-4 h-4 rounded-[2px] transition-all duration-100 relative overflow-hidden";
    
    if (!hasBlock) {
      return `${baseClasses} bg-game-grid border border-game-border/20`;
    }
    
    switch (cellType) {
      case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-cyan-400/30`;
      case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-yellow-400/30`;
      case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-purple-400/30`;
      case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-green-400/30`;
      case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-red-400/30`;
      case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)]`;
      case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] border border-orange-400/30`;
      default: return `${baseClasses} bg-game-grid border border-game-border/20`;
    }
  };

  return (
    <div className="flex flex-col gap-4 min-w-[200px]">
      {/* Score Section */}
      <div className="bg-game-board border border-game-border rounded-lg p-4 text-game-text">
        <h2 className="text-lg font-bold text-game-accent mb-2">SCORE</h2>
        <div className="space-y-1 font-mono">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="text-game-score font-bold">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Level:</span>
            <span className="text-game-accent">{level}</span>
          </div>
          <div className="flex justify-between">
            <span>Lines:</span>
            <span className="text-game-accent">{linesCleared}</span>
          </div>
        </div>
      </div>

      {/* Speed Editor */}
      <div className="bg-game-board border border-game-border rounded-lg p-4 text-game-text">
        <h2 className="text-lg font-bold text-game-accent mb-3">SPEED</h2>
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
              className={`text-xs h-8 font-medium button-ripple hover-lift focus-ring-enhanced relative overflow-hidden ${
                baseDropSpeed === value 
                  ? 'speed-button-active' 
                  : ''
              }`}
            >
              <span className="relative z-10">{label}</span>
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
          <h3 className="text-sm font-bold text-game-accent mb-2">NEXT</h3>
          <div className="flex justify-center">
            <div className="grid gap-[1px] bg-game-grid/50 p-2 rounded" 
                 style={{ gridTemplateColumns: `repeat(4, 1fr)` }}>
              {Array.from({ length: 16 }, (_, i) => {
                const y = Math.floor(i / 4);
                const x = i % 4;
                const shape = PIECES[nextPiece.type].shape;
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
        <h3 className="text-sm font-bold text-game-accent mb-2">CONTROLS</h3>
        <div className="text-xs text-game-text space-y-1 font-mono">
          <div>← → Move</div>
          <div>↑ Rotate</div>
          <div>↓ Soft Drop</div>
          <div>SPACE Hard Drop</div>
          <div>C Hold Piece</div>
          <div>P Pause/Resume</div>
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
            <span className="relative z-10 flex items-center gap-2">
              🎮 START GAME
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
                <span className="relative z-10 flex items-center gap-2">
                  {paused ? '▶️ RESUME' : '⏸️ PAUSE'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-game-accent/10 via-game-accent/20 to-game-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            )}
            <Button 
              onClick={onReset}
              variant="gameOutline"
              className="w-full button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                🔄 RESET
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-destructive/20 to-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        )}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-center animate-pulse">
          <h3 className="text-lg font-bold text-destructive mb-2">GAME OVER</h3>
          <p className="text-sm text-game-text mb-4">Final Score: {score.toLocaleString()}</p>
          <Button 
            onClick={onReset}
            variant="gameAccent"
            size="lg"
            className="w-full game-button-glow button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              🎯 PLAY AGAIN
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Button>
        </div>
      )}
    </div>
  );
});