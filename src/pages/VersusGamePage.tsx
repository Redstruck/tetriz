import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTetrisLogic } from '@/hooks/useTetrisLogic';
import { useVersusControls } from '@/hooks/useVersusControls';
import { GameBoard } from '@/components/GameBoard';
import { HoldUI } from '@/components/HoldUI';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const VersusGamePage = () => {
  const navigate = useNavigate();
  const [winner, setWinner] = useState<'player1' | 'player2' | null>(null);

  // Player 1 (Right Grid) - Uses normal controls
  const player1 = useTetrisLogic('regular');
  
  // Player 2 (Left Grid) - Uses alternative controls  
  const player2 = useTetrisLogic('regular');

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

  return (
    <div className="min-h-screen w-screen flex items-center justify-center overflow-hidden relative bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Back Button */}
      <Button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-50 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-sm"
        size="sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Menu
      </Button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 tracking-wider mb-2">
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
        <div className="flex gap-8 justify-center items-start">
          {/* Player 2 - Left Grid */}
          <div className="flex-1 max-w-md">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-600/10 rounded-2xl p-4 border border-pink-500/30">
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
              <div className="flex gap-3">
                {/* Hold Piece */}
                <div className="flex flex-col gap-2">
                  <HoldUI 
                    holdPiece={player2.holdPiece}
                    holdUsed={player2.holdUsed}
                    gameMode="regular"
                  />
                </div>

                {/* Game Board - Scaled down for versus */}
                <div className="flex-1 scale-75 origin-top-left">
                  <GameBoard
                    board={player2.board}
                    currentPiece={player2.currentPiece}
                    ghostPiece={player2.ghostPiece}
                    clearedRows={player2.clearedRows}
                  />
                </div>

                {/* Next Piece */}
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-800/50 rounded-lg p-2 w-20 h-20 flex items-center justify-center">
                    {player2.nextPiece ? (
                      <div className="scale-50">
                        {player2.nextPiece.shape.map((row, y) => (
                          <div key={y} className="flex">
                            {row.map((cell, x) => (
                              <div
                                key={x}
                                className={`w-4 h-4 ${
                                  cell ? `bg-${player2.nextPiece!.type} border border-white/20` : ''
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 text-center">Next</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
              VS
            </div>
            {!player1.gameStarted && !player2.gameStarted ? (
              <Button
                onClick={startBothGames}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold px-6 py-3"
              >
                Start Battle
              </Button>
            ) : (
              <Button
                onClick={resetBothGames}
                variant="outline"
                className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/70"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Player 1 - Right Grid */}
          <div className="flex-1 max-w-md">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-4 border border-cyan-500/30">
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
              <div className="flex gap-3">
                {/* Hold Piece */}
                <div className="flex flex-col gap-2">
                  <HoldUI 
                    holdPiece={player1.holdPiece}
                    holdUsed={player1.holdUsed}
                    gameMode="regular"
                  />
                </div>

                {/* Game Board - Scaled down for versus */}
                <div className="flex-1 scale-75 origin-top-left">
                  <GameBoard
                    board={player1.board}
                    currentPiece={player1.currentPiece}
                    ghostPiece={player1.ghostPiece}
                    clearedRows={player1.clearedRows}
                  />
                </div>

                {/* Next Piece */}
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-800/50 rounded-lg p-2 w-20 h-20 flex items-center justify-center">
                    {player1.nextPiece ? (
                      <div className="scale-50">
                        {player1.nextPiece.shape.map((row, y) => (
                          <div key={y} className="flex">
                            {row.map((cell, x) => (
                              <div
                                key={x}
                                className={`w-4 h-4 ${
                                  cell ? `bg-${player1.nextPiece!.type} border border-white/20` : ''
                                }`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 text-center">Next</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Help */}
        <div className="mt-6 text-center text-xs text-slate-400 font-mono">
          <div className="flex justify-center gap-8">
            <div>
              <span className="text-pink-400 font-bold">Player 2:</span> A/D = Move • W = Rotate • S = Soft Drop • Shift = Hard Drop • Q = Hold
            </div>
            <div>
              <span className="text-cyan-400 font-bold">Player 1:</span> ←/→ = Move • ↑ = Rotate • ↓ = Soft Drop • Space = Hard Drop • C = Hold
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersusGamePage;
