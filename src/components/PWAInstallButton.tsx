import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { serviceWorkerManager } from '@/utils/serviceWorkerManager';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Service worker update handling
    const handleServiceWorkerUpdate = () => {
      setShowUpdateButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          handleServiceWorkerUpdate();
        }
      });
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const handleUpdateClick = async () => {
    try {
      await serviceWorkerManager.checkForUpdates();
      setShowUpdateButton(false);
      // The service worker manager will handle the actual update
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  // Show different buttons based on state
  if (showUpdateButton) {
    return (
      <Button
        onClick={handleUpdateClick}
        variant="gameOutline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-background/90 backdrop-blur-sm border-blue-500/30 hover:border-blue-500/70 button-ripple hover-lift focus-ring-enhanced overflow-hidden group"
        style={{ position: 'fixed', top: '1rem', right: '1rem' }}
      >
        <span className="relative z-10 flex items-center gap-2 font-game tracking-wide">
          <RefreshCw className="w-4 h-4" />
          Update Available
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    );
  }

  if (showInstallButton) {
    return (
      <Button
        onClick={handleInstallClick}
        variant="gameOutline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-background/90 backdrop-blur-sm border-game-accent/30 hover:border-game-accent/70 button-ripple hover-lift focus-ring-enhanced overflow-hidden group"
        style={{ position: 'fixed', top: '1rem', right: '1rem' }}
      >
        <span className="relative z-10 flex items-center gap-2 font-game tracking-wide">
          <Download className="w-4 h-4" />
          Install App
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-game-accent/5 via-game-accent/10 to-game-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    );
  }

  // Show online/offline indicator for installed PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-game-accent/30 rounded-lg px-3 py-2">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <span className="text-xs font-game tracking-wide">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    );
  }

  return null;
};

export default PWAInstallButton;