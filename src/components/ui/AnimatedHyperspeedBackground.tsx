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
            roadColor: 0x1a1a1a, // Brighter road
            islandColor: 0x2a2a2a, // Brighter island
            background: 0x0a0a0a, // Slightly brighter background
            shoulderLines: 0x66ffff, // Bright cyan shoulder lines
            brokenLines: 0x44ffaa, // Bright green broken lines
            leftCars: [0x00e5ff, 0x40c4ff, 0x2196f3], // Bright cyan/blue car lights
            rightCars: [0xd500f9, 0xaa00ff, 0x7c4dff], // Bright purple/magenta car lights
            sticks: 0x00ff88 // Bright emerald side lights
          },
          speedUp: isMobile ? 1.1 : 1.3, // Reduce speed on mobile for performance
          carLightsFade: 0.2, // Even lower fade for maximum brightness
          totalSideLightSticks: isMobile ? 15 : 30, // Fewer lights on mobile
          lightPairsPerRoadWay: isMobile ? 20 : 35, // Fewer car lights on mobile
          carLightsRadius: [0.08, 0.18] as [number, number], // Larger light radius for more brightness
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
