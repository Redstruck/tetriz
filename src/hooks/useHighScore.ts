import { useState, useCallback, useEffect } from 'react';
import { checkAndUpdateHighScore, getHighScore } from '../utils/highScoreManager';

interface UseHighScoreResult {
  currentHighScore: number;
  checkForNewHighScore: (score: number) => boolean;
  showCelebration: boolean;
  celebrationData: {
    gameMode: 'regular' | 'extra' | 'speedrun';
    newScore: number;
    previousScore: number;
  } | null;
  hideCelebration: () => void;
}

export const useHighScore = (gameMode: 'regular' | 'extra' | 'speedrun'): UseHighScoreResult => {
  const [currentHighScore, setCurrentHighScore] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    gameMode: 'regular' | 'extra' | 'speedrun';
    newScore: number;
    previousScore: number;
  } | null>(null);

  // Load high score on mount and when gameMode changes
  useEffect(() => {
    const highScore = getHighScore(gameMode);
    setCurrentHighScore(highScore);
  }, [gameMode]);

  const checkForNewHighScore = useCallback((score: number): boolean => {
    const result = checkAndUpdateHighScore(gameMode, score);
    
    if (result.isNewHighScore) {
      setCurrentHighScore(result.newHigh);
      setCelebrationData({
        gameMode,
        newScore: result.newHigh,
        previousScore: result.previousHigh
      });
      setShowCelebration(true);
      return true;
    }
    
    return false;
  }, [gameMode]);

  const hideCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationData(null);
  }, []);

  return {
    currentHighScore,
    checkForNewHighScore,
    showCelebration,
    celebrationData,
    hideCelebration
  };
};
