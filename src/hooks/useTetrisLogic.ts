import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Piece, Board } from '../types/tetris';
import { getPieceData, rotatePiece, getRandomPieceType, resetPieceBag } from '../utils/tetrisShapes';

const createEmptyBoard = (width: number = 10): Board => {
  return Array(20).fill(null).map(() => Array(width).fill(''));
};

const createPiece = (type: string, boardWidth: number = 10): Piece => {
  const pieceData = getPieceData(type as any);
  return {
    type: type as any,
    x: Math.floor(boardWidth / 2) - 2, // Center piece horizontally
    y: -2, // Start above visible board to create falling effect
    shape: pieceData.shape,
    rotation: 0
  };
};

export const useTetrisLogic = (gameMode: 'regular' | 'extra' | 'speedrun' = 'regular') => {
  // Board dimensions based on game mode (speedrun uses same as regular)
  const BOARD_WIDTH = gameMode === 'extra' ? 12 : 10;
  const BOARD_HEIGHT = 20;

  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(BOARD_WIDTH),
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
    lastDrop: 0,
    // Speedrun mode specific
    greyBlocks: gameMode === 'speedrun' ? [] : undefined,
    wavesCleared: gameMode === 'speedrun' ? 0 : undefined,
    currentRound: gameMode === 'speedrun' ? 1 : undefined,
    targetsDestroyedInRound: gameMode === 'speedrun' ? 0 : undefined,
    waveStartTime: undefined,
    totalTime: gameMode === 'speedrun' ? 0 : undefined
  });

  const [baseDropSpeed, setBaseDropSpeed] = useState(1000); // Normal speed as default

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
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT || 
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

  const placePiece = useCallback((piece: Piece, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      });
    });
    
    return newBoard;
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

  // Speedrun mode helper functions
  const getTargetsForRound = useCallback((round: number): number => {
    // Progressive target increase: 
    // Rounds 1-4: 1 target, 5-8: 2 targets, 9-12: 3 targets, etc.
    return Math.floor((round - 1) / 4) + 1;
  }, []);

  const generateGreyBlocks = useCallback((count: number = 5): { x: number; y: number }[] => {
    const greyBlocks: { x: number; y: number }[] = [];
    const attempts = 100; // Prevent infinite loops
    
    // Create balanced spawn zones to ensure better distribution
    const spawnZones: { x: number; y: number }[] = [];
    
    // Generate potential spawn positions across the grid
    for (let y = 5; y < BOARD_HEIGHT - 2; y++) { // Leave top and bottom clear
      for (let x = 0; x < BOARD_WIDTH; x++) {
        spawnZones.push({ x, y });
      }
    }
    
    // Shuffle spawn zones to prevent predictable patterns
    for (let i = spawnZones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [spawnZones[i], spawnZones[j]] = [spawnZones[j], spawnZones[i]];
    }
    
    // Select targets ensuring they don't overlap
    for (let i = 0; i < Math.min(count, spawnZones.length) && greyBlocks.length < count; i++) {
      const zone = spawnZones[i];
      
      // Check if position is already occupied
      const isOccupied = greyBlocks.some(block => block.x === zone.x && block.y === zone.y);
      if (!isOccupied) {
        greyBlocks.push({ x: zone.x, y: zone.y });
      }
    }
    
    return greyBlocks;
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

  const placeGreyBlocksOnBoard = useCallback((board: Board, greyBlocks: { x: number; y: number }[]): Board => {
    const newBoard = board.map(row => [...row]);
    greyBlocks.forEach(({ x, y }) => {
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        newBoard[y][x] = 'grey-target';
      }
    });
    return newBoard;
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

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
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }

    return { newBoard, clearedLines, clearedRows };
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

  // Speedrun specific line clearing that tracks grey blocks
  const clearLinesSpeedrun = useCallback((board: Board, greyBlocks: { x: number; y: number }[]): { 
    newBoard: Board; 
    clearedLines: number; 
    clearedRows: number[];
    remainingGreyBlocks: { x: number; y: number }[];
    greyBlocksCleared: number;
  } => {
    const clearedRows: number[] = [];
    let greyBlocksCleared = 0;
    
    // Find complete rows and count grey blocks in them
    const newBoard = board.filter((row, index) => {
      const isComplete = row.every(cell => cell !== '');
      if (isComplete) {
        clearedRows.push(index);
        // Count grey blocks in this row
        const greyBlocksInRow = greyBlocks.filter(block => block.y === index).length;
        greyBlocksCleared += greyBlocksInRow;
      }
      return !isComplete;
    });

    const clearedLines = clearedRows.length;
    
    // Remove grey blocks that were in cleared rows and adjust y positions for remaining blocks
    const remainingGreyBlocks = greyBlocks
      .filter(block => !clearedRows.includes(block.y))
      .map(block => {
        // Adjust y position based on how many rows below were cleared
        const rowsBelow = clearedRows.filter(row => row > block.y).length;
        return { ...block, y: block.y + rowsBelow };
      });
    
    // Add empty rows at the top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }

    return { newBoard, clearedLines, clearedRows, remainingGreyBlocks, greyBlocksCleared };
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

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
        
        // Handle line clearing differently for speedrun mode
        if (gameMode === 'speedrun' && prev.greyBlocks) {
          const { 
            newBoard: clearedBoard, 
            clearedLines, 
            clearedRows,
            remainingGreyBlocks,
            greyBlocksCleared 
          } = clearLinesSpeedrun(newBoard, prev.greyBlocks);
          
          const scoreIncrease = calculateScore(clearedLines, prev.level);
          const newLinesCleared = prev.linesCleared + clearedLines;
          const newLevel = Math.floor(newLinesCleared / 10) + 1;
          const newDropTime = Math.max(100, baseDropSpeed - (newLevel - 1) * 100);
          
          // Current next piece becomes the current piece, generate new next piece  
          const newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
          const newNextPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
          
          // Progressive round system - track targets destroyed
          let finalBoard = clearedBoard;
          let finalGreyBlocks = remainingGreyBlocks;
          let currentRound = prev.currentRound || 1;
          let targetsDestroyedInRound = (prev.targetsDestroyedInRound || 0) + greyBlocksCleared;
          let wavesCleared = prev.wavesCleared || 0;
          
          const targetsNeededForRound = getTargetsForRound(currentRound);
          
          // Check if round is completed (all targets destroyed)
          if (targetsDestroyedInRound >= targetsNeededForRound) {
            // Round completed! Move to next round
            currentRound++;
            targetsDestroyedInRound = 0;
            wavesCleared++; // Keep track of completed rounds for scoring
            
            // Generate new targets for the next round
            const newTargetsCount = getTargetsForRound(currentRound);
            const newGreyBlocks = generateGreyBlocks(newTargetsCount);
            finalBoard = placeGreyBlocksOnBoard(clearedBoard, newGreyBlocks);
            finalGreyBlocks = newGreyBlocks;
          } else {
            // Place remaining grey blocks back on the board
            finalBoard = placeGreyBlocksOnBoard(clearedBoard, remainingGreyBlocks);
          }
          
          // Check game over
          const gameOver = !isValidPosition(newCurrentPiece, finalBoard);

          return {
            ...prev,
            board: finalBoard,
            currentPiece: gameOver ? null : newCurrentPiece,
            nextPiece: gameOver ? prev.nextPiece : newNextPiece,
            score: prev.score + scoreIncrease,
            level: newLevel,
            linesCleared: newLinesCleared,
            gameOver,
            clearedRows,
            dropTime: newDropTime,
            holdUsed: false, // Reset hold usage after piece lands
            greyBlocks: finalGreyBlocks,
            wavesCleared,
            currentRound,
            targetsDestroyedInRound
          };
        } else {
          // Regular mode line clearing
          const { newBoard: clearedBoard, clearedLines, clearedRows } = clearLines(newBoard);
          const scoreIncrease = calculateScore(clearedLines, prev.level);
          const newLinesCleared = prev.linesCleared + clearedLines; 
          const newLevel = Math.floor(newLinesCleared / 10) + 1;
          const newDropTime = Math.max(100, baseDropSpeed - (newLevel - 1) * 100);
          
          // Current next piece becomes the current piece, generate new next piece  
          const newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
          const newNextPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
          
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
            dropTime: newDropTime,
            holdUsed: false // Reset hold usage after piece lands
          };
        }
      }
    });
  }, [isValidPosition, placePiece, clearLines, clearLinesSpeedrun, calculateScore, gameMode, BOARD_WIDTH, generateGreyBlocks, placeGreyBlocksOnBoard, baseDropSpeed]);

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
      
      // Handle line clearing differently for speedrun mode
      if (gameMode === 'speedrun' && prev.greyBlocks) {
        const { 
          newBoard: clearedBoard, 
          clearedLines, 
          clearedRows,
          remainingGreyBlocks,
          greyBlocksCleared 
        } = clearLinesSpeedrun(newBoard, prev.greyBlocks);
        
        const scoreIncrease = calculateScore(clearedLines, prev.level) + dropDistance * 2;
        const newLinesCleared = prev.linesCleared + clearedLines;
        const newLevel = Math.floor(newLinesCleared / 10) + 1;
        
        // Current next piece becomes the current piece, generate new next piece
        const newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
        const newNextPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
        
        // Progressive round system - track targets destroyed
        let finalBoard = clearedBoard;
        let finalGreyBlocks = remainingGreyBlocks;
        let currentRound = prev.currentRound || 1;
        let targetsDestroyedInRound = (prev.targetsDestroyedInRound || 0) + greyBlocksCleared;
        let wavesCleared = prev.wavesCleared || 0;
        
        const targetsNeededForRound = getTargetsForRound(currentRound);
        
        // Check if round is completed (all targets destroyed)
        if (targetsDestroyedInRound >= targetsNeededForRound) {
          // Round completed! Move to next round
          currentRound++;
          targetsDestroyedInRound = 0;
          wavesCleared++; // Keep track of completed rounds for scoring
          
          // Generate new targets for the next round
          const newTargetsCount = getTargetsForRound(currentRound);
          const newGreyBlocks = generateGreyBlocks(newTargetsCount);
          finalBoard = placeGreyBlocksOnBoard(clearedBoard, newGreyBlocks);
          finalGreyBlocks = newGreyBlocks;
        } else {
          // Place remaining grey blocks back on the board
          finalBoard = placeGreyBlocksOnBoard(clearedBoard, remainingGreyBlocks);
        }
        
        const gameOver = !isValidPosition(newCurrentPiece, finalBoard);

        return {
          ...prev,
          board: finalBoard,
          currentPiece: gameOver ? null : newCurrentPiece,
          nextPiece: gameOver ? prev.nextPiece : newNextPiece,
          score: prev.score + scoreIncrease,
          level: newLevel,
          linesCleared: newLinesCleared,
          gameOver,
          clearedRows,
          dropTime: Math.max(100, baseDropSpeed - (newLevel - 1) * 100),
          holdUsed: false, // Reset hold usage after piece lands
          greyBlocks: finalGreyBlocks,
          wavesCleared,
          currentRound,
          targetsDestroyedInRound
        };
      } else {
        // Regular mode line clearing
        const { newBoard: clearedBoard, clearedLines, clearedRows } = clearLines(newBoard);
        const scoreIncrease = calculateScore(clearedLines, prev.level) + dropDistance * 2;
        const newLinesCleared = prev.linesCleared + clearedLines;
        const newLevel = Math.floor(newLinesCleared / 10) + 1;
        
        // Current next piece becomes the current piece, generate new next piece
        const newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
        const newNextPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
        
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
      }
    });
  }, [isValidPosition, placePiece, clearLines, clearLinesSpeedrun, calculateScore, gameMode, BOARD_WIDTH, generateGreyBlocks, placeGreyBlocksOnBoard, baseDropSpeed]);

  const startGame = useCallback(() => {
    resetPieceBag(gameMode); // Reset the piece bag to ensure fair distribution
    const firstPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
    const secondPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
    
    // Initialize speedrun mode with grey blocks
    let initialBoard = createEmptyBoard(BOARD_WIDTH);
    let initialGreyBlocks: { x: number; y: number }[] | undefined;
    
    if (gameMode === 'speedrun') {
      // Start with round 1 - should have 1 target
      const initialTargetCount = getTargetsForRound(1);
      initialGreyBlocks = generateGreyBlocks(initialTargetCount);
      initialBoard = placeGreyBlocksOnBoard(initialBoard, initialGreyBlocks);
    }
    
    setGameState(prev => ({
      ...prev,
      board: initialBoard,
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
      lastDrop: Date.now(),
      // Speedrun mode specific initialization
      greyBlocks: initialGreyBlocks,
      wavesCleared: gameMode === 'speedrun' ? 0 : undefined,
      currentRound: gameMode === 'speedrun' ? 1 : undefined,
      targetsDestroyedInRound: gameMode === 'speedrun' ? 0 : undefined,
      waveStartTime: gameMode === 'speedrun' ? Date.now() : undefined,
      totalTime: gameMode === 'speedrun' ? 0 : undefined
    }));
  }, [baseDropSpeed, BOARD_WIDTH, gameMode, getTargetsForRound, generateGreyBlocks, placeGreyBlocksOnBoard]);

  const resetGame = useCallback(() => {
    resetPieceBag(gameMode); // Reset the piece bag for fresh distribution
    setGameState({
      board: createEmptyBoard(BOARD_WIDTH),
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
      lastDrop: 0,
      // Speedrun mode specific
      greyBlocks: gameMode === 'speedrun' ? [] : undefined,
      wavesCleared: gameMode === 'speedrun' ? 0 : undefined,
      currentRound: gameMode === 'speedrun' ? 1 : undefined,
      targetsDestroyedInRound: gameMode === 'speedrun' ? 0 : undefined,
      waveStartTime: undefined,
      totalTime: gameMode === 'speedrun' ? 0 : undefined
    });
  }, [baseDropSpeed, BOARD_WIDTH, gameMode, generateGreyBlocks, placeGreyBlocksOnBoard]);

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

  // Clear cleared rows animation - reduced time for faster gameplay
  useEffect(() => {
    if (gameState.clearedRows.length > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, clearedRows: [] }));
      }, 300); // Reduced from 800ms to 300ms
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
          x: Math.floor(BOARD_WIDTH / 2) - 2,
          y: -2,
          rotation: 0
        };
      } else {
        // No piece in hold, use next piece as current
        newCurrentPiece = prev.nextPiece || createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
        newNextPiece = createPiece(getRandomPieceType(gameMode), BOARD_WIDTH);
      }

      // Check if the new current piece can fit
      const gameOver = !isValidPosition(newCurrentPiece, prev.board);

      return {
        ...prev,
        currentPiece: gameOver ? null : newCurrentPiece,
        nextPiece: gameOver ? prev.nextPiece : newNextPiece,
        holdPiece: {
          ...currentPieceToHold,
          x: Math.floor(BOARD_WIDTH / 2) - 2,
          y: -2,
          rotation: 0
        },
        holdUsed: true,
        gameOver: gameOver || prev.gameOver
      };
    });
  }, [isValidPosition, gameMode, BOARD_WIDTH]);

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
    // Update current drop time regardless of game state
    setGameState(prev => {
      const newDropTime = Math.max(100, speed - (prev.level - 1) * 100);
      return {
        ...prev,
        dropTime: newDropTime
      };
    });
  }, []);

  // Optimized timer for speedrun mode - using ref to avoid re-renders
  const speedrunTimerRef = useRef<number | null>(null);
  const [speedrunTime, setSpeedrunTime] = useState(0);
  
  useEffect(() => {
    if (gameMode !== 'speedrun' || !gameState.gameStarted || gameState.gameOver || gameState.paused || !gameState.waveStartTime) {
      if (speedrunTimerRef.current) {
        cancelAnimationFrame(speedrunTimerRef.current);
        speedrunTimerRef.current = null;
      }
      return;
    }

    const updateTimer = () => {
      const currentTime = Date.now() - (gameState.waveStartTime || 0);
      setSpeedrunTime(currentTime);
      speedrunTimerRef.current = requestAnimationFrame(updateTimer);
    };

    speedrunTimerRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (speedrunTimerRef.current) {
        cancelAnimationFrame(speedrunTimerRef.current);
        speedrunTimerRef.current = null;
      }
    };
  }, [gameMode, gameState.gameStarted, gameState.gameOver, gameState.paused, gameState.waveStartTime]);

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
    togglePause,
    // Speedrun mode specific
    greyBlocks: gameState.greyBlocks,
    wavesCleared: gameState.wavesCleared,
    currentRound: gameState.currentRound,
    targetsDestroyedInRound: gameState.targetsDestroyedInRound,
    totalTime: gameMode === 'speedrun' ? speedrunTime : gameState.totalTime
  };
};