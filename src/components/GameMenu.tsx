import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedHyperspeedBackground from "@/components/ui/AnimatedHyperspeedBackground";

interface GameMenuProps {
  onGameModeSelect: (mode: 'regular' | 'extra' | 'speedrun') => void;
}

// Dummy image components for each game mode
const RegularModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Classic Tetris board representation */}
    <div className="absolute inset-2 bg-black/20 rounded-lg">
      <div className="grid grid-cols-5 grid-rows-6 gap-0.5 p-2 h-full">
        {/* Simulate classic Tetris pieces */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [2, 3, 7, 8, 12, 13, 14, 17, 18, 19, 22, 23, 24, 27, 28].includes(i)
                ? 'bg-gradient-to-br from-cyan-300 to-cyan-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 text-center">
      <div className="text-xs font-bold text-white/90 bg-black/40 rounded px-1">10×20</div>
    </div>
  </div>
);

const ExtraModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Wider board with more complex pieces */}
    <div className="absolute inset-2 bg-black/20 rounded-lg">
      <div className="grid grid-cols-6 grid-rows-6 gap-0.5 p-2 h-full">
        {Array.from({ length: 36 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [1, 2, 3, 6, 7, 8, 9, 13, 14, 15, 18, 19, 20, 21, 24, 25, 26, 30, 31, 32].includes(i)
                ? i % 3 === 0 ? 'bg-gradient-to-br from-emerald-300 to-emerald-600'
                : i % 3 === 1 ? 'bg-gradient-to-br from-teal-300 to-teal-600'
                : 'bg-gradient-to-br from-purple-300 to-purple-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 text-center">
      <div className="text-xs font-bold text-white/90 bg-black/40 rounded px-1">12×20</div>
    </div>
    {/* Special piece indicator */}
    <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
      <span className="text-xs font-bold text-black">+</span>
    </div>
  </div>
);

const SpeedrunModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Timer and target representation */}
    <div className="absolute inset-2 bg-black/20 rounded-lg flex flex-col">
      {/* Timer display */}
      <div className="bg-black/60 rounded p-1 mb-1">
        <div className="text-xs font-mono text-orange-300 text-center">02:45.67</div>
      </div>
      {/* Board with targets */}
      <div className="grid grid-cols-5 grid-rows-4 gap-0.5 flex-1">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [3, 8, 11, 16].includes(i) 
                ? 'bg-gray-400 animate-pulse' // Grey targets
                : [1, 2, 6, 7, 12, 13, 17, 18].includes(i)
                ? 'bg-gradient-to-br from-orange-300 to-orange-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    {/* Stopwatch icon */}
    <div className="absolute top-2 right-2 w-5 h-5 border-2 border-yellow-400 rounded-full flex items-center justify-center">
      <div className="w-1 h-2 bg-yellow-400 rounded-full"></div>
    </div>
  </div>
);

const GameMenu = ({ onGameModeSelect }: GameMenuProps) => {
  const navigate = useNavigate();

  const handleRegularMode = () => {
    onGameModeSelect('regular');
    navigate('/game');
  };

  const handleExtraMode = () => {
    onGameModeSelect('extra');
    navigate('/game/extra');
  };

  const handleSpeedrunMode = () => {
    onGameModeSelect('speedrun');
    navigate('/game/speedrun');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden outline-none p-8 relative">
      {/* Animated Hyperspeed background */}
      <AnimatedHyperspeedBackground className="absolute inset-0 w-full h-full" />
      
      {/* Lighter overlay for better visibility of bright background */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Menu Title */}
      <div className="mb-16 text-center relative z-20">
        <h1 className="text-5xl lg:text-7xl font-retro font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 tracking-wider retro-title mb-6 drop-shadow-2xl">
          TETRIS
        </h1>
        <div className="text-sm font-mono text-slate-200 tracking-widest mb-4 drop-shadow-lg">
          CLASSIC RETRO EDITION
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-lg shadow-cyan-400/50"></div>
      </div>

      {/* Game Mode Selection */}
      <div className="flex flex-col items-center gap-12 relative z-20">
        <div className="text-center">
          <h2 className="text-2xl font-game font-bold text-slate-200 tracking-wider mb-2">
            SELECT GAME MODE
          </h2>
          <p className="text-sm text-slate-400 font-mono">
            Choose your adventure in the world of falling blocks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl">
          {/* Regular Mode Button */}
          <div className="group cursor-pointer floating-element" onClick={handleRegularMode}>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-6 rounded-3xl border border-cyan-500/60 hover:border-cyan-400/90 menu-card-hover shadow-2xl hover:shadow-cyan-500/50 backdrop-blur-sm">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              
              {/* Image container */}
              <div className="flex justify-center mb-4">
                <RegularModeImage />
              </div>
              
              {/* Title and description */}
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">
                  REGULAR
                </h3>
                <p className="text-sm text-slate-300 font-mono tracking-wide mb-2">
                  Classic Tetris Experience
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Standard 7 pieces</div>
                  <div>• 10×20 playing field</div>
                  <div>• Original gameplay</div>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold">
                  CLICK TO PLAY
                </div>
              </div>
            </div>
          </div>

          {/* Extra Mode Button */}
          <div className="group cursor-pointer floating-element" onClick={handleExtraMode}>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-6 rounded-3xl border border-emerald-500/60 hover:border-emerald-400/90 menu-card-hover shadow-2xl hover:shadow-emerald-500/50 backdrop-blur-sm">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              
              {/* Image container */}
              <div className="flex justify-center mb-4">
                <ExtraModeImage />
              </div>
              
              {/* Title and description */}
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">
                  EXTRA
                </h3>
                <p className="text-sm text-slate-300 font-mono tracking-wide mb-2">
                  Enhanced Tetris Challenge
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• 21 unique pieces</div>
                  <div>• 12×20 wider field</div>
                  <div>• Advanced gameplay</div>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                  CLICK TO PLAY
                </div>
              </div>
            </div>
          </div>

          {/* Speedrun Mode Button */}
          <div className="group cursor-pointer floating-element" onClick={handleSpeedrunMode}>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-6 rounded-3xl border border-orange-500/60 hover:border-orange-400/90 menu-card-hover shadow-2xl hover:shadow-orange-500/50 backdrop-blur-sm">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              
              {/* Image container */}
              <div className="flex justify-center mb-4">
                <SpeedrunModeImage />
              </div>
              
              {/* Title and description */}
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors">
                  SPEEDRUN
                </h3>
                <p className="text-sm text-slate-300 font-mono tracking-wide mb-2">
                  Race Against Time
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Clear grey targets</div>
                  <div>• Timed challenges</div>
                  <div>• Speed competition</div>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold">
                  CLICK TO PLAY
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer information */}
        <div className="mt-12 text-center relative z-20">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-300 font-mono drop-shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
              <span>ARROW KEYS TO MOVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300 shadow-lg shadow-purple-400/50"></div>
              <span>SPACE TO ROTATE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-600 shadow-lg shadow-emerald-400/50"></div>
              <span>SHIFT TO DROP</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 drop-shadow-lg">
            Press P to pause • C to hold piece • R to reset
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
