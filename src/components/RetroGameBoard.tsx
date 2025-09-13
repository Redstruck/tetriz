import { memo } from 'react';
import { Board, Piece } from '../types/tetris';

interface RetroGameBoardProps {
  board: Board;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  clearedRows: number[];
}

export const RetroGameBoard = memo(({ board, currentPiece, ghostPiece, clearedRows }: RetroGameBoardProps) => {
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

  const getCellClasses = (cellType: string, isGhost: boolean = false) => {
    const baseClasses = "w-6 h-6 border border-white/20";
    
    if (isGhost) {
      return `${baseClasses} bg-transparent border-dashed border-gray-400/40`;
    }
    
    switch (cellType) {
      case 'I': return `${baseClasses} bg-cyan-400`;
      case 'O': return `${baseClasses} bg-yellow-400`;
      case 'T': return `${baseClasses} bg-purple-500`;
      case 'S': return `${baseClasses} bg-green-500`;
      case 'Z': return `${baseClasses} bg-red-500`;
      case 'J': return `${baseClasses} bg-blue-500`;
      case 'L': return `${baseClasses} bg-orange-500`;
      default: return `${baseClasses} bg-black border-white/10`;
    }
  };

  return (
    <div className="relative">
      {/* Game board */}
      <div className="border-2 border-white bg-black">
        {/* Board grid */}
        <div className="grid grid-cols-10 gap-0">
          {displayBoard.map((row, y) =>
            row.map((cell, x) => {
              const ghostCell = ghostBoard[y][x];
              const isGhost = ghostCell && ghostCell.startsWith('ghost-');
              const displayCell = cell || (isGhost ? ghostCell.replace('ghost-', '') : '');
              
              return (
                <div
                  key={`${y}-${x}`}
                  className={getCellClasses(displayCell, isGhost)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});