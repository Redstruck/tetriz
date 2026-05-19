interface HighScores {
  regular: number;
  extra: number;
  speedrun: number;
}

interface HighScoreData {
  scores: HighScores;
  lastUpdated: number;
  version: string;
}

const HIGH_SCORE_KEY = 'tetris-high-scores';
const HIGH_SCORE_VERSION = '1.0.0';

const getDefaultHighScores = (): HighScores => ({
  regular: 0,
  extra: 0,
  speedrun: 0
});

const getDefaultHighScoreData = (): HighScoreData => ({
  scores: getDefaultHighScores(),
  lastUpdated: Date.now(),
  version: HIGH_SCORE_VERSION
});

/**
 * Enhanced high score management with versioning and error recovery
 * Includes backup mechanisms and data validation
 */
export const getHighScores = (): HighScores => {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) {
      const data: HighScoreData = JSON.parse(stored);
      
      // Validate data structure
      if (data && typeof data === 'object' && data.scores) {
        // Migrate old format if needed
        if (!data.version) {
          console.log('[HighScore] Migrating old high score format');
          return migrateOldFormat(data);
        }
        
        // Return current format with defaults for missing modes
        return { ...getDefaultHighScores(), ...data.scores };
      }
    }
  } catch (error) {
    console.error('[HighScore] Error reading high scores:', error);
    
    // Try to recover from backup if main storage fails
    try {
      const backup = localStorage.getItem(`${HIGH_SCORE_KEY}-backup`);
      if (backup) {
        console.log('[HighScore] Attempting recovery from backup');
        const backupData: HighScoreData = JSON.parse(backup);
        if (backupData && backupData.scores) {
          // Restore from backup and save to main storage
          saveHighScoreData(backupData);
          return { ...getDefaultHighScores(), ...backupData.scores };
        }
      }
    } catch (backupError) {
      console.error('[HighScore] Backup recovery failed:', backupError);
    }
  }
  
  // Return defaults if all else fails
  return getDefaultHighScores();
};

/**
 * Migrate old high score format to new versioned format
 */
const migrateOldFormat = (oldData: any): HighScores => {
  try {
    let scores: HighScores;
    
    // Handle different old formats
    if (typeof oldData === 'object' && oldData.scores) {
      scores = { ...getDefaultHighScores(), ...oldData.scores };
    } else if (typeof oldData === 'object' && 
               (oldData.regular !== undefined || oldData.extra !== undefined || oldData.speedrun !== undefined)) {
      scores = { ...getDefaultHighScores(), ...oldData };
    } else {
      scores = getDefaultHighScores();
    }
    
    // Save in new format
    const newData: HighScoreData = {
      scores,
      lastUpdated: Date.now(),
      version: HIGH_SCORE_VERSION
    };
    
    saveHighScoreData(newData);
    console.log('[HighScore] Migration completed successfully');
    
    return scores;
  } catch (error) {
    console.error('[HighScore] Migration failed:', error);
    return getDefaultHighScores();
  }
};

/**
 * Save high score data with backup creation
 */
const saveHighScoreData = (data: HighScoreData): void => {
  try {
    const serialized = JSON.stringify(data);
    
    // Create backup of previous data before overwriting
    const existing = localStorage.getItem(HIGH_SCORE_KEY);
    if (existing) {
      localStorage.setItem(`${HIGH_SCORE_KEY}-backup`, existing);
    }
    
    // Save new data
    localStorage.setItem(HIGH_SCORE_KEY, serialized);
    
    console.log('[HighScore] Data saved successfully');
  } catch (error) {
    console.error('[HighScore] Failed to save high score data:', error);
    throw error;
  }
};

export const getHighScore = (gameMode: 'regular' | 'extra' | 'speedrun'): number => {
  const highScores = getHighScores();
  return highScores[gameMode];
};

export const setHighScore = (gameMode: 'regular' | 'extra' | 'speedrun', score: number): boolean => {
  try {
    const currentData = getCurrentHighScoreData();
    const currentHigh = currentData.scores[gameMode];
    
    if (score > currentHigh) {
      currentData.scores[gameMode] = score;
      currentData.lastUpdated = Date.now();
      
      saveHighScoreData(currentData);
      
      // Trigger background sync if available (for offline support)
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          return (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('high-score-sync');
        }).catch(error => {
          console.log('[HighScore] Background sync registration failed:', error);
        });
      }
      
      console.log(`[HighScore] New high score for ${gameMode}: ${score} (previous: ${currentHigh})`);
      return true; // New high score achieved
    }
    return false; // No new high score
  } catch (error) {
    console.error('[HighScore] Error setting high score:', error);
    return false;
  }
};

/**
 * Get current high score data with fallbacks
 */
const getCurrentHighScoreData = (): HighScoreData => {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) {
      const data: HighScoreData = JSON.parse(stored);
      if (data && data.scores) {
        return data;
      }
    }
  } catch (error) {
    console.error('[HighScore] Error getting current data:', error);
  }
  
  return getDefaultHighScoreData();
};

// Expose functions globally for debugging and testing
if (typeof window !== 'undefined') {
  (window as any).getHighScores = getHighScores;
  (window as any).setHighScore = setHighScore;
  (window as any).getHighScore = getHighScore;
}

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
