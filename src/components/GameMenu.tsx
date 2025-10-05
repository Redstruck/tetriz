import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GameMenuProps {
  onGameModeSelect: (mode: 'regular' | 'extra' | 'speedrun') => void;
}

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
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden outline-none">
      {/* Menu Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl lg:text-6xl font-retro font-bold text-game-accent tracking-wider retro-title mb-4">
          TETRIS
        </h1>
        <div className="text-xs font-mono text-game-text/60 mt-2 tracking-widest">
          CLASSIC RETRO EDITION
        </div>
      </div>

      {/* Game Mode Selection */}
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-xl font-game font-bold text-game-text tracking-wider text-glow mb-4">
          SELECT GAME MODE
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Regular Mode Button */}
          <div className="group">
            <Button
              onClick={handleRegularMode}
              variant="gameAccent"
              className="w-48 h-48 flex flex-col items-center justify-center gap-4 text-lg font-game font-bold tracking-wider button-ripple hover-lift focus-ring-enhanced transition-all duration-300 ease-out group-hover:scale-105 rounded-2xl relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-game-accent/10 via-transparent to-game-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="w-16 h-16 bg-game-accent/20 rounded-xl flex items-center justify-center mb-2 group-hover:bg-game-accent/30 transition-colors duration-300">
                <div className="grid grid-cols-4 gap-1">
                  {/* Simple Tetris block pattern */}
                  {Array.from({ length: 16 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-sm ${
                        [1, 2, 5, 6, 9, 10, 13, 14].includes(i)
                          ? 'bg-game-accent'
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Text */}
              <div className="relative z-10 text-center">
                <div className="text-xl mb-1">REGULAR</div>
                <div className="text-xs opacity-80 font-mono tracking-wide">Classic Tetris</div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-game-accent/10 to-transparent" />
            </Button>
          </div>

          {/* Extra Mode Button */}
          <div className="group">
            <Button
              onClick={handleExtraMode}
              variant="gameOutline"
              className="w-48 h-48 flex flex-col items-center justify-center gap-4 text-lg font-game font-bold tracking-wider button-ripple hover-lift focus-ring-enhanced transition-all duration-300 ease-out group-hover:scale-105 rounded-2xl relative overflow-hidden border-2 border-game-accent/30 hover:border-game-accent/60"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-game-accent/5 via-transparent to-game-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="w-16 h-16 bg-game-accent/10 rounded-xl flex items-center justify-center mb-2 group-hover:bg-game-accent/20 transition-colors duration-300 border border-game-accent/20 group-hover:border-game-accent/40">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-game-accent/60 rounded rotate-45" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-game-accent rounded-full animate-pulse" />
                </div>
              </div>
              
              {/* Text */}
              <div className="relative z-10 text-center">
                <div className="text-xl mb-1 text-game-accent group-hover:text-game-accent/90">EXTRA</div>
                <div className="text-xs opacity-60 font-mono tracking-wide text-game-text/60">Wide Grid (12×20)</div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-game-accent/5 to-transparent" />
            </Button>
          </div>

          {/* Speedrun Mode Button */}
          <div className="group">
            <Button
              onClick={handleSpeedrunMode}
              variant="gameSelected"
              className="w-48 h-48 flex flex-col items-center justify-center gap-4 text-lg font-game font-bold tracking-wider button-ripple hover-lift focus-ring-enhanced transition-all duration-300 ease-out group-hover:scale-105 rounded-2xl relative overflow-hidden border-2 border-orange-500/30 hover:border-orange-500/60 bg-gradient-to-br from-orange-500/10 to-yellow-500/5"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mb-2 group-hover:bg-orange-500/30 transition-colors duration-300 border border-orange-500/30 group-hover:border-orange-500/50">
                <div className="relative flex items-center justify-center">
                  {/* Timer icon */}
                  <div className="w-8 h-8 border-2 border-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-1 h-3 bg-orange-500 rounded-full animate-pulse" />
                  </div>
                  {/* Target crosshair */}
                  <div className="absolute -top-1 -right-1 w-3 h-3">
                    <div className="w-full h-0.5 bg-yellow-400 absolute top-1/2 transform -translate-y-1/2"></div>
                    <div className="w-0.5 h-full bg-yellow-400 absolute left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Text */}
              <div className="relative z-10 text-center">
                <div className="text-xl mb-1 text-orange-400 group-hover:text-orange-300">SPEEDRUN</div>
                <div className="text-xs opacity-60 font-mono tracking-wide text-orange-200/60">Clear Grey Targets</div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-orange-500/10 to-transparent" />
            </Button>
          </div>
        </div>

        {/* Subtitle */}
        <div className="text-center mt-8">
          <p className="text-sm font-mono text-game-text/60 tracking-wider">
            Choose your adventure in the world of falling blocks
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
