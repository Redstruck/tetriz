import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTetrisLogic } from '@/hooks/useTetrisLogic';
import { useVersusControls } from '@/hooks/useVersusControls';
import { GameBoard } from '@/components/GameBoard';
import { HoldUI } from '@/components/HoldUI';
import { NextUI } from '@/components/NextUI';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  RippleButton,
  RippleButtonRipples,
} from '@/components/animate-ui/primitives/buttons/ripple';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SettingsPanel } from '@/components/SettingsPanel';
import { SEO } from '@/components/SEO';

// Custom Pause icon with perfectly balanced lines
const PauseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="4" height="16" x="6" y="4" rx="1" />
    <rect width="4" height="16" x="14" y="4" rx="1" />
  </svg>
);

// Custom Reset icon with circular arrow
const ResetIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const VersusGamePage = () => {
  const navigate = useNavigate();
  const [winner, setWinner] = useState<'player1' | 'player2' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Player 1 (Right Grid) - Uses normal controls
  const player1 = useTetrisLogic('regular');
  
  // Player 2 (Left Grid) - Uses alternative controls  
  const player2 = useTetrisLogic('regular');

  // Auto-pause both players when settings dialog opens
  useEffect(() => {
    if (isSettingsOpen) {
      player1.setPaused(true);
      player2.setPaused(true);
    } else {
      player1.setPaused(false);
      player2.setPaused(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingsOpen]);

  // Use the new versus controls hook for smooth key holding
  useVersusControls({
    player1: {
      onMoveLeft: () => player1.movePiece(-1, 0),
      onMoveRight: () => player1.movePiece(1, 0),
      onMoveDown: () => player1.dropPiece(),
      onRotate: () => player1.rotatePiece(),
      onHardDrop: () => player1.hardDrop(),
      onHold: () => player1.holdPieceAction(),
      gameStarted: player1.gameStarted,
      paused: player1.paused,
    },
    player2: {
      onMoveLeft: () => player2.movePiece(-1, 0),
      onMoveRight: () => player2.movePiece(1, 0),
      onMoveDown: () => player2.dropPiece(),
      onRotate: () => player2.rotatePiece(),
      onHardDrop: () => player2.hardDrop(),
      onHold: () => player2.holdPieceAction(),
      gameStarted: player2.gameStarted,
      paused: player2.paused,
    },
    winner,
  });

  // Check for game over - determine winner
  useEffect(() => {
    if (player1.gameOver && !winner) {
      setWinner('player2');
    } else if (player2.gameOver && !winner) {
      setWinner('player1');
    }
  }, [player1.gameOver, player2.gameOver, winner]);

  // Start both games simultaneously
  const startBothGames = useCallback(() => {
    player1.startGame();
    player2.startGame();
    setWinner(null);
  }, [player1, player2]);

  // Reset both games
  const resetBothGames = useCallback(() => {
    player1.resetGame();
    player2.resetGame();
    setWinner(null);
  }, [player1, player2]);

  // Toggle pause for both players
  const toggleBothPause = useCallback(() => {
    player1.togglePause();
    player2.togglePause();
  }, [player1, player2]);

  // Change speed for both players
  const changeBothSpeeds = useCallback((speed: number) => {
    player1.setDropSpeed(speed);
    player2.setDropSpeed(speed);
  }, [player1, player2]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden relative bg-black">
      <SEO
        title="Versus Mode — Retro Tetris"
        description="Battle a friend locally in Retro Tetris Versus mode. Two-player head-to-head Tetris with shared keyboard controls."
        path="/game/versus"
      />
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Back Button */}
      <Button
        onClick={() => navigate('/')}
        variant="gameOutline"
        size="sm"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 hover:scale-105 transition-transform duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </Button>

      {/* Settings Button */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="gameOutline"
            size="icon"
            className="absolute top-4 right-4 z-50 hover:scale-105 transition-transform duration-200"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-sm border border-border/50 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-game-text text-center text-xl font-retro tracking-wider">
              ⚙️ GAME SETTINGS
            </DialogTitle>
          </DialogHeader>
          <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[1600px] px-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-retro font-bold text-pink-400 tracking-wider mb-2">
            VERSUS MODE
          </h1>
          <p className="text-sm text-slate-400 font-mono">Head-to-Head Battle</p>
        </div>

        {/* Winner Banner */}
        {winner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 rounded-3xl border-4 border-white/20 shadow-2xl backdrop-blur-xl">
              <h2 className="text-5xl font-retro font-bold text-white mb-4">
                {winner === 'player1' ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!'}
              </h2>
              <Button
                onClick={resetBothGames}
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}

        {/* Game Grids Container */}
        <div className="flex gap-16 justify-center items-start">
          {/* Player 2 - Left Grid */}
          <div className="flex-shrink-0 w-full max-w-lg">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-lg py-2 px-3 border border-pink-500/30 max-w-[340px] w-full mx-auto">
              {/* Player 2 Header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-pink-400 mb-1">PLAYER 2</h2>
                <p className="text-xs text-slate-400 font-mono">WASD + Shift + Q</p>
              </div>

              {/* Player 2 Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Score</div>
                  <div className="text-lg font-bold text-pink-400">{player2.score}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Level</div>
                  <div className="text-lg font-bold text-purple-400">{player2.level}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Lines</div>
                  <div className="text-lg font-bold text-indigo-400">{player2.linesCleared}</div>
                </div>
              </div>

              {/* Player 2 Game Area */}
              <div className="flex gap-6 items-start justify-center">
                {/* Hold Piece */}
                <div className="flex-shrink-0">
                  <HoldUI 
                    holdPiece={player2.holdPiece}
                    holdUsed={player2.holdUsed}
                    gameMode="regular"
                    holdKey="Q"
                  />
                </div>

                {/* Game Board - Scaled down for versus */}
                <div className="flex-shrink-0 transform scale-100 origin-top" style={{ marginLeft: '-40px', marginRight: '-40px' }}>
                  <GameBoard
                    board={player2.board}
                    currentPiece={player2.currentPiece}
                    ghostPiece={player2.ghostPiece}
                    clearedRows={player2.clearedRows}
                  />
                </div>

                {/* Next Piece */}
                <div className="flex-shrink-0">
                  <NextUI 
                    nextPiece={player2.nextPiece}
                    gameMode="regular"
                  />
                </div>
              </div>
              {/* Player 2 Controls Help */}
              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                <span className="text-pink-400 font-bold">Player 2:</span> A/D = Move • W = Rotate • S = Soft Drop • Shift = Hard Drop • Q = Hold
              </div>
            </div>
          </div>

          {/* VS Divider & Game Controls */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center py-8 mx-4 min-w-[200px]">
            {/* VS Badge */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-6">
              VS
            </div>

            {/* Speed Editor */}
            <div className="bg-game-board border border-game-border rounded-lg p-4 mb-4 w-full">
              <h2 className="text-sm font-retro font-bold text-game-accent mb-3 tracking-wider text-center text-retro-glow">SPEED</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Slow', value: 1500 },
                  { label: 'Normal', value: 1000 },
                  { label: 'Fast', value: 500 }
                ].map(({ label, value }) => (
                  <RippleButton
                    key={label}
                    hoverScale={1.05}
                    tapScale={0.95}
                    onClick={() => changeBothSpeeds(value)}
                    disabled={(player1.gameStarted && !player1.gameOver && !player1.paused) || (player2.gameStarted && !player2.gameOver && !player2.paused)}
                    className={cn(
                      'text-xs h-8 font-game font-medium relative overflow-hidden tracking-wide transition-all duration-200',
                      player1.baseDropSpeed === value
                        ? 'bg-game-accent text-background border border-game-accent hover:bg-game-accent/90 hover:shadow-lg hover:shadow-game-accent/40 hover:brightness-110 [--ripple-button-ripple-color:rgba(0,0,0,0.3)]'
                        : 'border border-game-border/50 text-game-text bg-transparent hover:bg-game-grid/60 hover:border-game-accent/50 hover:text-game-accent hover:shadow-md hover:shadow-game-accent/20 [--ripple-button-ripple-color:rgba(0,255,255,0.6)]'
                    )}
                  >
                    <span className="relative z-10 font-game tracking-wider">{label}</span>
                    {player1.baseDropSpeed === value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    )}
                    <RippleButtonRipples />
                  </RippleButton>
                ))}
              </div>
            </div>

            {/* Game Control Buttons */}
            <div className="space-y-3 w-full">
              {!player1.gameStarted && !player2.gameStarted ? (
                <Button
                  onClick={startBothGames}
                  variant="gameAccent"
                  size="lg"
                  className="w-full game-button-glow button-pulse button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2 font-retro tracking-wider">
                    START BATTLE
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </Button>
              ) : (
                <>
                  {/* Pause/Resume Button */}
                  {player1.gameStarted && !player1.gameOver && (
                    <Button 
                      onClick={toggleBothPause}
                      variant="gameOutline"
                      size="lg"
                      className="w-full font-bold button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2 font-game tracking-wider">
                        {player1.paused ? <Play className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
                        {player1.paused ? 'RESUME' : 'PAUSE'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-game-accent/10 via-game-accent/20 to-game-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  )}
                  
                  {/* Reset Button */}
                  <Button
                    onClick={resetBothGames}
                    variant="gameOutline"
                    className="w-full button-ripple hover-lift focus-ring-enhanced relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2 font-game tracking-wider">
                      <ResetIcon className="w-4 h-4" />
                      RESET
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-destructive/20 to-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Player 1 - Right Grid */}
          <div className="flex-shrink-0 w-full max-w-lg">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-lg py-2 px-3 border border-cyan-500/30 max-w-[340px] w-full mx-auto">
              {/* Player 1 Header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400 mb-1">PLAYER 1</h2>
                <p className="text-xs text-slate-400 font-mono">Arrows + Space + C</p>
              </div>

              {/* Player 1 Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Score</div>
                  <div className="text-lg font-bold text-cyan-400">{player1.score}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Level</div>
                  <div className="text-lg font-bold text-blue-400">{player1.level}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400">Lines</div>
                  <div className="text-lg font-bold text-purple-400">{player1.linesCleared}</div>
                </div>
              </div>

              {/* Player 1 Game Area */}
              <div className="flex gap-6 items-start justify-center">
                {/* Hold Piece */}
                <div className="flex-shrink-0">
                  <HoldUI 
                    holdPiece={player1.holdPiece}
                    holdUsed={player1.holdUsed}
                    gameMode="regular"
                    holdKey="C"
                  />
                </div>

                {/* Game Board - Scaled down for versus */}
                <div className="flex-shrink-0 transform scale-100 origin-top" style={{ marginLeft: '-40px', marginRight: '-40px' }}>
                  <GameBoard
                    board={player1.board}
                    currentPiece={player1.currentPiece}
                    ghostPiece={player1.ghostPiece}
                    clearedRows={player1.clearedRows}
                  />
                </div>

                {/* Next Piece */}
                <div className="flex-shrink-0">
                  <NextUI 
                    nextPiece={player1.nextPiece}
                    gameMode="regular"
                  />
                </div>
              </div>
              {/* Player 1 Controls Help */}
              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-bold">Player 1:</span> ←/→ = Move • ↑ = Rotate • ↓ = Soft Drop • Space = Hard Drop • C = Hold
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VersusGamePage;
