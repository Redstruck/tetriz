import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Piece, Board } from '../types/tetris';
import { PIECES, rotatePiece, getRandomPieceType } from '../utils/tetrisShapes';

const createEmptyBoard = (): Board => {
  return Array(20).fill(null).map(() => Array(10).fill(''));
};

const createPiece = (type: string): Piece => {
  return {
    type: type as any,
    x: 3,
    y: -2, // Start above visible board to create falling effect
    shape: PIECES[type as keyof typeof PIECES].shape,
    rotation: 0
  };
};

export const useTetrisLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    holdPiece: null,
    holdUsed: false,
    score: 0,
    level: 1,
    linesCleared: 0,
    gameOver: false,
    gameStarted: false,
    paused: false,
    clearedRows: [],
    dropTime: 1000,
    lastDrop: 0
  });

  const [baseDropSpeed, setBaseDropSpeed] = useState(1000); // User-defined base speed

  const gameLoopRef = useRef<number>();

  const isValidPosition = useCallback((piece: Piece, board: Board, dx = 0, dy = 0, newShape?: number[][]): boolean => {
    const shape = newShape || piece.shape;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (
            newX < 0 || 
            newX >= 10 || 
            newY >= 20 || 
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece: Piece, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      });
    });
    
    return newBoard;
  }, []);

  const clearLines = useCallback((board: Board): { newBoard: Board; clearedLines: number; clearedRows: number[] } => {
    const clearedRows: number[] = [];
    const newBoard = board.filter((row, index) => {
      const isComplete = row.every(cell => cell !== '');
      if (isComplete) {
        clearedRows.push(index);
      }
      return !isComplete;
    });

    const clearedLines = clearedRows.length;
    
    // Add empty rows at the top
    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(''));
    }

    return { newBoard, clearedLines, clearedRows };
  }, []);

  const calculateScore = useCallback((lines: number, level: number): number => {
    const baseScore = [0, 40, 100, 300, 1200];
    return baseScore[lines] * level;
  }, []);

  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || !prev.gameStarted || prev.paused) return prev;

      if (isValidPosition(prev.currentPiece, prev.board, dx, dy)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            x: prev.currentPiece.x + dx,
            y: prev.currentPiece.y + dy
          }
        };
      }

      return prev;
    });
  }, [isValidPosition]);

  const rotatePieceHandler = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || !prev.gameStarted || prev.paused) return prev;

      const rotatedShape = rotatePiece(prev.currentPiece.shape);
      
      if (isValidPosition(prev.currentPiece, prev.board, 0, 0, rotatedShape)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            shape: rotatedShape,
            rotation: (prev.currentPiece.rotation + 1) % 4
          }
        };
      }

      return prev;
    });
  }, [isValidPosition]);

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || !prev.gameStarted || prev.paused) return prev;

      if (isValidPosition(prev.currentPiece, prev.board, 0, 1)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            y: prev.currentPiece.y + 1
          }
        };
      } else {
        // Piece has landed - use the next piece in queue
        const newBoard = placePiece(prev.currentPiece, prev.board);
        const { newBoard: clearedBoard, clearedLines, clearedRows } = clearLines(newBoard);
        const scoreIncrease = calculateScore(clearedLines, prev.level);
        const newLinesCleared = prev.linesCleared + clearedLines;
        const newLevel = Math.floor(newLinesCleared / 10) + 1;
        
        // Current next piece becomes the current piece, generate new next piece  
        const newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType());
        const newNextPiece = createPiece(getRandomPieceType());
        
        // Check game over
        const gameOver = !isValidPosition(newCurrentPiece, clearedBoard);

        return {
          ...prev,
          board: clearedBoard,
          currentPiece: gameOver ? null : newCurrentPiece,
          nextPiece: gameOver ? prev.nextPiece : newNextPiece,
          score: prev.score + scoreIncrease,
          level: newLevel,
          linesCleared: newLinesCleared,
          gameOver,
          clearedRows,
          dropTime: Math.max(100, 1000 - (newLevel - 1) * 100),
          holdUsed: false // Reset hold usage after piece lands
        };
      }
    });
  }, [isValidPosition, placePiece, clearLines, calculateScore]);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || !prev.gameStarted || prev.paused) return prev;

      let dropDistance = 0;
      while (isValidPosition(prev.currentPiece, prev.board, 0, dropDistance + 1)) {
        dropDistance++;
      }

      const droppedPiece = {
        ...prev.currentPiece,
        y: prev.currentPiece.y + dropDistance
      };

      const newBoard = placePiece(droppedPiece, prev.board);
      const { newBoard: clearedBoard, clearedLines, clearedRows } = clearLines(newBoard);
      const scoreIncrease = calculateScore(clearedLines, prev.level) + dropDistance * 2;
      const newLinesCleared = prev.linesCleared + clearedLines;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;
      
      // Current next piece becomes the current piece, generate new next piece
      const newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType());
      const newNextPiece = createPiece(getRandomPieceType());
      
      const gameOver = !isValidPosition(newCurrentPiece, clearedBoard);

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: gameOver ? null : newCurrentPiece,
        nextPiece: gameOver ? prev.nextPiece : newNextPiece,
        score: prev.score + scoreIncrease,
        level: newLevel,
        linesCleared: newLinesCleared,
        gameOver,
        clearedRows,
        dropTime: Math.max(100, baseDropSpeed - (newLevel - 1) * 100),
        holdUsed: false // Reset hold usage after piece lands
      };
    });
  }, [isValidPosition, placePiece, clearLines, calculateScore]);

  const startGame = useCallback(() => {
    const firstPiece = createPiece(getRandomPieceType());
    const secondPiece = createPiece(getRandomPieceType());
    
    setGameState(prev => ({
      ...prev,
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      holdPiece: null,
      holdUsed: false,
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      gameStarted: true,
      paused: false,
      clearedRows: [],
      dropTime: baseDropSpeed,
      lastDrop: Date.now()
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: null,
      nextPiece: null,
      holdPiece: null,
      holdUsed: false,
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      gameStarted: false,
      paused: false,
      clearedRows: [],
      dropTime: baseDropSpeed,
      lastDrop: 0
    });
  }, [baseDropSpeed]);

  // Game loop
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.paused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      const now = Date.now();
      if (now - gameState.lastDrop > gameState.dropTime) {
        dropPiece();
        setGameState(prev => ({ ...prev, lastDrop: now }));
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameState.paused, gameState.dropTime, gameState.lastDrop, dropPiece]);

  // Clear cleared rows animation
  useEffect(() => {
    if (gameState.clearedRows.length > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, clearedRows: [] }));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState.clearedRows]);

  const holdPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || !prev.gameStarted || prev.holdUsed || prev.paused) {
        return prev;
      }

      const currentPieceToHold = { ...prev.currentPiece };
      let newCurrentPiece: Piece;
      let newNextPiece = prev.nextPiece;

      if (prev.holdPiece) {
        // Swap current piece with hold piece
        newCurrentPiece = {
          ...prev.holdPiece,
          x: 3,
          y: -2,
          rotation: 0
        };
      } else {
        // No piece in hold, use next piece as current
        newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType());
        newNextPiece = createPiece(getRandomPieceType());
      }

      // Check if the new current piece can fit
      const gameOver = !isValidPosition(newCurrentPiece, prev.board);

      return {
        ...prev,
        currentPiece: gameOver ? null : newCurrentPiece,
        nextPiece: gameOver ? prev.nextPiece : newNextPiece,
        holdPiece: {
          ...currentPieceToHold,
          x: 3,
          y: -2,
          rotation: 0
        },
        holdUsed: true,
        gameOver: gameOver || prev.gameOver
      };
    });
  }, [isValidPosition]);

  const getGhostPiece = useCallback((): Piece | null => {
    if (!gameState.currentPiece) return null;
    
    let dropDistance = 0;
    while (isValidPosition(gameState.currentPiece, gameState.board, 0, dropDistance + 1)) {
      dropDistance++;
    }
    
    return {
      ...gameState.currentPiece,
      y: gameState.currentPiece.y + dropDistance
    };
  }, [gameState.currentPiece, gameState.board, isValidPosition]);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (!prev.gameStarted || prev.gameOver) {
        return prev;
      }
      
      return {
        ...prev,
        paused: !prev.paused,
        lastDrop: prev.paused ? Date.now() : prev.lastDrop // Reset drop timer when unpausing
      };
    });
  }, []);

  const setDropSpeed = useCallback((speed: number) => {
    setBaseDropSpeed(speed);
    // Update current drop time if game is running
    if (gameState.gameStarted) {
      setGameState(prev => ({
        ...prev,
        dropTime: Math.max(100, speed - (prev.level - 1) * 100)
      }));
    }
  }, [gameState.gameStarted, gameState.level]);

  return {
    board: gameState.board,
    currentPiece: gameState.currentPiece,
    nextPiece: gameState.nextPiece,
    holdPiece: gameState.holdPiece,
    holdUsed: gameState.holdUsed,
    ghostPiece: getGhostPiece(),
    score: gameState.score,
    level: gameState.level,
    linesCleared: gameState.linesCleared,
    gameOver: gameState.gameOver,
    gameStarted: gameState.gameStarted,
    paused: gameState.paused,
    clearedRows: gameState.clearedRows,
    baseDropSpeed,
    setDropSpeed,
    startGame,
    resetGame,
    movePiece,
    rotatePiece: rotatePieceHandler,
    dropPiece,
    hardDrop,
    holdPieceAction: holdPiece,
    togglePause
  };
};