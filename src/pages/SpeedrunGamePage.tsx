import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TetrisGame } from "@/components/TetrisGame";
import { ArrowLeft } from "lucide-react";

const SpeedrunGamePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 border-b border-game-border/30">
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
          <h1 className="text-2xl font-retro font-bold text-orange-400 tracking-wider">
            SPEEDRUN MODE
          </h1>
          <div className="text-xs font-mono text-orange-200/60 mt-2 space-y-1">
            <div>Progressive Target Challenge</div>
            <div className="flex items-center justify-center space-x-4">
              <span className="bg-orange-500/20 px-2 py-1 rounded">R1-4: 1🎯</span>
              <span className="bg-orange-500/20 px-2 py-1 rounded">R5-8: 2🎯</span>
              <span className="bg-orange-500/20 px-2 py-1 rounded">R9-12: 3🎯</span>
              <span className="text-orange-300">...</span>
            </div>
          </div>
        </div>
        
        <div className="w-24" /> {/* Spacer for balance */}
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <TetrisGame gameMode="speedrun" />
      </div>
    </div>
  );
};

export default SpeedrunGamePage;
