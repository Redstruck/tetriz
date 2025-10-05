import { memo, useMemo, useState, useEffect } from 'react';

interface SpeedrunUIProps {
  wavesCleared: number;
  currentRound: number;
  targetsDestroyedInRound: number;
  totalTime: number;
  greyBlocks: { x: number; y: number }[];
}

export const SpeedrunUI = memo(({ wavesCleared, currentRound, targetsDestroyedInRound, totalTime, greyBlocks }: SpeedrunUIProps) => {
  // Memoize time formatting to reduce calculations
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    const milliseconds = Math.floor((totalTime % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }, [totalTime]);

  // Calculate targets needed for current round
  const getTargetsForRound = useMemo(() => {
    return (round: number) => Math.floor((round - 1) / 4) + 1;
  }, []);
  
  const targetsNeededForRound = useMemo(() => {
    return getTargetsForRound(currentRound);
  }, [currentRound, getTargetsForRound]);

  const remainingTargets = greyBlocks.length;
  const roundProgress = targetsDestroyedInRound;
  const isRoundComplete = roundProgress >= targetsNeededForRound;
  
  // Track previous round to detect round completion
  const [prevRound, setPrevRound] = useState(currentRound);
  const [showRoundCompleteAnimation, setShowRoundCompleteAnimation] = useState(false);

  useEffect(() => {
    if (currentRound > prevRound) {
      // Round just completed
      setShowRoundCompleteAnimation(true);
      setPrevRound(currentRound);
      
      // TODO: Add sound effect for round completion
      // playRoundCompleteSound();
      
      // Hide animation after 2 seconds
      const timer = setTimeout(() => {
        setShowRoundCompleteAnimation(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentRound, prevRound]);

  return (
    <div className="speedrun-ui text-center mb-4 relative">
      {/* Round Completion Animation Overlay */}
      {showRoundCompleteAnimation && (
        <div className="absolute inset-0 -inset-4 z-50 flex items-center justify-center pointer-events-none">
          <div className="round-completion-effect bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-black font-bold px-6 py-3 rounded-lg shadow-2xl">
            <div className="text-sm font-mono tracking-wider">ROUND {prevRound} COMPLETE!</div>
            <div className="text-xs font-mono opacity-75 mt-1">
              {getTargetsForRound(currentRound)} targets in Round {currentRound}
            </div>
          </div>
        </div>
      )}

      {/* Timer */}
      <div className="mb-3 p-3 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 border border-orange-500/30 rounded-lg">
        <div className="text-xs font-mono text-orange-200/80 mb-1 tracking-wide">TIME</div>
        <div className="text-2xl font-mono font-bold text-orange-300 font-digital tracking-wider">
          {formattedTime}
        </div>
      </div>

      {/* Current Round with Progress Bar */}
      <div className="mb-3 p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-lg">
        <div className="text-xs font-mono text-yellow-200/80 mb-1 tracking-wide">ROUND</div>
        <div className="text-xl font-mono font-bold text-yellow-300 tracking-wider">
          {currentRound}
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-xs font-mono text-yellow-200/60 mb-1">
            <span>Progress</span>
            <span>{roundProgress}/{targetsNeededForRound}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-yellow-900/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${Math.min((roundProgress / targetsNeededForRound) * 100, 100)}%`,
                boxShadow: roundProgress > 0 ? '0 0 8px rgba(251,191,36,0.6)' : 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Remaining Targets with Enhanced Display */}
      <div className="p-3 bg-gradient-to-br from-gray-500/20 to-gray-600/10 border border-gray-500/30 rounded-lg relative overflow-hidden">
        {/* Round completion flash effect */}
        {isRoundComplete && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-400/30 to-yellow-400/20 animate-pulse" />
        )}
        
        <div className="relative z-10">
          <div className="text-xs font-mono text-gray-200/80 mb-1 tracking-wide">
            {isRoundComplete ? 'ROUND COMPLETE!' : 'TARGETS LEFT'}
          </div>
          <div className={`text-xl font-mono font-bold tracking-wider transition-colors duration-300 ${
            isRoundComplete ? 'text-yellow-300' : 'text-gray-300'
          }`}>
            {remainingTargets}
          </div>
          
          {/* Target indicators with enhanced animation */}
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(remainingTargets, 10) }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isRoundComplete 
                      ? 'bg-yellow-400 animate-bounce' 
                      : 'bg-gray-400 animate-pulse'
                  }`}
                  style={{ 
                    animationDelay: `${i * 100}ms`,
                    boxShadow: isRoundComplete ? '0 0 6px rgba(251,191,36,0.8)' : 'none'
                  }}
                />
              ))}
              {remainingTargets > 10 && (
                <div className={`text-xs ml-2 transition-colors duration-300 ${
                  isRoundComplete ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  +{remainingTargets - 10}
                </div>
              )}
            </div>
          </div>
          
          {/* Round completion message */}
          {isRoundComplete && (
            <div className="mt-2 text-xs font-mono text-yellow-300 text-center animate-pulse">
              GET READY FOR ROUND {currentRound + 1}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SpeedrunUI.displayName = 'SpeedrunUI';
