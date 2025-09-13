import { memo } from 'react';
import { Piece } from '../types/tetris';

interface RetroNextUIProps {
  nextPiece: Piece | null;
}

const getCellClasses = (cellType: string) => {
  const baseClasses = "w-4 h-4";
  
  switch (cellType) {
    case 'I': return `${baseClasses} bg-cyan-400`;
    case 'O': return `${baseClasses} bg-yellow-400`;
    case 'T': return `${baseClasses} bg-purple-500`;
    case 'S': return `${baseClasses} bg-green-500`;
    case 'Z': return `${baseClasses} bg-red-500`;
    case 'J': return `${baseClasses} bg-blue-500`;
    case 'L': return `${baseClasses} bg-orange-500`;
    default: return `${baseClasses} bg-transparent`;
  }
};

export const RetroNextUI = memo(({ nextPiece }: RetroNextUIProps) => {
  // Mock next pieces for visual representation (like in the reference)
  const mockNextPieces = [
    { type: 'S', color: 'bg-green-500' },
    { type: 'Z', color: 'bg-red-500' },
    { type: 'L', color: 'bg-orange-500' },
    { type: 'O', color: 'bg-yellow-400' },
    { type: 'T', color: 'bg-purple-500' },
  ];

  return (
    <div className="text-white font-mono">
      <div className="text-sm font-bold mb-2">NEXT</div>
      
      <div className="space-y-2">
        {/* Main next piece */}
        {nextPiece && (
          <div className="w-16 h-16 border border-white/30 bg-black/20 p-1 mb-4">
            <div className="grid grid-cols-4 gap-[1px] h-full">
              {Array(16).fill(null).map((_, index) => {
                const x = index % 4;
                const y = Math.floor(index / 4);
                
                let cellType = '';
                if (nextPiece && nextPiece.shape[y] && nextPiece.shape[y][x] === 1) {
                  cellType = nextPiece.type;
                }
                
                return (
                  <div
                    key={index}
                    className={getCellClasses(cellType)}
                  />
                );
              })}
            </div>
          </div>
        )}
        
        {/* Preview stack of upcoming pieces */}
        <div className="space-y-1">
          {mockNextPieces.map((piece, index) => (
            <div key={index} className="flex space-x-1">
              <div className={`w-3 h-3 ${piece.color}`} />
              <div className={`w-3 h-3 ${piece.color}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});