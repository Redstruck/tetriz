import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedHyperspeedBackground from "@/components/ui/AnimatedHyperspeedBackground";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect, useRef } from "react";

interface GameMenuProps {
  onGameModeSelect: (mode: 'regular' | 'extra' | 'speedrun') => void;
}

type GameModeType = 'regular' | 'extra' | 'speedrun' | 'versus' | 'puzzle' | 'marathon';

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

// Dummy game mode images
const SurvivalModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-red-400 via-rose-500 to-red-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Survival board with danger indicators */}
    <div className="absolute inset-2 bg-black/20 rounded-lg">
      <div className="grid grid-cols-5 grid-rows-6 gap-0.5 p-2 h-full">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [24, 25, 26, 27, 28, 29].includes(i) // Danger line
                ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse'
                : [18, 19, 20, 21, 22, 23].includes(i)
                ? 'bg-gradient-to-br from-red-300 to-red-500'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 text-center">
      <div className="text-xs font-bold text-white/90 bg-black/40 rounded px-1">SURVIVAL</div>
    </div>
    {/* Skull icon */}
    <div className="absolute top-2 right-2 w-4 h-4 text-red-300">💀</div>
  </div>
);

const VersusModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Two side-by-side boards for versus mode */}
    <div className="absolute inset-2 bg-black/20 rounded-lg flex gap-1 p-1">
      {/* Left player board */}
      <div className="flex-1 grid grid-cols-3 grid-rows-6 gap-0.5">
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [0, 1, 3, 4, 6, 7, 12, 13, 14].includes(i)
                ? 'bg-gradient-to-br from-pink-300 to-pink-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      {/* Divider */}
      <div className="w-0.5 bg-white/30"></div>
      {/* Right player board */}
      <div className="flex-1 grid grid-cols-3 grid-rows-6 gap-0.5">
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [2, 5, 8, 9, 10, 11, 15, 16, 17].includes(i)
                ? 'bg-gradient-to-br from-purple-300 to-purple-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 text-center">
      <div className="text-xs font-bold text-white/90 bg-black/40 rounded px-1">VS MODE</div>
    </div>
    {/* VS icon */}
    <div className="absolute top-2 right-2 w-5 h-5 bg-pink-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
      VS
    </div>
  </div>
);

const PuzzleModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Puzzle board with specific patterns */}
    <div className="absolute inset-2 bg-black/20 rounded-lg">
      <div className="grid grid-cols-5 grid-rows-6 gap-0.5 p-2 h-full">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              [0, 4, 10, 14, 20, 24].includes(i) // Corner pattern
                ? 'bg-gradient-to-br from-violet-300 to-violet-600'
                : [6, 7, 8, 11, 13, 16, 17, 18].includes(i) // Cross pattern
                ? 'bg-gradient-to-br from-purple-300 to-purple-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 text-center">
      <div className="text-xs font-bold text-white/90 bg-black/40 rounded px-1">PUZZLE</div>
    </div>
    {/* Puzzle piece icon */}
    <div className="absolute top-2 right-2 w-4 h-4 text-violet-300">🧩</div>
  </div>
);

