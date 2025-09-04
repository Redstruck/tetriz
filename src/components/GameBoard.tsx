import { memo } from 'react';
import { Board, Piece } from '../types/tetris';
import { cn } from '../lib/utils';

interface GameBoardProps {
  board: Board;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  clearedRows: number[];
}

export const GameBoard = memo(({ board, currentPiece, ghostPiece, clearedRows }: GameBoardProps) => {
  // Create a display board that includes the ghost piece and current piece
  const displayBoard = board.map(row => [...row]);
  const ghostBoard = board.map(row => [...row]);
  
  // Add ghost piece to ghost board (only if not overlapping with current piece)
  if (ghostPiece && currentPiece && ghostPiece.y !== currentPiece.y) {
    ghostPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = ghostPiece.y + y;
          const boardX = ghostPiece.x + x;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10 && !displayBoard[boardY][boardX]) {
            ghostBoard[boardY][boardX] = `ghost-${ghostPiece.type}`;
          }
        }
      });
    });
  }
  
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

  const getCellClasses = (cellType: string, isGhost: boolean = false, isClearing: boolean = false) => {
    const baseClasses = "aspect-square rounded-sm transition-all duration-75 relative overflow-hidden";
    
    if (isGhost) {
      return `${baseClasses} bg-transparent border-2 border-dashed border-gray-400/40`;
    }
    
    const clearingClass = isClearing ? " animate-line-clear" : "";
    
    switch (cellType) {
      case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20${clearingClass}`;
      case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20${clearingClass}`;
      case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20${clearingClass}`;
      case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20${clearingClass}`;
      case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20${clearingClass}`;
      case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-blue-400/20${clearingClass}`;
      case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20${clearingClass}`;
      default: return `${baseClasses} bg-game-grid border border-game-border/30`;
    }
  };

  return (
    <div className="relative">
      {/* Game board */}
      <div className="p-3 bg-game-board rounded-lg shadow-2xl">
        {/* Board grid */}
        <div className="grid grid-cols-10 gap-[2px] bg-game-grid/50 p-2 rounded">
          {displayBoard.map((row, y) =>
            row.map((cell, x) => {
              const ghostCell = ghostBoard[y][x];
              const isGhost = ghostCell && ghostCell.startsWith('ghost-');
              const displayCell = cell || (isGhost ? ghostCell.replace('ghost-', '') : '');
              const isClearing = clearedRows.includes(y) && !!cell;
              
              return (
                <div
                  key={`${y}-${x}`}
                  className={getCellClasses(displayCell, isGhost, isClearing)}
                  style={{
                    width: 'clamp(22px, 4vw, 34px)',
                    height: 'clamp(22px, 4vw, 34px)'
                  }}
                >
                  {/* White flash overlay for clearing animation */}
                  {isClearing && (
                    <div className="absolute inset-0 bg-white rounded-sm animate-line-clear" />
                  )}
                  {/* Inner highlight for 3D effect */}
                  {cell && !isGhost && !isClearing && (
                    <div className="absolute inset-[1px] rounded-sm bg-gradient-to-br from-white/20 to-transparent" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});