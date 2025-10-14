import { memo } from 'react';
import { Piece } from '../types/tetris';

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

interface HoldUIProps {
  holdPiece: Piece | null;
  holdUsed: boolean;
  gameMode?: 'regular' | 'extra' | 'speedrun';
}

const getCellClasses = (cellType: string, isHoldUsed: boolean) => {
  const baseClasses = "aspect-square rounded-sm transition-all duration-75 relative overflow-hidden";
  const opacity = isHoldUsed ? "opacity-50" : "";
  
  switch (cellType) {
    // Regular pieces
    case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20 ${opacity}`;
    case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20 ${opacity}`;
    case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20 ${opacity}`;
    case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20 ${opacity}`;
    case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20 ${opacity}`;
    case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] ${opacity}`;
    case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20 ${opacity}`;
    
    // Extra pieces - use similar colors to their base variants
    case 'I5': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20 ${opacity}`;
    case 'L3': case 'L4': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20 ${opacity}`;
    case 'J3': case 'J4': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] ${opacity}`;
    case 'T3': case 'T4': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20 ${opacity}`;
    case 'U': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20 ${opacity}`;
    case 'F': case 'W': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20 ${opacity}`;
    case 'Y': case 'N': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20 ${opacity}`;
    case 'P': return `${baseClasses} bg-gradient-to-br from-tetris-p via-tetris-p to-pink-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-pink-400/20 ${opacity}`;
    case 'B': return `${baseClasses} bg-gradient-to-br from-tetris-b via-tetris-b to-amber-800 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-amber-600/20 ${opacity}`;
    
    default: return `${baseClasses} bg-game-grid border border-game-border/30`;
  }
};

export const HoldUI = memo(({ holdPiece, holdUsed, gameMode = 'regular' }: HoldUIProps) => {
  const blockSize = 16; // Size of each block in pixels
  
  const renderPiece = () => {
    if (!holdPiece) {
      // Show empty state with minimum container size
      return (
        <div className="flex justify-center items-center" style={{ width: '64px', height: '64px' }}>
          <div className="text-xs text-muted-foreground/50 font-mono">Empty</div>
        </div>
      );
    }

    const shape = holdPiece.shape;
    const blocks = [];
    
    // Find all blocks in the shape and their positions
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          blocks.push({ x, y });
        }
      }
    }
    
    if (blocks.length === 0) return null;
    
    // Calculate bounding box for centering
    const minX = Math.min(...blocks.map(b => b.x));
    const maxX = Math.max(...blocks.map(b => b.x));
    const minY = Math.min(...blocks.map(b => b.y));
    const maxY = Math.max(...blocks.map(b => b.y));
    
    const pieceWidth = (maxX - minX + 1) * blockSize;
    const pieceHeight = (maxY - minY + 1) * blockSize;
    
    return (
      <div className="flex justify-center">
        <div className="relative" style={{ width: `${pieceWidth}px`, height: `${pieceHeight}px` }}>
          {blocks.map((block, index) => (
            <div
              key={index}
              className={getCellClasses(holdPiece.type, holdUsed)}
              style={{
                position: 'absolute',
                left: `${(block.x - minX) * blockSize}px`,
                top: `${(block.y - minY) * blockSize}px`,
                width: `${blockSize}px`,
                height: `${blockSize}px`
              }}
            >
              {!holdUsed && (
                <div className="absolute inset-[1px] rounded-sm bg-gradient-to-br from-white/20 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-retro font-bold text-foreground mb-2 text-center tracking-wider text-retro-glow">HOLD</h3>
      <div className="text-xs text-muted-foreground text-center mb-2 font-mono">Press C</div>
      
      <div className="min-h-16 flex items-center justify-center">
        {renderPiece()}
      </div>
    </div>
  );
});