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
  onStart: () => void;
  onReset: () => void;
}

export const GameUI = memo(({ 
  score, 
  level, 
  linesCleared, 
  nextPiece, 
  gameOver, 
  gameStarted,
  onStart,
  onReset 
}: GameUIProps) => {
  const getCellColor = (cellType: string) => {
    switch (cellType) {
      case 'I': return 'bg-tetris-i';
      case 'O': return 'bg-tetris-o';
      case 'T': return 'bg-tetris-t';
      case 'S': return 'bg-tetris-s';
      case 'Z': return 'bg-tetris-z';
      case 'J': return 'bg-tetris-j';
      case 'L': return 'bg-tetris-l';
      default: return 'bg-game-grid';
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

      {/* Next Piece */}
      {nextPiece && (
        <div className="bg-game-board border border-game-border rounded-lg p-4">
          <h3 className="text-sm font-bold text-game-accent mb-2">NEXT</h3>
          <div className="flex justify-center">
            <div className="grid gap-[1px] bg-background p-2 rounded" 
                 style={{ gridTemplateColumns: `repeat(4, 1fr)` }}>
              {Array.from({ length: 16 }, (_, i) => {
                const y = Math.floor(i / 4);
                const x = i % 4;
                const shape = PIECES[nextPiece.type].shape;
                const hasBlock = shape[y] && shape[y][x];
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 border border-game-grid/20 rounded-[1px]",
                      hasBlock ? getCellColor(nextPiece.type) : "bg-game-grid"
                    )}
                  />
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