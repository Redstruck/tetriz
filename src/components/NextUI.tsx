import { memo } from 'react';
import { Piece } from '../types/tetris';
import { getPieceData } from '../utils/tetrisShapes';

// Helper function to center a piece shape in a grid of specified size
const centerPieceInGrid = (shape: number[][], gridSize: number = 6): number[][] => {
  // Find the bounding box of the piece
  let minX = shape[0]?.length || 0;
  let maxX = -1;
  let minY = shape.length;
  let maxY = -1;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] === 1) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // If no blocks found, return empty grid
  if (minX > maxX || minY > maxY) {
    return Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  }

  // Calculate the piece dimensions
  const pieceWidth = maxX - minX + 1;
  const pieceHeight = maxY - minY + 1;

  // Calculate centering offsets
  const offsetX = Math.floor((gridSize - pieceWidth) / 2);
  const offsetY = Math.floor((gridSize - pieceHeight) / 2);

  // Create centered grid
  const centeredGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (shape[y] && shape[y][x] === 1) {
        const newY = offsetY + (y - minY);
        const newX = offsetX + (x - minX);
        if (newY >= 0 && newY < gridSize && newX >= 0 && newX < gridSize) {
          centeredGrid[newY][newX] = 1;
        }
      }
    }
  }

  return centeredGrid;
};

interface NextUIProps {
  nextPiece: Piece | null;
  gameMode?: 'regular' | 'extra' | 'speedrun';
}

const getCellClasses = (cellType: string) => {
  const baseClasses = "aspect-square rounded-sm transition-all duration-75 relative overflow-hidden";
  
  switch (cellType) {
    // Regular pieces
    case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20`;
    case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20`;
    case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20`;
    case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20`;
    case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20`;
    case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]`;
    case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20`;
    
    // Extra pieces - use similar colors to their base variants
    case 'I5': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20`;
    case 'L3': case 'L4': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20`;
    case 'J3': case 'J4': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]`;
    case 'T3': case 'T4': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20`;
    case 'U': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20`;
    case 'F': case 'W': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20`;
    case 'Y': case 'N': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20`;
    case 'P': return `${baseClasses} bg-gradient-to-br from-tetris-p via-tetris-p to-pink-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-pink-400/20`;
    case 'B': return `${baseClasses} bg-gradient-to-br from-tetris-b via-tetris-b to-amber-800 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-amber-600/20`;
    
    default: return `${baseClasses} bg-game-grid border border-game-border/30`;
  }
};

export const NextUI = memo(({ nextPiece, gameMode = 'regular' }: NextUIProps) => {
  const blockSize = 16; // Size of each block in pixels
  
  const renderPiece = () => {
    if (!nextPiece) {
      // Show empty state with minimum container size
      return (
        <div className="flex justify-center items-center" style={{ width: '64px', height: '64px' }}>
          <div className="text-xs text-muted-foreground/50 font-mono">Empty</div>
        </div>
      );
    }

    const shape = getPieceData(nextPiece.type).shape;
    const centeredGrid = centerPieceInGrid(shape, 4);
    
    // Calculate the container dimensions based on the centered grid
    const containerWidth = centeredGrid[0].length * blockSize;
    const containerHeight = centeredGrid.length * blockSize;
    
    return (
      <div
        className="flex flex-col gap-0"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
        }}
      >
        {centeredGrid.map((row, y) => (
          <div key={y} className="flex gap-0">
            {row.map((cell, x) => (
              <div
                key={x}
                className={getCellClasses(cell ? nextPiece.type : '')}
                style={{
                  width: `${blockSize}px`,
                  height: `${blockSize}px`,
                }}
              >
                {cell === 1 && (
                  <div className="absolute inset-[2px] rounded-[1px] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-game-board border border-game-border rounded-lg p-4 flex flex-col items-center justify-center min-w-[120px]">
      <div className="text-sm font-retro font-bold text-game-accent mb-2 tracking-wider text-retro-glow">NEXT</div>
      <div className="flex items-center justify-center">
        {renderPiece()}
      </div>
    </div>
  );
});

NextUI.displayName = 'NextUI';
