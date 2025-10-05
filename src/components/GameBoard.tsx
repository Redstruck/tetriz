import { memo, useMemo } from 'react';
import { Board, Piece } from '../types/tetris';
import { cn } from '../lib/utils';

interface GameBoardProps {
  board: Board;
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  clearedRows: number[];
  paused?: boolean;
  gameMode?: 'regular' | 'extra' | 'speedrun';
}

export const GameBoard = memo(({ board, currentPiece, ghostPiece, clearedRows, paused, gameMode = 'regular' }: GameBoardProps) => {
  // Board dimensions based on game mode
  const boardWidth = gameMode === 'extra' ? 12 : 10;
  
  // Memoize the display board calculation to prevent unnecessary recalculations
  const { displayBoard, ghostBoard } = useMemo(() => {
    const displayBoard = board.map(row => [...row]);
    const ghostBoard = board.map(row => [...row]);
    
    // Add ghost piece to ghost board (only if not overlapping with current piece)
    if (ghostPiece && currentPiece && ghostPiece.y !== currentPiece.y) {
      ghostPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = ghostPiece.y + y;
            const boardX = ghostPiece.x + x;
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < boardWidth && !displayBoard[boardY][boardX]) {
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
            if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < boardWidth) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        });
      });
    }
    
    return { displayBoard, ghostBoard };
  }, [board, currentPiece, ghostPiece, boardWidth]);

  const getCellClasses = (cellType: string, isGhost: boolean = false, isClearing: boolean = false) => {
    const baseClasses = "aspect-square rounded-sm piece-transition relative overflow-hidden gpu-accelerated";
    
    if (isGhost) {
      return `${baseClasses} bg-transparent border-2 border-dashed border-gray-400/40`;
    }
    
    const clearingClass = isClearing ? " animate-line-clear" : "";
    
    switch (cellType) {
      // Regular pieces
      case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20${clearingClass}`;
      case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20${clearingClass}`;
      case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20${clearingClass}`;
      case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20${clearingClass}`;
      case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20${clearingClass}`;
      case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]${clearingClass}`;
      case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20${clearingClass}`;
      
      // Extra pieces - use similar colors to their base variants
      case 'I5': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20${clearingClass}`;
      case 'L3': case 'L4': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20${clearingClass}`;
      case 'J3': case 'J4': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]${clearingClass}`;
      case 'T3': case 'T4': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20${clearingClass}`;
      case 'U': case 'F': case 'W': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20${clearingClass}`;
      case 'Y': case 'N': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20${clearingClass}`;
      case 'P': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]${clearingClass}`;
      case 'H': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20${clearingClass}`;
      
      // Speedrun mode grey target blocks with enhanced animation
      case 'grey-target': return `${baseClasses} bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.5)] border border-gray-400/30 grey-target-enhanced${clearingClass}`;
      
      default: return `${baseClasses} bg-game-grid border border-game-border/30`;
    }
  };

  return (
    <div className="relative">
      {/* Game board */}
      <div className="p-3 bg-game-board rounded-lg shadow-2xl">
        {/* Board grid */}
        <div 
          className="grid gap-[2px] bg-game-grid/50 p-2 rounded"
          style={{ gridTemplateColumns: `repeat(${boardWidth}, 1fr)` }}
        >
          {displayBoard.map((row, y) =>
            row.map((cell, x) => {
              const ghostCell = ghostBoard[y][x];
              const hasActualPiece = !!cell;
              const hasGhostPiece = ghostCell && ghostCell.startsWith('ghost-');
              
              // Prioritize actual piece over ghost piece
              const isGhost = hasGhostPiece && !hasActualPiece;
              const displayCell = hasActualPiece ? cell : (hasGhostPiece ? ghostCell.replace('ghost-', '') : '');
              const isClearing = clearedRows.includes(y) && hasActualPiece;
              
              return (
                <div
                  key={`${y}-${x}`}
                  className={getCellClasses(displayCell, isGhost, isClearing)}
                  style={{
                    width: 'clamp(22px, 4vw, 34px)',
                    height: 'clamp(22px, 4vw, 34px)'
                  }}
                >
                  {/* Special effects for clearing animation */}
                  {isClearing && (
                    <>
                      {/* Neon explosion effect for target destruction */}
                      {displayCell === 'grey-target' && (
                        <div className="target-explosion absolute inset-0 bg-gradient-to-br from-gray-400 via-green-400 to-blue-400 rounded-sm">
                          {/* TODO: Add particle effects for enhanced visual feedback */}
                        </div>
                      )}
                      {/* Standard white flash for other blocks */}
                      {displayCell !== 'grey-target' && (
                        <div className="absolute inset-0 bg-white rounded-sm animate-line-clear" />
                      )}
                    </>
                  )}
                  {/* Inner highlight for 3D effect */}
                  {hasActualPiece && !isClearing && (
                    <div className="absolute inset-[1px] rounded-sm bg-gradient-to-br from-white/20 to-transparent" />
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Pause Overlay */}
        {paused && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-retro font-bold text-game-accent mb-3 tracking-wider text-retro-glow">PAUSED</div>
              <div className="text-sm font-mono text-gray-300">Press P to resume</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});