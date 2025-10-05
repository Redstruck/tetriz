import { useState } from "react";
import GameMenu from "../components/GameMenu";
import PWAInstallButton from "@/components/PWAInstallButton";

const Index = () => {
  const [gameMode, setGameMode] = useState<'regular' | 'extra' | 'speedrun' | null>(null);

  const handleGameModeSelect = (mode: 'regular' | 'extra' | 'speedrun') => {
    setGameMode(mode);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <PWAInstallButton />
      <GameMenu onGameModeSelect={handleGameModeSelect} />
    </div>
  );
};

export default Index;
