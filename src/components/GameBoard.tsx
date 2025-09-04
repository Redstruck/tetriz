import { memo } from 'react';
import { Board, Piece } from '../types/tetris';
import { cn } from '../lib/utils';

interface GameBoardProps {
  board: Board;
  currentPiece: Piece | null;
  clearedRows: number[];
}

export const GameBoard = memo(({ board, currentPiece, clearedRows }: GameBoardProps) => {
  // Create a display board that includes the current piece
  const displayBoard = board.map(row => [...row]);
  
  // Add current piece to display board
  if (currentPiece) {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            displayBoard[boardY][boardX] = currentPiece.type;
          }
        }
      });
    });
  }

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
    <div className="relative">
      {/* Game board border */}
      <div className="p-2 bg-game-board border-2 border-game-border rounded-lg shadow-2xl animate-glow-pulse">
        {/* Board grid */}
        <div className="grid grid-cols-10 gap-[1px] bg-background p-1 rounded">
          {displayBoard.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={cn(
                  "aspect-square border border-game-grid/20 rounded-[1px] transition-all duration-100",
                  getCellColor(cell),
                  cell && "shadow-sm",
                  clearedRows.includes(y) && "animate-line-clear"
                )}
                style={{
                  width: 'clamp(20px, 4vw, 32px)',
                  height: 'clamp(20px, 4vw, 32px)'
                }}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Grid overlay for retro feel */}
      <div className="absolute inset-2 pointer-events-none">
        <div className="w-full h-full opacity-10 bg-gradient-to-b from-transparent via-game-accent/5 to-transparent" />
      </div>
    </div>
  );
});