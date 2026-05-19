import { TetrisGame } from "../components/TetrisGame";
import PWAInstallButton from "@/components/PWAInstallButton";
import { SEO } from "@/components/SEO";
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
import { SettingsPanel } from "../components/SettingsPanel";
import { useState } from "react";

const ExtraGamePage = () => {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <SEO
        title="Extra Mode — Retro Tetris"
        description="Play Extra Mode in Retro Tetris with new pieces, expanded mechanics and fresh challenges beyond classic Tetris."
        path="/game/extra"
      />
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
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="gameOutline"
            size="icon"
            className="absolute top-4 right-4 z-50 hover:scale-105 transition-transform duration-200"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-sm border border-border/50 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-game-text text-center text-xl font-retro tracking-wider">
              ⚙️ GAME SETTINGS
            </DialogTitle>
          </DialogHeader>
          <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Game Area */}
      <main className="h-full flex items-center justify-center p-2">
        <TetrisGame 
          gameMode="extra" 
          title="EXTRA MODE"
          subtitle="Enhanced Experience with New Pieces & Challenges"
          titleColor="!text-emerald-400"
          externalPaused={isSettingsOpen}
        />
      </main>
    </div>
  );
};

export default ExtraGamePage;
