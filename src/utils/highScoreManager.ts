interface HighScores {
  regular: number;
  extra: number;
  speedrun: number;
}

const HIGH_SCORE_KEY = 'tetris-high-scores';

const getDefaultHighScores = (): HighScores => ({
  regular: 0,
  extra: 0,
  speedrun: 0
});

export const getHighScores = (): HighScores => {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) {
      return { ...getDefaultHighScores(), ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading high scores:', error);
  }
  return getDefaultHighScores();
};

export const getHighScore = (gameMode: 'regular' | 'extra' | 'speedrun'): number => {
  const highScores = getHighScores();
  return highScores[gameMode];
};

export const setHighScore = (gameMode: 'regular' | 'extra' | 'speedrun', score: number): boolean => {
  try {
    const highScores = getHighScores();
    const currentHigh = highScores[gameMode];
    
    if (score > currentHigh) {
      highScores[gameMode] = score;
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(highScores));
      return true; // New high score achieved
    }
    return false; // No new high score
  } catch (error) {
    console.error('Error setting high score:', error);
    return false;
  }
};

export const checkAndUpdateHighScore = (
  gameMode: 'regular' | 'extra' | 'speedrun',
  score: number
): { isNewHighScore: boolean; previousHigh: number; newHigh: number } => {
  const previousHigh = getHighScore(gameMode);
  const isNewHighScore = setHighScore(gameMode, score);
  
  return {
    isNewHighScore,
    previousHigh,
    newHigh: isNewHighScore ? score : previousHigh
  };
};
