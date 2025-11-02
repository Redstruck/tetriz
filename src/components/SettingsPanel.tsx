import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Volume2, Music, Gamepad2, Eye, Zap } from "lucide-react";
import { useGameSettings } from "@/contexts/GameSettingsContext";

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { settings, updateSetting, resetToDefaults } = useGameSettings();

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
                checked={settings.enableSounds}
                onCheckedChange={(checked) => updateSetting('enableSounds', checked)}
              />
            </div>
            {settings.enableSounds && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Volume: {settings.soundVolume}%</Label>
                <Slider
                  value={[settings.soundVolume]}
                  onValueChange={(value) => updateSetting('soundVolume', value[0])}
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
                checked={settings.enableMusic}
                onCheckedChange={(checked) => updateSetting('enableMusic', checked)}
              />
            </div>
            {settings.enableMusic && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Volume: {settings.musicVolume}%</Label>
                <Slider
                  value={[settings.musicVolume]}
                  onValueChange={(value) => updateSetting('musicVolume', value[0])}
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
              checked={settings.autoRepeat}
              onCheckedChange={(checked) => updateSetting('autoRepeat', checked)}
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
              checked={settings.showGhost}
              onCheckedChange={(checked) => updateSetting('showGhost', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid" className="text-sm font-retro text-muted-foreground">
              Show Grid Lines
            </Label>
            <Switch
              id="show-grid"
              checked={settings.showGrid}
              onCheckedChange={(checked) => updateSetting('showGrid', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-particles" className="text-sm font-retro text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Particle Effects
            </Label>
            <Switch
              id="enable-particles"
              checked={settings.enableParticles}
              onCheckedChange={(checked) => updateSetting('enableParticles', checked)}
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
