import { memo } from 'react';
import { Piece } from '../types/tetris';

interface HoldUIProps {
  holdPiece: Piece | null;
  holdUsed: boolean;
}

const getCellClasses = (cellType: string, isHoldUsed: boolean) => {
  const baseClasses = "aspect-square rounded-sm transition-all duration-75 relative overflow-hidden";
  const opacity = isHoldUsed ? "opacity-50" : "";
  
  switch (cellType) {
    case 'I': return `${baseClasses} bg-gradient-to-br from-tetris-i via-tetris-i to-cyan-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-cyan-400/20 ${opacity}`;
    case 'O': return `${baseClasses} bg-gradient-to-br from-tetris-o via-tetris-o to-yellow-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-yellow-400/20 ${opacity}`;
    case 'T': return `${baseClasses} bg-gradient-to-br from-tetris-t via-tetris-t to-purple-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-purple-400/20 ${opacity}`;
    case 'S': return `${baseClasses} bg-gradient-to-br from-tetris-s via-tetris-s to-green-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-green-400/20 ${opacity}`;
    case 'Z': return `${baseClasses} bg-gradient-to-br from-tetris-z via-tetris-z to-red-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-red-400/20 ${opacity}`;
    case 'J': return `${baseClasses} bg-gradient-to-br from-tetris-j via-tetris-j to-blue-700 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] ${opacity}`;
    case 'L': return `${baseClasses} bg-gradient-to-br from-tetris-l via-tetris-l to-orange-600 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] border border-orange-400/20 ${opacity}`;
    default: return `${baseClasses} bg-game-grid border border-game-border/30`;
  }
};

export const HoldUI = memo(({ holdPiece, holdUsed }: HoldUIProps) => {
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-retro font-bold text-foreground mb-2 text-center tracking-wider text-retro-glow">HOLD</h3>
      <div className="text-xs text-muted-foreground text-center mb-2 font-mono">Press C</div>
      
      <div className="w-24 h-24 bg-game-grid/50 rounded border border-game-border/30 p-1">
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
                style={{
                  width: '20px',
                  height: '20px'
                }}
              >
                {cellType && !holdUsed && (
                  <div className="absolute inset-[1px] rounded-sm bg-gradient-to-br from-white/20 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {holdUsed && (
        <div className="text-xs text-muted-foreground text-center mt-2">
          Used this turn
        </div>
      )}
    </div>
  );
});