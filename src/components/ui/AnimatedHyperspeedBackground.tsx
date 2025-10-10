import { useState, useEffect, useCallback } from 'react';
import Hyperspeed from "@/components/ui/Hyperspeed";
import { hyperspeedPresets } from "@/components/ui/hyperspeed-presets";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimatedHyperspeedBackgroundProps {
  className?: string;
  autoSwitch?: boolean;
  switchInterval?: number;
}

const presetKeys = Object.keys(hyperspeedPresets) as Array<keyof typeof hyperspeedPresets>;

const AnimatedHyperspeedBackground = ({ 
  className = "", 
  autoSwitch = true, 
  switchInterval = 20000 
}: AnimatedHyperspeedBackgroundProps) => {
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();

  const handlePresetChange = useCallback(() => {
    setCurrentPresetIndex((prev) => (prev + 1) % presetKeys.length);
  }, []);

  useEffect(() => {
    if (!autoSwitch) return;

    const interval = setInterval(handlePresetChange, switchInterval);
    return () => clearInterval(interval);
  }, [autoSwitch, switchInterval, handlePresetChange]);

  useEffect(() => {
    // Small delay to ensure smooth loading
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const currentPreset = hyperspeedPresets[presetKeys[currentPresetIndex]];

  if (!isLoaded) {
    return <div className={`bg-black ${className}`} />;
  }

  return (
    <div className={`transition-opacity duration-2000 ${className}`}>
      <Hyperspeed
        key={currentPresetIndex} // Force re-render when preset changes
        effectOptions={{
          ...currentPreset,
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0x1a1a1a,
            brokenLines: 0x1a1a1a,
            leftCars: [0x06b6d4, 0x0ea5e9, 0x3b82f6], // Tetris cyan/blue theme
            rightCars: [0x8b5cf6, 0xa855f7, 0x9333ea], // Tetris purple theme
            sticks: 0x10b981 // Tetris emerald accent
          },
          speedUp: isMobile ? 1.1 : 1.3, // Reduce speed on mobile for performance
          carLightsFade: 0.8,
          totalSideLightSticks: isMobile ? 15 : 30, // Fewer lights on mobile
          lightPairsPerRoadWay: isMobile ? 20 : 35, // Fewer car lights on mobile
          fov: isMobile ? 80 : 90, // Slightly reduced FOV on mobile
          fovSpeedUp: isMobile ? 120 : 150, // Reduced speed-up FOV on mobile
          onSpeedUp: () => {
            // Interactive speed boost on mouse/touch
          },
          onSlowDown: () => {
            // Return to normal speed
          }
        }}
      />
    </div>
  );
};

export default AnimatedHyperspeedBackground;
