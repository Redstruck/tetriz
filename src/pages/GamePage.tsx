import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

      {/* Settings Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="gameOutline"
            size="icon"
            className="absolute top-4 right-4 z-50 hover:scale-105 transition-transform duration-200"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-sm border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-game-text">Settings</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground text-center">
              Settings panel coming soon...
            </p>
          </div>
        </DialogContent>
      </Dialog>

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
