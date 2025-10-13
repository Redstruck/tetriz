import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Volume2, Music, Gamepad2, Eye, Zap } from "lucide-react";
import { useState } from "react";

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [soundVolume, setSoundVolume] = useState([70]);
  const [musicVolume, setMusicVolume] = useState([50]);
  const [enableSounds, setEnableSounds] = useState(true);
  const [enableMusic, setEnableMusic] = useState(true);
  const [showGhost, setShowGhost] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [enableParticles, setEnableParticles] = useState(true);
  const [autoRepeat, setAutoRepeat] = useState(true);

  const resetToDefaults = () => {
    setSoundVolume([70]);
    setMusicVolume([50]);
    setEnableSounds(true);
    setEnableMusic(true);
    setShowGhost(true);
    setShowGrid(false);
    setEnableParticles(true);
    setAutoRepeat(true);
  };

  return (
    <div className="space-y-6 p-2">
      {/* Audio Settings */}
      <Card className="p-4 bg-background/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="w-5 h-5 text-primary" />
          <h3 className="font-retro text-lg text-foreground">Audio Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-sounds" className="text-sm font-retro text-muted-foreground">
                Sound Effects
              </Label>
              <Switch
                id="enable-sounds"
                checked={enableSounds}
                onCheckedChange={setEnableSounds}
              />
            </div>
            {enableSounds && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Volume: {soundVolume[0]}%</Label>
                <Slider
                  value={soundVolume}
                  onValueChange={setSoundVolume}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Separator className="bg-border/30" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-music" className="text-sm font-retro text-muted-foreground flex items-center gap-2">
                <Music className="w-4 h-4" />
                Background Music
              </Label>
              <Switch
                id="enable-music"
                checked={enableMusic}
                onCheckedChange={setEnableMusic}
              />
            </div>
            {enableMusic && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Volume: {musicVolume[0]}%</Label>
                <Slider
                  value={musicVolume}
                  onValueChange={setMusicVolume}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Gameplay Settings */}
      <Card className="p-4 bg-background/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <h3 className="font-retro text-lg text-foreground">Gameplay Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-repeat" className="text-sm font-retro text-muted-foreground">
              Auto-Repeat Movement
            </Label>
            <Switch
              id="auto-repeat"
              checked={autoRepeat}
              onCheckedChange={setAutoRepeat}
            />
          </div>
        </div>
      </Card>

      {/* Visual Settings */}
      <Card className="p-4 bg-background/50 border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="font-retro text-lg text-foreground">Visual Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-ghost" className="text-sm font-retro text-muted-foreground">
              Show Ghost Piece
            </Label>
            <Switch
              id="show-ghost"
              checked={showGhost}
              onCheckedChange={setShowGhost}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid" className="text-sm font-retro text-muted-foreground">
              Show Grid Lines
            </Label>
            <Switch
              id="show-grid"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-particles" className="text-sm font-retro text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Particle Effects
            </Label>
            <Switch
              id="enable-particles"
              checked={enableParticles}
              onCheckedChange={setEnableParticles}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="flex-1 font-retro text-sm"
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={onClose}
          className="flex-1 font-retro text-sm bg-primary hover:bg-primary/90"
        >
          Save & Close
        </Button>
      </div>
    </div>
  );
};
