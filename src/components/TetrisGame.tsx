import { useEffect, useState, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameUI } from './GameUI';
import { HoldUI } from './HoldUI';
import { SpeedrunUI } from './SpeedrunUI';
import { useTetrisLogic } from '../hooks/useTetrisLogic';
import { useGameControls } from '../hooks/useGameControls';

interface TetrisGameProps {
  gameMode?: 'regular' | 'extra' | 'speedrun';
  title?: string;
  subtitle?: string;
  titleColor?: string;
}

export const TetrisGame = ({ gameMode = 'regular', title, subtitle, titleColor = 'text-white' }: TetrisGameProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [wasAlreadyPaused, setWasAlreadyPaused] = useState(false);
  
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
    paused,
    clearedRows,
    baseDropSpeed,
    setDropSpeed,
    startGame,
    resetGame,
    movePiece,
    rotatePiece,
    dropPiece,
    hardDrop,
    holdPieceAction,
    togglePause,
    // Speedrun mode specific
    greyBlocks,
    wavesCleared,
    currentRound,
    targetsDestroyedInRound,
    totalTime
  } = useTetrisLogic(gameMode);

  const handleResetConfirm = useCallback(() => {
    if (gameStarted && !gameOver) {
      // Remember if the game was already paused
      setWasAlreadyPaused(paused);
      
      // Pause the game if it wasn't already paused
      if (!paused) {
        togglePause();
      }
      
      setShowResetConfirm(true);
    }
  }, [gameStarted, gameOver, paused, togglePause]);

  const handleResetYes = useCallback(() => {
    resetGame();
    setShowResetConfirm(false);
    setWasAlreadyPaused(false);
  }, [resetGame]);

  const handleResetNo = useCallback(() => {
    setShowResetConfirm(false);
    
    // Only resume the game if it wasn't paused before showing the confirmation
    if (!wasAlreadyPaused) {
      togglePause();
    }
    
    setWasAlreadyPaused(false);
  }, [wasAlreadyPaused, togglePause]);

  useGameControls({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => dropPiece(),
    onRotate: rotatePiece,
    onHardDrop: hardDrop,
    onHold: holdPieceAction,
    onPause: togglePause,
    onResetConfirm: handleResetConfirm,
    onSpeedUp: () => setDropSpeed(Math.max(200, baseDropSpeed - 100)),
    onSpeedDown: () => setDropSpeed(Math.min(2000, baseDropSpeed + 100)),
    onSpeedReset: () => setDropSpeed(1000),
    gameStarted
  });

  return (      <div 
        className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden outline-none gpu-accelerated" 
        tabIndex={0}
      >
      {/* Game Mode Title - Above everything */}
      {title && (
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-retro font-bold tracking-wider ${titleColor}`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-sm font-mono mt-2 opacity-60 tracking-wide ${titleColor.replace('text-', 'text-').replace('-400', '-200')}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-4 max-w-7xl w-full">
        {/* Left Side Panel - Targets Above Hold (Speedrun Mode Only) */}
        {gameMode === 'speedrun' ? (
          <div className="flex-shrink-0 order-1 lg:order-1 flex flex-col gap-4">
            {/* Targets Left - Above Hold */}
            {greyBlocks && (
              <div className="p-3 bg-gradient-to-br from-gray-500/20 to-gray-600/10 border border-gray-500/30 rounded-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-mono text-gray-200/80 mb-1 tracking-wide">TARGETS LEFT</div>
                  <div className="text-xl font-mono font-bold text-gray-300 tracking-wider">
                    {greyBlocks.length}
                  </div>
                  
                  {/* Target indicators with enhanced animation */}
                  <div className="mt-2 flex justify-center">
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(greyBlocks.length, 10) }, (_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gray-400 rounded-full opacity-75 animate-pulse"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                      {greyBlocks.length > 10 && (
                        <div className="text-xs text-gray-400 ml-2">+{greyBlocks.length - 10}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hold UI - Below Targets */}
            <HoldUI 
              holdPiece={holdPiece}
              holdUsed={holdUsed}
              gameMode={gameMode}
            />
          </div>
        ) : (
          /* Regular Mode - Just Hold UI */
          <div className="flex-shrink-0 order-1 lg:order-1">
            <HoldUI 
              holdPiece={holdPiece}
              holdUsed={holdUsed}
              gameMode={gameMode}
            />
          </div>
        )}
        
        {/* Game Board */}
        <div className="flex-shrink-0 order-2 lg:order-2">
        <GameBoard 
          board={board} 
          currentPiece={currentPiece}
          ghostPiece={ghostPiece}
          clearedRows={clearedRows}
          paused={paused}
          gameMode={gameMode}
          showResetConfirm={showResetConfirm}
          onResetYes={handleResetYes}
          onResetNo={handleResetNo}
        />
        </div>
        
        {/* Game UI */}
        <div className="flex-shrink-0 order-3 lg:order-3">
          {gameMode === 'speedrun' && greyBlocks && (
            <SpeedrunUI
              wavesCleared={wavesCleared || 0}
              currentRound={currentRound || 1}
              targetsDestroyedInRound={targetsDestroyedInRound || 0}
              totalTime={totalTime || 0}
            />
          )}
          <GameUI
            score={score}
            level={level}
            linesCleared={linesCleared}
            nextPiece={nextPiece}
            gameOver={gameOver}
            gameStarted={gameStarted}
            paused={paused}
            baseDropSpeed={baseDropSpeed}
            onStart={startGame}
            onReset={resetGame}
            onPause={togglePause}
            onSpeedChange={setDropSpeed}
            gameMode={gameMode}
          />
        </div>
      </div>
    </div>
  );
};