import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GamePage = () => {
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
      
      <TetrisGame />
    </div>
  );
};

export default GamePage;
