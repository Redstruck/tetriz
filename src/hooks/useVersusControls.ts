import { useEffect, useCallback, useRef } from 'react';

interface VersusControlsProps {
  // Player 1 controls (Arrow keys)
  player1: {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onMoveDown: () => void;
    onRotate: () => void;
    onHardDrop: () => void;
    onHold: () => void;
    gameStarted: boolean;
    paused: boolean;
  };
  // Player 2 controls (WASD)
  player2: {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onMoveDown: () => void;
    onRotate: () => void;
    onHardDrop: () => void;
    onHold: () => void;
    gameStarted: boolean;
    paused: boolean;
  };
  winner: 'player1' | 'player2' | null;
}

export const useVersusControls = ({ player1, player2, winner }: VersusControlsProps) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const keyTimers = useRef<Map<string, { startTime: number; lastAction: number }>>(new Map());
  const animationFrameRef = useRef<number>();
  
  // Store the latest props in refs to avoid dependency issues
  const player1Ref = useRef(player1);
  const player2Ref = useRef(player2);
  const winnerRef = useRef(winner);
  
  useEffect(() => {
    player1Ref.current = player1;
    player2Ref.current = player2;
    winnerRef.current = winner;
  });

  // Constants for timing - slower for better control
  const INITIAL_DELAY = 150; // ms before auto-repeat starts
  const REPEAT_DELAY = 60;   // ms between auto-repeats

  // Animation frame loop for continuous key checking
  const gameLoop = useCallback(() => {
    const now = Date.now();
    const p1 = player1Ref.current;
    const p2 = player2Ref.current;
    const w = winnerRef.current;
    
    // Check each pressed key for auto-repeat
    keysPressed.current.forEach(key => {
      const timer = keyTimers.current.get(key);
      if (!timer) return;

      // Check if initial delay has passed
      if (now - timer.startTime >= INITIAL_DELAY) {
        // Check if it's time for another repeat action
        if (now - timer.lastAction >= REPEAT_DELAY) {
          // Perform the action based on the key - Player 1 (Arrow keys)
          if (p1.gameStarted && !p1.paused && !w) {
            switch (key) {
              case 'ArrowLeft':
                p1.onMoveLeft();
                timer.lastAction = now;
                break;
              case 'ArrowRight':
                p1.onMoveRight();
                timer.lastAction = now;
                break;
              case 'ArrowDown':
                p1.onMoveDown();
                timer.lastAction = now;
                break;
            }
          }

          // Perform the action based on the key - Player 2 (WASD)
          if (p2.gameStarted && !p2.paused && !w) {
            switch (key) {
              case 'a':
              case 'A':
                p2.onMoveLeft();
                timer.lastAction = now;
                break;
              case 'd':
              case 'D':
                p2.onMoveRight();
                timer.lastAction = now;
                break;
              case 's':
              case 'S':
                p2.onMoveDown();
                timer.lastAction = now;
                break;
            }
          }
        }
      }
    });

    // Continue the loop if we have active keys
    if (keysPressed.current.size > 0) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  // Handle key down
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const w = winnerRef.current;
    const p1 = player1Ref.current;
    const p2 = player2Ref.current;
    
    if (w) return;

    const key = e.key;
    
    // Prevent default for game control keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'a', 'A', 'd', 'D', 's', 'S', 'w', 'W', 'c', 'C', 'q', 'Q', 'Shift'].includes(key)) {
      e.preventDefault();
    }

    // Ignore if key is already pressed (prevents repeat from OS)
    if (keysPressed.current.has(key)) {
      return;
    }
    
    keysPressed.current.add(key);

    // Handle non-repeating keys immediately - Player 1
    if (p1.gameStarted && !p1.paused) {
      if (key === 'ArrowUp') {
        p1.onRotate();
        return;
      }
      if (key === ' ') {
        p1.onHardDrop();
        return;
      }
      if (key === 'c' || key === 'C') {
        p1.onHold();
        return;
      }
    }

    // Handle non-repeating keys immediately - Player 2
    if (p2.gameStarted && !p2.paused) {
      if (key === 'w' || key === 'W') {
        p2.onRotate();
        return;
      }
      if (key === 'Shift') {
        p2.onHardDrop();
        return;
      }
      if (key === 'q' || key === 'Q') {
        p2.onHold();
        return;
      }
    }

    // Handle repeating movement keys - Player 1
    if (p1.gameStarted && !p1.paused && !w) {
      switch (key) {
        case 'ArrowLeft':
          p1.onMoveLeft();
          keyTimers.current.set(key, { startTime: Date.now(), lastAction: Date.now() });
          break;
        case 'ArrowRight':
          p1.onMoveRight();
          keyTimers.current.set(key, { startTime: Date.now(), lastAction: Date.now() });
          break;
        case 'ArrowDown':
          p1.onMoveDown();
          keyTimers.current.set(key, { startTime: Date.now(), lastAction: Date.now() });
          break;
      }
    }

    // Handle repeating movement keys - Player 2
    if (p2.gameStarted && !p2.paused && !w) {
      switch (key) {
        case 'a':
        case 'A':
          p2.onMoveLeft();
          keyTimers.current.set(key, { startTime: Date.now(), lastAction: Date.now() });
          break;
        case 'd':
        case 'D':
          p2.onMoveRight();
          keyTimers.current.set(key, { startTime: Date.now(), lastAction: Date.now() });
          break;
        case 's':
        case 'S':
          p2.onMoveDown();
          keyTimers.current.set(key, { startTime: Date.now(), lastAction: Date.now() });
          break;
      }
    }

    // Start the game loop if not already running and we have movement keys
    const repeatableKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'a', 'A', 'd', 'D', 's', 'S'];
    if (repeatableKeys.includes(key) && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  // Handle key up
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    
    if (keysPressed.current.has(key)) {
      keysPressed.current.delete(key);
      keyTimers.current.delete(key);
    }

    // Cancel animation frame if no keys are pressed
    if (keysPressed.current.size === 0 && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      // Clean up animation frame on unmount
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp]);

  // Clean up when winner is determined
  useEffect(() => {
    if (winner) {
      keysPressed.current.clear();
      keyTimers.current.clear();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }
  }, [winner]);
};
