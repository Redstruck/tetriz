import { memo } from 'react';

interface RightStatsProps {
  level: number;
  score: number;
}

export const RightStatsPanel = memo(({ level, score }: RightStatsProps) => {
  return (
    <div className="text-white font-mono text-sm space-y-6">
      <div>
        <div className="text-sm font-bold mb-1">LEVEL</div>
        <div className="text-4xl font-bold">{level}</div>
        <div className="text-xl font-bold">100</div>
      </div>
      
      <div>
        <div className="text-sm font-bold mb-1">SCORE</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
    </div>
  );
});