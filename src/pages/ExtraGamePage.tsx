import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ExtraGamePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <PWAInstallButton />
      
      {/* Back to Menu Button */}
      <Button
        onClick={() => navigate('/')}
        variant="gameOutline"
        size="sm"
        className="fixed top-4 left-4 z-50 font-game tracking-wide hover-lift focus-ring-enhanced"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        MENU
      </Button>
      
      {/* Mode Indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-game-board/90 border border-game-accent/50 rounded-lg px-4 py-2 backdrop-blur-sm">
          <span className="font-game text-sm text-game-accent tracking-wider text-glow">EXTRA MODE</span>
        </div>
      </div>
      
      <TetrisGame gameMode="extra" />
    </div>
  );
};

export default ExtraGamePage;
