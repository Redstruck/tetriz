import { memo, useMemo } from 'react';

interface SpeedrunUIProps {
  wavesCleared: number;
  totalTime: number;
  greyBlocks: { x: number; y: number }[];
}

export const SpeedrunUI = memo(({ wavesCleared, totalTime, greyBlocks }: SpeedrunUIProps) => {
  // Memoize time formatting to reduce calculations
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    const milliseconds = Math.floor((totalTime % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }, [totalTime]);

  const remainingTargets = greyBlocks.length;

  return (
    <div className="speedrun-ui text-center mb-4">
      {/* Timer */}
      <div className="mb-3 p-3 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-orange-500/30 rounded-lg">
        <div className="text-xs font-mono text-orange-200/80 mb-1 tracking-wide">TIME</div>
        <div className="text-2xl font-mono font-bold text-orange-300 font-digital tracking-wider">
          {formattedTime}
        </div>
      </div>

      {/* Waves Cleared */}
      <div className="mb-3 p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-lg">
        <div className="text-xs font-mono text-yellow-200/80 mb-1 tracking-wide">WAVES</div>
        <div className="text-xl font-mono font-bold text-yellow-300 tracking-wider">
          {wavesCleared}
        </div>
      </div>

      {/* Remaining Targets */}
      <div className="p-3 bg-gradient-to-br from-gray-500/20 to-gray-600/10 border border-gray-500/30 rounded-lg">
        <div className="text-xs font-mono text-gray-200/80 mb-1 tracking-wide">TARGETS LEFT</div>
        <div className="text-xl font-mono font-bold text-gray-300 tracking-wider">
          {remainingTargets}
        </div>
        <div className="mt-2 flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(remainingTargets, 10) }, (_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full opacity-75 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
            {remainingTargets > 10 && (
              <div className="text-xs text-gray-400 ml-2">+{remainingTargets - 10}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SpeedrunUI.displayName = 'SpeedrunUI';
