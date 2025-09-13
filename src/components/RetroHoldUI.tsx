import { memo } from 'react';
import { Piece } from '../types/tetris';

interface RetroHoldUIProps {
  holdPiece: Piece | null;
  holdUsed: boolean;
}

const getCellClasses = (cellType: string, isHoldUsed: boolean) => {
  const baseClasses = "w-4 h-4 border-white/20";
  const opacity = isHoldUsed ? "opacity-50" : "";
  
  switch (cellType) {
    case 'I': return `${baseClasses} bg-cyan-400 ${opacity}`;
    case 'O': return `${baseClasses} bg-yellow-400 ${opacity}`;
    case 'T': return `${baseClasses} bg-purple-500 ${opacity}`;
    case 'S': return `${baseClasses} bg-green-500 ${opacity}`;
    case 'Z': return `${baseClasses} bg-red-500 ${opacity}`;
    case 'J': return `${baseClasses} bg-blue-500 ${opacity}`;
    case 'L': return `${baseClasses} bg-orange-500 ${opacity}`;
    default: return `${baseClasses} bg-transparent border border-white/10`;
  }
};

export const RetroHoldUI = memo(({ holdPiece, holdUsed }: RetroHoldUIProps) => {
  return (
    <div className="text-white font-mono">
      <div className="text-sm font-bold mb-2">HOLD</div>
      
      <div className="w-16 h-16 border border-white/30 bg-black/20 p-1 mb-2">
        <div className="grid grid-cols-4 gap-[1px] h-full">
          {Array(16).fill(null).map((_, index) => {
            const x = index % 4;
            const y = Math.floor(index / 4);
            
            let cellType = '';
            if (holdPiece && holdPiece.shape[y] && holdPiece.shape[y][x] === 1) {
              cellType = holdPiece.type;
            }
            
            return (
              <div
                key={index}
                className={getCellClasses(cellType, holdUsed)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});