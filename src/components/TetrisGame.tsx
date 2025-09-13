import { useEffect, useState, useCallback } from 'react';
import { RetroGameBoard } from './RetroGameBoard';
import { RetroHoldUI } from './RetroHoldUI';
import { RetroNextUI } from './RetroNextUI';
import { LeftStatsPanel } from './LeftStatsPanel';
import { RightStatsPanel } from './RightStatsPanel';
import { GameOverlay } from './GameOverlay';
import { useTetrisLogic } from '../hooks/useTetrisLogic';
import { useGameControls } from '../hooks/useGameControls';

export const TetrisGame = () => {
  const [gameTime, setGameTime] = useState(0);
  
  const {
    board,
    currentPiece,
    nextPiece,
    holdPiece,
    holdUsed,
    ghostPiece,
    score,
    level,
    linesCleared,
    gameOver,
    gameStarted,
    clearedRows,
    startGame,
    resetGame,
    movePiece,
    rotatePiece,
    dropPiece,
    hardDrop,
    holdPieceAction
  } = useTetrisLogic();

  useGameControls({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => dropPiece(),
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onHold: holdPieceAction,
    gameStarted
  });

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Reset timer when game starts
  useEffect(() => {
    if (gameStarted) {
      setGameTime(0);
    }
  }, [gameStarted]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden relative">
      <div className="flex items-start justify-center gap-8 p-4">
        {/* Left Panel - Hold and Stats */}
        <div className="flex flex-col items-start gap-8">
          <RetroHoldUI 
            holdPiece={holdPiece}
            holdUsed={holdUsed}
          />
          <LeftStatsPanel 
            linesCleared={linesCleared}
            gameTime={gameTime}
          />
        </div>
        
        {/* Game Board */}
        <div className="relative">
          <RetroGameBoard 
            board={board} 
            currentPiece={currentPiece}
            ghostPiece={ghostPiece}
            clearedRows={clearedRows}
          />
          <GameOverlay 
            gameStarted={gameStarted}
            gameOver={gameOver}
            onStart={startGame}
            onReset={resetGame}
          />
        </div>
        
        {/* Right Panel - Next and Stats */}
        <div className="flex flex-col items-start gap-8">
          <RetroNextUI nextPiece={nextPiece} />
          <RightStatsPanel 
            level={level}
            score={score}
          />
        </div>
      </div>
      
      {/* Bottom controls text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-mono text-sm">
        NULLNUMBERING || C
      </div>
    </div>
  );
};