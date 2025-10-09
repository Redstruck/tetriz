import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ExtraGamePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">
      <PWAInstallButton />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-game-border/30">
        <Button
          onClick={() => navigate("/")}
          variant="gameOutline"
          size="sm"
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-retro font-bold text-purple-400 tracking-wider">
            EXTRA MODE
          </h1>
          <p className="text-xs font-mono text-purple-200/60 mt-1">
            Enhanced Experience with New Pieces & Challenges
          </p>
        </div>
        
        <div className="w-24" /> {/* Spacer for balance */}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-2">
        <TetrisGame gameMode="extra" />
      </div>
    </div>
  );
};

export default ExtraGamePage;
