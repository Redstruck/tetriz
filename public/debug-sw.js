/**
 * Service Worker Cache Updater Utility
 * 
 * This utility helps with testing service worker updates in development
 * and provides emergency cache clearing functionality.
 */

// Add this to browser console to test service worker functionality
window.tetrisPWA = {
  // Force update the service worker
  async forceUpdate() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service worker update check completed');
      }
    }
  },

  // Clear all app caches
  async clearCaches() {
    const cacheNames = await caches.keys();
    const tetrisCaches = cacheNames.filter(name => name.startsWith('tetris-'));
    
    await Promise.all(tetrisCaches.map(name => caches.delete(name)));
    console.log('Cleared caches:', tetrisCaches);
    
    // Also clear localStorage for complete reset
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tetris-')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Cleared localStorage');
  },

  // Check service worker status
  async getStatus() {
    if (!('serviceWorker' in navigator)) {
      return { supported: false };
    }

    const registration = await navigator.serviceWorker.getRegistration();
    const cacheNames = await caches.keys();
    
    return {
      supported: true,
      registered: !!registration,
      controlling: !!navigator.serviceWorker.controller,
      caches: cacheNames.filter(name => name.startsWith('tetris-')),
      online: navigator.onLine
    };
  },

  // Test high score persistence
  testHighScores() {
    const testScore = Math.floor(Math.random() * 10000);
    
    // Try to save a test high score
    if (window.setHighScore) {
      const result = window.setHighScore('regular', testScore);
      console.log('Test high score save result:', result);
    }
    
    // Try to retrieve high scores
    if (window.getHighScores) {
      const scores = window.getHighScores();
      console.log('Current high scores:', scores);
    }
  }
};

console.log('🎮 Tetris PWA debugging utilities loaded. Use window.tetrisPWA for testing.');
