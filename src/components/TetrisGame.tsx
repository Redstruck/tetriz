import { useEffect, useState, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameUI } from './GameUI';
import { useTetrisLogic } from '../hooks/useTetrisLogic';
import { useGameControls } from '../hooks/useGameControls';

export const TetrisGame = () => {
  const {
    board,
    currentPiece,
    nextPiece,
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
    hardDrop
  } = useTetrisLogic();

  useGameControls({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => dropPiece(),
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    gameStarted
  });

  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-4 max-w-7xl w-full">
        {/* Game Board */}
        <div className="flex-shrink-0">
          <GameBoard 
            board={board}
            currentPiece={currentPiece}
            clearedRows={clearedRows}
          />
        </div>
        
        {/* Game UI */}
        <div className="flex-shrink-0">
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