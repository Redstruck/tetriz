/**
 * Service Worker Manager for Tetris PWA
 * 
 * This module handles:
 * - Service worker registration and updates
 * - User notifications for app updates
 * - Graceful handling of cache refreshes
 * - Offline/online status management
 */

interface ServiceWorkerManager {
  register: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  isOnline: boolean;
}

class PWAServiceWorkerManager implements ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  public isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('[PWA] App is back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('[PWA] App is offline');
    });
  }

  /**
   * Register the service worker and set up update handling
   */
  async register(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service workers are not supported');
      return;
    }

    try {
      console.log('[PWA] Registering service worker...');
      
      // Register the service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      console.log('[PWA] Service worker registered successfully:', this.registration);

      // Set up update handling
      this.setupUpdateHandling();

      // Check for updates immediately after registration
      await this.checkForUpdates();

      // Set up periodic update checks (every 30 minutes)
      setInterval(() => {
        this.checkForUpdates();
      }, 30 * 60 * 1000);

    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  }

  /**
   * Set up service worker update event handling
   */
  private setupUpdateHandling(): void {
    if (!this.registration) return;

    // Listen for waiting service worker (update available)
    this.registration.addEventListener('updatefound', () => {
      console.log('[PWA] New service worker found, installing...');
      
      const newWorker = this.registration!.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New service worker installed, update available');
            this.updateAvailable = true;
            this.showUpdateNotification();
          }
        });
      }
    });

    // Listen for controlling service worker change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.updateAvailable) {
        console.log('[PWA] Service worker controller changed, reloading page');
        window.location.reload();
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        this.showUpdateNotification();
      }
    });
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      console.log('[PWA] Checking for service worker updates...');
      await this.registration.update();
    } catch (error) {
      console.error('[PWA] Error checking for updates:', error);
    }
  }

  /**
   * Show update notification to user
   */
  private showUpdateNotification(): void {
    // Create a subtle notification element
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1a1a1a;
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 300px;
        border: 1px solid #333;
      ">
        <div style="margin-bottom: 12px;">
          🎮 <strong>App Update Available!</strong>
        </div>
        <div style="margin-bottom: 12px; opacity: 0.9;">
          A new version of Tetris is ready. Refresh to get the latest features and improvements.
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="pwa-update-btn" style="
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
          ">Update Now</button>
          <button id="pwa-dismiss-btn" style="
            background: transparent;
            color: #ccc;
            border: 1px solid #555;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Later</button>
        </div>
      </div>
    `;

    // Remove existing notification if present
    const existing = document.getElementById('pwa-update-notification');
    if (existing) {
      existing.remove();
    }

    document.body.appendChild(notification);

    // Handle update button click
    const updateBtn = document.getElementById('pwa-update-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');

    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        this.applyUpdate();
        notification.remove();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        notification.remove();
      });
    }

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.getElementById('pwa-update-notification')) {
        notification.remove();
      }
    }, 30000);
  }

  /**
   * Apply the service worker update
   */
  private applyUpdate(): void {
    if (!this.registration || !this.registration.waiting) {
      console.log('[PWA] No waiting service worker found');
      return;
    }

    console.log('[PWA] Applying service worker update');
    
    // Tell the waiting service worker to skip waiting
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  /**
   * Get registration status
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * Force refresh app cache (for emergency use)
   */
  async forceRefresh(): Promise<void> {
    try {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith('tetris-'))
          .map(name => caches.delete(name))
      );

      console.log('[PWA] All app caches cleared');

      // Unregister service worker
      if (this.registration) {
        await this.registration.unregister();
        console.log('[PWA] Service worker unregistered');
      }

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('[PWA] Error during force refresh:', error);
      // Fallback: just reload
      window.location.reload();
    }
  }

  /**
   * Handle service worker errors and recovery
   */
  private handleServiceWorkerError(error: Error): void {
    console.error('[PWA] Service worker error:', error);
    
    // If we're getting consistent errors, try to recover
    const errorCount = parseInt(sessionStorage.getItem('sw-error-count') || '0');
    sessionStorage.setItem('sw-error-count', String(errorCount + 1));

    if (errorCount >= 3) {
      console.log('[PWA] Multiple service worker errors detected, attempting recovery');
      
      // Clear error count
      sessionStorage.removeItem('sw-error-count');
      
      // Try to recover by clearing caches and re-registering
      this.recoverFromErrors();
    }
  }

  /**
   * Attempt recovery from persistent service worker issues
   */
  private async recoverFromErrors(): Promise<void> {
    try {
      // Clear all Tetris caches
      const cacheNames = await caches.keys();
      const tetrisCaches = cacheNames.filter(name => name.startsWith('tetris-'));
      
      if (tetrisCaches.length > 0) {
        await Promise.all(tetrisCaches.map(name => caches.delete(name)));
        console.log('[PWA] Cleared caches during recovery:', tetrisCaches);
      }

      // Unregister and re-register service worker
      if (this.registration) {
        await this.registration.unregister();
        console.log('[PWA] Unregistered service worker during recovery');
      }

      // Wait a bit then re-register
      setTimeout(async () => {
        await this.register();
        console.log('[PWA] Re-registered service worker after recovery');
      }, 1000);

    } catch (error) {
      console.error('[PWA] Recovery failed:', error);
      // Last resort: reload the page
      window.location.reload();
    }
  }

  /**
   * Check if PWA needs recovery (called on app start)
   */
  checkHealth(): boolean {
    const errorCount = parseInt(sessionStorage.getItem('sw-error-count') || '0');
    const lastRecovery = parseInt(localStorage.getItem('pwa-last-recovery') || '0');
    const now = Date.now();
    
    // If there were errors recently or recovery was recent, we might have issues
    if (errorCount > 0 || (now - lastRecovery < 300000)) { // 5 minutes
      console.log('[PWA] Potential health issues detected');
      return false;
    }
    
    return true;
  }
}

// Create and export singleton instance
export const serviceWorkerManager = new PWAServiceWorkerManager();

// Export the interface for type safety
export type { ServiceWorkerManager };
