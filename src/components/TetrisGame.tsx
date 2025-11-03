import { useEffect, useState, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameUI } from './GameUI';
import { HoldUI } from './HoldUI';
import { SpeedrunUI } from './SpeedrunUI';
import { HighScoreCelebration } from './HighScoreCelebration';
import { useTetrisLogic } from '../hooks/useTetrisLogic';
import { useGameControls } from '../hooks/useGameControls';
import { useHighScore } from '../hooks/useHighScore';

interface TetrisGameProps {
  gameMode?: 'regular' | 'extra' | 'speedrun';
  title?: string;
  subtitle?: string;
  titleColor?: string;
  externalPaused?: boolean;
}

export const TetrisGame = ({ gameMode = 'regular', title, subtitle, titleColor = 'text-white', externalPaused = false }: TetrisGameProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [wasAlreadyPaused, setWasAlreadyPaused] = useState(false);
  const [hasCheckedHighScore, setHasCheckedHighScore] = useState(false);
  
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
    setPaused,
    setDownKeyHeld,
    // Speedrun mode specific
    greyBlocks,
    wavesCleared,
    currentRound,
    targetsDestroyedInRound,
    totalTime
  } = useTetrisLogic(gameMode);

  const {
    currentHighScore,
    checkForNewHighScore,
    showCelebration,
    celebrationData,
    hideCelebration
  } = useHighScore(gameMode);

  // Check for high score when game ends
  useEffect(() => {
    if (gameOver && gameStarted && !hasCheckedHighScore) {
      let scoreToCheck: number;
      
      if (gameMode === 'speedrun') {
        // For speedrun, use the round number reached
        scoreToCheck = currentRound || 1;
      } else {
        // For regular and extra modes, use lines cleared
        scoreToCheck = linesCleared;
      }
      
      checkForNewHighScore(scoreToCheck);
      setHasCheckedHighScore(true);
    }
    
    // Reset the check flag when starting a new game
    if (gameStarted && !gameOver) {
      setHasCheckedHighScore(false);
    }
  }, [gameOver, gameStarted, gameMode, linesCleared, currentRound, checkForNewHighScore, hasCheckedHighScore]);

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
    onDownKeyPress: () => setDownKeyHeld(true),
    onDownKeyRelease: () => setDownKeyHeld(false),
    gameStarted
  });

  // Reset down key state when game is not started
  useEffect(() => {
    if (!gameStarted) {
      setDownKeyHeld(false);
    }
  }, [gameStarted, setDownKeyHeld]);

  // Handle external pause state (e.g., when settings dialog opens)
  useEffect(() => {
    if (gameStarted && !gameOver) {
      setPaused(externalPaused);
    }
  }, [externalPaused, gameStarted, gameOver, setPaused]);

  return (      
    <div 
      className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden outline-none gpu-accelerated" 
      tabIndex={0}
    >
      {/* High Score Celebration Overlay */}
      {celebrationData && (
        <HighScoreCelebration
          isVisible={showCelebration}
          gameMode={celebrationData.gameMode}
          newScore={celebrationData.newScore}
          previousScore={celebrationData.previousScore}
          onAnimationComplete={hideCelebration}
        />
      )}

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
                <div className="relative z-10 text-center">
                  <div className="text-xs font-mono text-gray-200/80 mb-1 tracking-wide">TARGETS LEFT</div>
                  <div className="text-xl font-mono font-bold text-gray-300 tracking-wider">
                    {greyBlocks.length}
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
              currentHighScore={currentHighScore}
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
            currentHighScore={currentHighScore}
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