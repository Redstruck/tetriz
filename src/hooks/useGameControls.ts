import { useEffect, useCallback, useRef } from 'react';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onSpeedUp?: () => void;
  onSpeedDown?: () => void;
  onSpeedReset?: () => void;
  gameStarted: boolean;
}

export const useGameControls = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
  onSpeedUp,
  onSpeedDown,
  onSpeedReset,
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
    const key = event.key;
    
    // Speed controls work even when game is not started
    if (!gameStarted) {
      if (key === '=' || key === '+') {
        event.preventDefault();
        onSpeedUp?.();
        return;
      }
      if (key === '-' || key === '_') {
        event.preventDefault();
        onSpeedDown?.();
        return;
      }
      if (key === '0') {
        event.preventDefault();
        onSpeedReset?.();
        return;
      }
      return;
    }
    
    // Prevent default behavior for game keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'c', 'C', '=', '+', '-', '_', '0'].includes(key)) {
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
      case 'c':
      case 'C':
        onHold();
        break;
      case '=':
      case '+':
        // Speed controls only work when game is not active
        if (!gameStarted) {
          onSpeedUp?.();
        }
        break;
      case '-':
      case '_':
        if (!gameStarted) {
          onSpeedDown?.();
        }
        break;
      case '0':
        if (!gameStarted) {
          onSpeedReset?.();
        }
        break;
    }
  }, [gameStarted, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onHold, onSpeedUp, onSpeedDown, onSpeedReset, startRepeating]);

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