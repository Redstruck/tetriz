import { useEffect, useState, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameUI } from './GameUI';
import { HoldUI } from './HoldUI';
import { useTetrisLogic } from '../hooks/useTetrisLogic';
import { useGameControls } from '../hooks/useGameControls';

export const TetrisGame = () => {
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

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-4 max-w-7xl w-full">
        {/* Hold UI */}
        <div className="flex-shrink-0 order-1 lg:order-1">
          <HoldUI 
            holdPiece={holdPiece}
            holdUsed={holdUsed}
          />
        </div>
        
        {/* Game Board */}
        <div className="flex-shrink-0 order-2 lg:order-2">
        <GameBoard 
          board={board} 
          currentPiece={currentPiece}
          ghostPiece={ghostPiece}
          clearedRows={clearedRows}
        />
        </div>
        
        {/* Game UI */}
        <div className="flex-shrink-0 order-3 lg:order-3">
          <GameUI
            score={score}
            level={level}
            linesCleared={linesCleared}
            nextPiece={nextPiece}
            gameOver={gameOver}
            gameStarted={gameStarted}
            onStart={startGame}
            onReset={resetGame}
          />
        </div>
      </div>
    </div>
  );
};