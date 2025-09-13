import { memo } from 'react';

interface LeftStatsProps {
  linesCleared: number;
  gameTime: number;
}

export const LeftStatsPanel = memo(({ linesCleared, gameTime }: LeftStatsProps) => {
  const formatTime = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-white font-mono text-sm space-y-6">
      <div>
        <div className="text-lg font-bold mb-1">GRADE</div>
        <div className="text-4xl font-bold">9</div>
        <div className="text-xs opacity-70">Grade: 0</div>
      </div>
      
      <div>
        <div className="text-sm font-bold mb-1">PIECES</div>
        <div className="text-xl font-bold">0 <span className="text-xs opacity-70">0.00/s</span></div>
      </div>
      
      <div>
        <div className="text-sm font-bold mb-1">TIME</div>
        <div className="text-xl font-bold">{formatTime(gameTime)}</div>
      </div>
    </div>
  );
});