const MarathonModeImage = () => (
  <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-xl relative overflow-hidden shadow-2xl">
    {/* Marathon board with endurance theme */}
    <div className="absolute inset-2 bg-black/20 rounded-lg">
      <div className="grid grid-cols-5 grid-rows-6 gap-0.5 p-2 h-full">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className={`rounded-sm ${
              i % 5 === 2 // Center column filled
                ? 'bg-gradient-to-br from-yellow-300 to-yellow-600'
                : [5, 6, 8, 9, 15, 16, 18, 19].includes(i) // Side blocks
                ? 'bg-gradient-to-br from-amber-300 to-amber-600'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-2 left-2 right-2 text-center">
      <div className="text-xs font-bold text-white/90 bg-black/40 rounded px-1">MARATHON</div>
    </div>
    {/* Trophy icon */}
    <div className="absolute top-2 right-2 w-4 h-4 text-yellow-300">🏆</div>
  </div>
);

const GameMenu = ({ onGameModeSelect }: GameMenuProps) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameModeType>('regular');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Define all game modes - strategically ordered to ensure Classic, Extra, Speedrun are always visible
  // With 3 items visible and startIndex: 0, this ensures Classic is always in center or first position
  const gameModes = [
    {
      id: 'regular' as GameModeType,
      title: 'CLASSIC',
      subtitle: 'Classic Tetris Experience',
      image: RegularModeImage,
      color: 'cyan',
      features: ['Standard 7 pieces', '10×20 playing field', 'Original gameplay'],
      available: true,
      route: '/game'
    },
    {
      id: 'extra' as GameModeType,
      title: 'EXTRA',
      subtitle: 'Enhanced Tetris Challenge',
      image: ExtraModeImage,
      color: 'emerald',
      features: ['21 unique pieces', '12×20 wider field', 'Advanced gameplay'],
      available: true,
      route: '/game/extra'
    },
    {
      id: 'speedrun' as GameModeType,
      title: 'SPEEDRUN',
      subtitle: 'Race Against Time',
      image: SpeedrunModeImage,
      color: 'orange',
      features: ['Clear grey targets', 'Timed challenges', 'Speed competition'],
      available: true,
      route: '/game/speedrun'
    },
    {
      id: 'versus' as GameModeType,
      title: 'VERSUS',
      subtitle: 'Head-to-Head Battle',
      image: VersusModeImage,
      color: 'pink',
      features: ['Two-player mode', 'Compete side-by-side', 'First to top out loses'],
      available: true,
      route: '/game/versus'
    },
    {
      id: 'puzzle' as GameModeType,
      title: 'PUZZLE',
      subtitle: 'Strategic Mind Bender',
      image: PuzzleModeImage,
      color: 'violet',
      features: ['Pre-set patterns', 'Limited pieces', 'Logic challenges'],
      available: false,
      route: null
    },
    {
      id: 'marathon' as GameModeType,
      title: 'MARATHON',
      subtitle: 'Long Distance Runner',
      image: MarathonModeImage,
      color: 'yellow',
      features: ['200 line goal', 'Gradual speed-up', 'Endurance test'],
      available: false,
      route: null
    }
  ];

  const handleModeSelect = (mode: GameModeType) => {
    const selectedGameMode = gameModes.find(m => m.id === mode);
    
    if (!selectedGameMode?.available) {
      // Show coming soon message for dummy modes
      return;
    }

    if (mode === 'regular' || mode === 'extra' || mode === 'speedrun' || mode === 'versus') {
      onGameModeSelect(mode as 'regular' | 'extra' | 'speedrun');
      navigate(selectedGameMode.route!);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, {border: string, text: string, glow: string, bg: string, hover: string}> = {
      cyan: {
        border: 'border-cyan-500/60 hover:border-cyan-400/90',
        text: 'text-cyan-400 group-hover:text-cyan-300',
        glow: 'hover:shadow-cyan-500/50',
        bg: 'from-cyan-500/10 via-transparent to-cyan-600/5',
        hover: 'bg-cyan-500/40 text-cyan-300'
      },
      emerald: {
        border: 'border-emerald-500/60 hover:border-emerald-400/90',
        text: 'text-emerald-400 group-hover:text-emerald-300',
        glow: 'hover:shadow-emerald-500/50',
        bg: 'from-emerald-500/10 via-transparent to-teal-600/5',
        hover: 'bg-emerald-500/40 text-emerald-300'
      },
      orange: {
        border: 'border-orange-500/60 hover:border-orange-400/90',
        text: 'text-orange-400 group-hover:text-orange-300',
        glow: 'hover:shadow-orange-500/50',
        bg: 'from-orange-500/10 via-transparent to-red-600/5',
        hover: 'bg-orange-500/40 text-orange-300'
      },
      red: {
        border: 'border-red-500/60 hover:border-red-400/90',
        text: 'text-red-400 group-hover:text-red-300',
        glow: 'hover:shadow-red-500/50',
        bg: 'from-red-500/10 via-transparent to-red-600/5',
        hover: 'bg-red-500/40 text-red-300'
      },
      violet: {
        border: 'border-violet-500/60 hover:border-violet-400/90',
        text: 'text-violet-400 group-hover:text-violet-300',
        glow: 'hover:shadow-violet-500/50',
        bg: 'from-violet-500/10 via-transparent to-purple-600/5',
        hover: 'bg-violet-500/40 text-violet-300'
      },
      yellow: {
        border: 'border-yellow-500/60 hover:border-yellow-400/90',
        text: 'text-yellow-400 group-hover:text-yellow-300',
        glow: 'hover:shadow-yellow-500/50',
        bg: 'from-yellow-500/10 via-transparent to-amber-600/5',
        hover: 'bg-yellow-500/40 text-yellow-300'
      },
      pink: {
        border: 'border-pink-500/60 hover:border-pink-400/90',
        text: 'text-pink-400 group-hover:text-pink-300',
        glow: 'hover:shadow-pink-500/50',
        bg: 'from-pink-500/10 via-transparent to-purple-600/5',
        hover: 'bg-pink-500/40 text-pink-300'
      }
    };
    return colors[color] || colors.cyan;
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
          TETRIZ
        </h1>
        <div className="text-sm font-mono text-slate-200 tracking-widest mb-4 drop-shadow-lg">
          CLASSIC RETRO EDITION
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full shadow-lg shadow-cyan-400/50"></div>
      </div>

      {/* Game Mode Selection Carousel */}
      <div className="flex flex-col items-center gap-12 relative z-30">
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-game font-bold text-slate-200 tracking-wider mb-2">
            SELECT GAME MODE
          </h2>
          <p className="text-sm text-slate-400 font-mono">
            Choose your adventure in the world of falling blocks
          </p>
        </div>
        
        {/* Carousel Container */}
        <div className="w-full max-w-6xl px-12 carousel-container-overflow">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              startIndex: 0, // Start at index 0 to show Classic, Extra, Speedrun first
            }}
            className="w-full carousel-container-overflow"
            setApi={setCarouselApi}
          >
            <CarouselContent className="-ml-4 carousel-container-overflow">
              {gameModes.map((mode, index) => {
                const colorClasses = getColorClasses(mode.color);
                const ImageComponent = mode.image;
                
                return (
                  <CarouselItem key={mode.id} className="pl-4 basis-1/3 lg:basis-1/3">
                    <div 
                      className={`group cursor-pointer floating-element ${!mode.available ? 'opacity-60' : ''}`} 
                      onClick={() => handleModeSelect(mode.id)}
                    >
                      <div className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-6 rounded-3xl border ${colorClasses.border} menu-card-hover shadow-2xl ${colorClasses.glow} backdrop-blur-sm ${!mode.available ? 'cursor-not-allowed' : ''}`}>
                        {/* Background glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl`} />
                        
                        {/* Coming Soon Badge for dummy modes */}
                        {!mode.available && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full z-20">
                            COMING SOON
                          </div>
                        )}
                        
                        {/* Image container */}
                        <div className="flex justify-center mb-4">
                          <ImageComponent />
                        </div>
                        
                        {/* Title and description */}
                        <div className="text-center relative z-10">
                          <h3 className={`text-2xl font-bold mb-2 transition-colors ${colorClasses.text}`}>
                            {mode.title}
                          </h3>
                          <p className="text-sm text-slate-300 font-mono tracking-wide mb-2">
                            {mode.subtitle}
                          </p>
                          <div className="text-xs text-slate-400 space-y-1">
                            {mode.features.map((feature, idx) => (
                              <div key={idx}>• {feature}</div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Hover indicator */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${mode.available ? colorClasses.hover : 'bg-gray-500/40 text-gray-300'}`}>
                            {mode.available ? 'CLICK TO PLAY' : 'COMING SOON'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/70 text-slate-200 hover:text-white backdrop-blur-sm" />
            <CarouselNext className="border-slate-600 bg-slate-800/50 hover:bg-slate-700/70 text-slate-200 hover:text-white backdrop-blur-sm" />
          </Carousel>
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
              <span>UP ARROW TO ROTATE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-600 shadow-lg shadow-emerald-400/50"></div>
              <span>SPACE TO DROP</span>
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
