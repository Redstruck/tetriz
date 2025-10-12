import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GamePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <PWAInstallButton />
      
      {/* Floating Back Button */}
      <Button
        onClick={() => navigate("/")}
        variant="gameOutline"
        size="sm"
        className="absolute top-4 left-4 z-50 flex items-center gap-2 hover:scale-105 transition-transform duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </Button>

      {/* Game Area */}
      <div className="h-full flex items-center justify-center p-2">
        <TetrisGame 
          gameMode="regular" 
          title="CLASSIC MODE"
          subtitle="Traditional Tetris with Progressive Difficulty"
          titleColor="text-cyan-400"
        />
      </div>
    </div>
  );
};

export default GamePage;
