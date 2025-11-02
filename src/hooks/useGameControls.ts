import { useEffect, useCallback, useRef } from 'react';
import { useGameSettings } from '@/contexts/GameSettingsContext';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onPause: () => void;
  onResetConfirm?: () => void;
  onSpeedUp?: () => void;
  onSpeedDown?: () => void;
  onSpeedReset?: () => void;
  onDownKeyPress?: () => void;
  onDownKeyRelease?: () => void;
  gameStarted: boolean;
}

export const useGameControls = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
  onPause,
  onResetConfirm,
  onSpeedUp,
  onSpeedDown,
  onSpeedReset,
  onDownKeyPress,
  onDownKeyRelease,
  gameStarted
}: GameControlsProps) => {
  const { settings } = useGameSettings();
  const keysPressed = useRef<Set<string>>(new Set());
  const keyTimers = useRef<Map<string, { startTime: number; lastAction: number }>>(new Map());
  const animationFrameRef = useRef<number>();

  // Constants for timing - optimized for fast, responsive gameplay
  const INITIAL_DELAY = 100; // ms before auto-repeat starts (reduced from 150)
  const REPEAT_DELAY = 35;   // ms between auto-repeats (reduced from 60)

  // Animation frame loop for continuous key checking
  const gameLoop = useCallback(() => {
    const now = Date.now();
    
    // Check each pressed key for auto-repeat
    keysPressed.current.forEach(key => {
      const timer = keyTimers.current.get(key);
      if (!timer) return;

      // Only do auto-repeat if the setting is enabled
      if (!settings.autoRepeat) return;

      // Check if initial delay has passed
      if (now - timer.startTime >= INITIAL_DELAY) {
        // Check if it's time for another repeat action
        if (now - timer.lastAction >= REPEAT_DELAY) {
          // Perform the action based on the key
          switch (key) {
            case 'ArrowLeft':
              onMoveLeft();
              break;
            case 'ArrowRight':
              onMoveRight();
              break;
            case 'ArrowDown':
              onMoveDown();
              break;
          }
          
          // Update last action time
          timer.lastAction = now;
        }
      }
    });

    // Continue the loop if we have active keys
    if (keysPressed.current.size > 0) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [onMoveLeft, onMoveRight, onMoveDown, settings.autoRepeat]);

  const startKeyRepeat = useCallback((key: string) => {
    const now = Date.now();
    keyTimers.current.set(key, {
      startTime: now,
      lastAction: now
    });
    
    // Start the game loop if not already running
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const stopKeyRepeat = useCallback((key: string) => {
    keyTimers.current.delete(key);
    
    // Stop the game loop if no keys are pressed
    if (keysPressed.current.size === 0 && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
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
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'c', 'C', 'p', 'P', 'r', 'R', '=', '+', '-', '_', '0'].includes(key)) {
      event.preventDefault();
    }

    // Ignore if key is already pressed (prevents repeat from OS)
    if (keysPressed.current.has(key)) {
      return;
    }
    
    keysPressed.current.add(key);

    switch (key) {
      case 'ArrowLeft':
        onMoveLeft();
        if (settings.autoRepeat) {
          startKeyRepeat(key);
        }
        break;
      case 'ArrowRight':
        onMoveRight();
        if (settings.autoRepeat) {
          startKeyRepeat(key);
        }
        break;
      case 'ArrowDown':
        onMoveDown();
        onDownKeyPress?.();
        if (settings.autoRepeat) {
          startKeyRepeat(key);
        }
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
      case 'p':
      case 'P':
        onPause();
        break;
      case 'r':
      case 'R':
        onResetConfirm?.();
        break;
      case '=':
      case '+':
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
  }, [gameStarted, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onHold, onPause, onResetConfirm, onSpeedUp, onSpeedDown, onSpeedReset, onDownKeyPress, startKeyRepeat, settings.autoRepeat]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    
    if (key === 'ArrowDown') {
      onDownKeyRelease?.();
    }
    
    keysPressed.current.delete(key);
    stopKeyRepeat(key);
  }, [stopKeyRepeat, onDownKeyRelease]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      // Clean up animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Clear all timers and keys
      keyTimers.current.clear();
      keysPressed.current.clear();
    };
  }, [handleKeyDown, handleKeyUp]);

  // Clean up on game state change
  useEffect(() => {
    if (!gameStarted) {
      keysPressed.current.clear();
      keyTimers.current.clear();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }
  }, [gameStarted]);
};