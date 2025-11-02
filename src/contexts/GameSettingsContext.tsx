import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GameSettings {
  // Audio Settings
  soundVolume: number;
  musicVolume: number;
  enableSounds: boolean;
  enableMusic: boolean;
  
  // Gameplay Settings
  autoRepeat: boolean;
  
  // Visual Settings
  showGhost: boolean;
  showGrid: boolean;
  enableParticles: boolean;
}

interface GameSettingsContextType {
  settings: GameSettings;
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundVolume: 70,
  musicVolume: 50,
  enableSounds: true,
  enableMusic: true,
  autoRepeat: true,
  showGhost: true,
  showGrid: false,
  enableParticles: true,
};

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export const GameSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <GameSettingsContext.Provider value={{ settings, updateSetting, resetToDefaults }}>
      {children}
    </GameSettingsContext.Provider>
  );
};

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within GameSettingsProvider');
  }
  return context;
};
