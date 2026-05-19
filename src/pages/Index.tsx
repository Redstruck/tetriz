import { useState } from "react";
import GameMenu from "../components/GameMenu";
import PWAInstallButton from "@/components/PWAInstallButton";
import { SEO } from "@/components/SEO";

const Index = () => {
  const [gameMode, setGameMode] = useState<'regular' | 'extra' | 'speedrun' | null>(null);

  const handleGameModeSelect = (mode: 'regular' | 'extra' | 'speedrun') => {
    setGameMode(mode);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <SEO
        title="Retro Tetris — Free Classic Tetris in Your Browser"
        description="Play a free retro-style Tetris with Classic, Extra, Speedrun and Versus modes. Smooth controls, hold piece and progressive difficulty."
        path="/"
      />
      <PWAInstallButton />
      <main>
        <GameMenu onGameModeSelect={handleGameModeSelect} />
      </main>
    </div>
  );
};

export default Index;

export default Index;
