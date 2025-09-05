import { useEffect, useCallback, useRef } from 'react';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  gameStarted: boolean;
}

export const useGameControls = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  gameStarted
}: GameControlsProps) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const repeatTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const startRepeating = useCallback((key: string, action: () => void, initialDelay = 150, repeatDelay = 50) => {
    if (repeatTimers.current.has(key)) return;
    
    // Start auto-repeat after initial delay (DAS behavior)
    const initialTimer = setTimeout(() => {
      // Clear the initial timer and start the repeat timer
      repeatTimers.current.delete(key);
      const repeatTimer = setInterval(action, repeatDelay);
      repeatTimers.current.set(key, repeatTimer);
    }, initialDelay);
    
    repeatTimers.current.set(key, initialTimer);
  }, []);

  const stopRepeating = useCallback((key: string) => {
    const timer = repeatTimers.current.get(key);
    if (timer) {
      clearTimeout(timer); // Clear both setTimeout and setInterval
      clearInterval(timer);
      repeatTimers.current.delete(key);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!gameStarted) return;

    const key = event.key;
    
    // Prevent default behavior for game keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(key)) {
      event.preventDefault();
    }

    // Ignore if key is already pressed (prevents repeat from OS)
    if (keysPressed.current.has(key)) return;
    
    keysPressed.current.add(key);

    switch (key) {
      case 'ArrowLeft':
        onMoveLeft();
        startRepeating(key, onMoveLeft, 180, 80); // 180ms initial delay, 80ms repeat
        break;
      case 'ArrowRight':
        onMoveRight();
        startRepeating(key, onMoveRight, 180, 80); // 180ms initial delay, 80ms repeat
        break;
      case 'ArrowDown':
        onMoveDown();
        startRepeating(key, onMoveDown, 0, 50); // No initial delay for soft drop
        break;
      case 'ArrowUp':
        onRotate();
        break;
      case ' ':
        onHardDrop();
        break;
    }
  }, [gameStarted, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, startRepeating]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    
    keysPressed.current.delete(key);
    stopRepeating(key);
  }, [stopRepeating]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      // Clean up all repeat timers
      repeatTimers.current.forEach(timer => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      repeatTimers.current.clear();
    };
  }, [handleKeyDown, handleKeyUp]);

  // Clean up on game state change
  useEffect(() => {
    if (!gameStarted) {
      keysPressed.current.clear();
      repeatTimers.current.forEach(timer => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      repeatTimers.current.clear();
    }
  }, [gameStarted]);
};