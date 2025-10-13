import { memo, useMemo, useState, useEffect, useRef } from 'react';

interface SpeedrunUIProps {
  wavesCleared: number;
  currentRound: number;
  targetsDestroyedInRound: number;
  totalTime: number;
  currentHighScore?: number;
}

export const SpeedrunUI = memo(({ wavesCleared, currentRound, targetsDestroyedInRound, totalTime, currentHighScore = 0 }: SpeedrunUIProps) => {
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

  const roundProgress = targetsDestroyedInRound;
  
  // Track previous round to detect round completion using useRef
  const prevRoundRef = useRef(currentRound);
  const [showRoundCompleteAnimation, setShowRoundCompleteAnimation] = useState(false);
  const [completedRound, setCompletedRound] = useState(0);

  useEffect(() => {
    console.log(`Round tracking: prevRound=${prevRoundRef.current}, currentRound=${currentRound}`);
    
    if (currentRound > prevRoundRef.current) {
      // Round just completed - prevRoundRef.current is the round that was completed
      const justCompletedRound = prevRoundRef.current;
      console.log(`🎉 Round ${justCompletedRound} completed! Moving to Round ${currentRound}`);
      setCompletedRound(justCompletedRound);
      setShowRoundCompleteAnimation(true);
      
      // Update the ref IMMEDIATELY after detecting the round change
      prevRoundRef.current = currentRound;
      
      // TODO: Add sound effect for round completion
      // playRoundCompleteSound();
      
      // Hide animation after 2 seconds
      const timer = setTimeout(() => {
        setShowRoundCompleteAnimation(false);
        console.log(`✅ Round completion animation hidden for round ${justCompletedRound}`);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (prevRoundRef.current === 0 || prevRoundRef.current !== currentRound) {
      // Initialize or update ref without showing animation
      prevRoundRef.current = currentRound;
    }
  }, [currentRound]);

  return (
    <div className="speedrun-ui text-center mb-4 relative">
      {/* Round Completion Animation Overlay */}
      {showRoundCompleteAnimation && (
        <div className="absolute inset-0 -inset-8 z-50 flex items-center justify-center pointer-events-none">
          <div className="round-completion-effect bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-black font-bold px-8 py-6 rounded-xl shadow-2xl border-4 border-yellow-600 transform scale-110 animate-pulse">
            <div className="text-xl font-mono tracking-wider text-center mb-2 animate-bounce">
              🎉 ROUND {completedRound} COMPLETE! 🎉
            </div>
            <div className="text-sm font-mono opacity-75 text-center">
              Next: {getTargetsForRound(currentRound)} targets in Round {currentRound}
            </div>
            <div className="text-xs font-mono opacity-60 text-center mt-1">
              Keep going! 🚀
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

      {/* High Score */}
      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 rounded-lg">
        <div className="text-xs font-mono text-purple-400 mb-1 tracking-wide">BEST ROUND</div>
        <div className="text-xl font-mono font-bold tracking-wider text-purple-400">
          {currentHighScore}
        </div>
      </div>

    </div>
  );
});

SpeedrunUI.displayName = 'SpeedrunUI';
