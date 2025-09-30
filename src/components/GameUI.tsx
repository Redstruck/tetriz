import { memo } from 'react';
import { Piece } from '../types/tetris';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { cn } from '../lib/utils';
import { PIECES } from '../utils/tetrisShapes';

interface GameUIProps {
  score: number;
  level: number;
  linesCleared: number;
  nextPiece: Piece | null;
  gameOver: boolean;
  gameStarted: boolean;
  baseDropSpeed: number;
  onStart: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const GameUI = memo(({ 
  score, 
  level, 
  linesCleared, 
  nextPiece, 
  gameOver, 
  gameStarted,
  baseDropSpeed,
  onStart,
  onReset,
  onSpeedChange
}: GameUIProps) => {
  const getSpeedLabel = (speed: number): string => {
    if (speed <= 300) return 'Lightning Fast ⚡';
    if (speed <= 500) return 'Very Fast 🚀';
    if (speed <= 700) return 'Fast 🏃';
    if (speed <= 1000) return 'Normal 👍';
    if (speed <= 1300) return 'Moderate 🚶';
    if (speed <= 1600) return 'Slow 🐌';
    return 'Very Slow 🐢';
  };

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
        <h2 className="text-lg font-bold text-game-accent mb-3">DROP SPEED</h2>
        <div className="space-y-4">
          {/* Speed Display with Preview */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-game-accent font-mono mb-1">
              {baseDropSpeed}ms
            </div>
            <div className="text-xs text-game-text/70">
              {getSpeedLabel(baseDropSpeed)}
            </div>
            
            {/* Speed Preview Animation */}
            <div className="flex justify-center">
              <div className="relative w-16 h-12 bg-game-grid/30 rounded border border-game-border/30 overflow-hidden">
                <div 
                  className="absolute w-3 h-3 bg-game-accent rounded-sm animate-bounce"
                  style={{ 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    animationDuration: `${Math.max(0.3, baseDropSpeed / 1000)}s`,
                    animationTimingFunction: 'ease-in'
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-game-text/50">
                  Preview
                </div>
              </div>
            </div>
          </div>

          {/* Speed Presets */}
          <div className="space-y-2">
            <div className="text-xs text-game-text/80 text-center">Quick Presets</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'Slow', value: 1500, emoji: '🐢', desc: 'Beginner' },
                { label: 'Normal', value: 1000, emoji: '⚡', desc: 'Recommended', recommended: true },
                { label: 'Fast', value: 500, emoji: '🚀', desc: 'Expert' }
              ].map(({ label, value, emoji, desc, recommended }) => (
                <div key={label} className="relative">
                  <Button
                    variant={baseDropSpeed === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSpeedChange(value)}
                    disabled={gameStarted && !gameOver}
                    className={`text-xs h-8 w-full ${
                      baseDropSpeed === value 
                        ? 'bg-game-accent text-background' 
                        : 'border-game-border/50 text-game-text hover:bg-game-grid/50'
                    }`}
                  >
                    <span className="mr-1">{emoji}</span>
                    {label}
                  </Button>
                  {recommended && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full text-[8px]">
                      ★
                    </div>
                  )}
                  <div className="text-xs text-game-text/60 text-center mt-1">
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Speed Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-game-text/80">Fine Tune</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeedChange(Math.min(2000, baseDropSpeed + 100))}
                  disabled={gameStarted && !gameOver || baseDropSpeed >= 2000}
                  className="h-6 w-6 p-0 text-game-text hover:bg-game-grid/50"
                >
                  -
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeedChange(Math.max(200, baseDropSpeed - 100))}
                  disabled={gameStarted && !gameOver || baseDropSpeed <= 200}
                  className="h-6 w-6 p-0 text-game-text hover:bg-game-grid/50"
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {/* Speed Visualization Bar */}
              <div className="relative">
                <div className="h-2 bg-game-grid rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      baseDropSpeed <= 500 ? 'bg-red-500' :
                      baseDropSpeed <= 800 ? 'bg-yellow-500' :
                      baseDropSpeed <= 1200 ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.max(5, 100 - ((baseDropSpeed - 200) / (2000 - 200)) * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-game-text/40 mt-1 font-mono">
                  <span>🚀 Fast</span>
                  <span>🐢 Slow</span>
                </div>
              </div>
              
              <Slider
                value={[baseDropSpeed]}
                onValueChange={([value]) => onSpeedChange(value)}
                min={200}
                max={2000}
                step={50}
                className="w-full"
                disabled={gameStarted && !gameOver}
              />
            </div>
          </div>

          {/* Speed Info */}
          <div className="bg-game-grid/30 rounded p-3 space-y-2">
            <div className="text-xs text-game-text/70 space-y-1">
              <div className="flex justify-between">
                <span>Current Level:</span>
                <span className="text-game-accent font-bold">{level}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Speed:</span>
                <span className="text-game-accent font-bold">
                  {Math.max(100, baseDropSpeed - (level - 1) * 100)}ms
                </span>
              </div>
            </div>
            
            {/* Level Progression Preview */}
            <div className="space-y-1">
              <div className="text-xs text-game-text/60 text-center">Next Levels Preview</div>
              <div className="grid grid-cols-4 gap-1 text-xs font-mono">
                {[level + 1, level + 2, level + 3, level + 4].map(futureLevel => {
                  const futureSpeed = Math.max(100, baseDropSpeed - (futureLevel - 1) * 100);
                  return (
                    <div key={futureLevel} className="text-center">
                      <div className="text-game-text/60">L{futureLevel}</div>
                      <div className="text-game-accent text-[10px]">
                        {futureSpeed}ms
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-xs text-game-text/50 text-center italic border-t border-game-border/20 pt-1">
              Speed increases by 100ms per level
            </div>
          </div>

          {/* Speed Comparison */}
          {baseDropSpeed !== 1000 && (
            <div className="bg-game-grid/20 rounded p-2 text-xs text-game-text/70">
              <div className="text-center">
                {baseDropSpeed < 1000 ? (
                  <span className="text-red-400">
                    ⚡ {((1000 - baseDropSpeed) / 1000 * 100).toFixed(0)}% faster than normal
                  </span>
                ) : (
                  <span className="text-blue-400">
                    🐌 {((baseDropSpeed - 1000) / 1000 * 100).toFixed(0)}% slower than normal
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Reset and Status */}
          <div className="space-y-2">
            {!gameStarted || gameOver ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeedChange(1000)}
                  className="flex-1 h-7 text-xs border-game-border/30 text-game-text/70 hover:bg-game-grid/30"
                  disabled={baseDropSpeed === 1000}
                >
                  ↻ Default
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSpeedChange(Math.random() > 0.5 ? 300 + Math.floor(Math.random() * 400) : 1200 + Math.floor(Math.random() * 600))}
                  className="flex-1 h-7 text-xs border-game-border/30 text-game-text/70 hover:bg-game-grid/30"
                  disabled={gameStarted && !gameOver}
                >
                  🎲 Random
                </Button>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                <p className="text-xs text-yellow-400 text-center">
                  🔒 Speed locked during gameplay
                </p>
                <p className="text-xs text-yellow-400/70 text-center mt-1">
                  Use +/- keys or pause to adjust
                </p>
              </div>
            )}
          </div>
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
          <Button 
            onClick={onReset}
            variant="outline"
            className="w-full border-game-border text-game-text hover:bg-game-grid"
          >
            RESET
          </Button>
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