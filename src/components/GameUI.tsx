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
              variant={baseDropSpeed === value ? "default" : "outline"}
              size="sm"
              onClick={() => onSpeedChange(value)}
              disabled={gameStarted && !gameOver && !paused}
              className={`text-xs h-8 ${
                baseDropSpeed === value 
                  ? 'bg-game-accent text-background' 
                  : 'border-game-border/50 text-game-text hover:bg-game-grid/50'
              }`}
            >
              {label}
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
        <div className="mt-3 pt-2 border-t border-game-border/30">
          <div className="text-xs text-game-text/70 space-y-1 font-mono">
            <div className="text-game-accent font-bold">Speed Controls:</div>
            <div>+ Speed Up</div>
            <div>- Speed Down</div>
            <div>0 Reset Speed</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-game-border/30">
          <div className="text-xs text-game-text/60 italic">
            Speed controls work when game is paused
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-2">
        {!gameStarted ? (
          <Button 
            onClick={onStart}
            className="w-full bg-game-accent text-background hover:bg-game-accent/80 font-bold"
          >
            START GAME
          </Button>
        ) : (
          <div className="space-y-2">
            {gameStarted && !gameOver && (
              <Button 
                onClick={onPause}
                variant="outline"
                className="w-full border-game-border text-game-text hover:bg-game-grid font-bold"
              >
                {paused ? '▶️ RESUME' : '⏸️ PAUSE'}
              </Button>
            )}
            <Button 
              onClick={onReset}
              variant="outline"
              className="w-full border-game-border text-game-text hover:bg-game-grid"
            >
              RESET
            </Button>
          </div>
        )}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-center">
          <h3 className="text-lg font-bold text-destructive mb-2">GAME OVER</h3>
          <p className="text-sm text-game-text mb-3">Final Score: {score.toLocaleString()}</p>
          <Button 
            onClick={onReset}
            className="w-full bg-game-accent text-background hover:bg-game-accent/80 font-bold"
          >
            PLAY AGAIN
          </Button>
        </div>
      )}
    </div>
  );
});