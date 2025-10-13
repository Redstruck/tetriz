import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

interface HighScoreCelebrationProps {
  isVisible: boolean;
  gameMode: 'regular' | 'extra' | 'speedrun';
  newScore: number;
  previousScore: number;
  onAnimationComplete?: () => void;
}

export const HighScoreCelebration = ({ 
  isVisible, 
  gameMode, 
  newScore, 
  previousScore,
  onAnimationComplete 
}: HighScoreCelebrationProps) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      const timer = setTimeout(() => {
        setShowFireworks(false);
        onAnimationComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationComplete]);

  const getModeConfig = () => {
    switch (gameMode) {
      case 'regular':
        return {
          icon: Trophy,
          color: 'text-cyan-400',
          bgColor: 'from-cyan-500/20 to-blue-500/20',
          borderColor: 'border-cyan-400/50',
          title: 'NEW HIGH SCORE!',
          subtitle: 'CLASSIC MODE',
          scoreLabel: 'Lines Cleared'
        };
      case 'extra':
        return {
          icon: Star,
          color: 'text-purple-400',
          bgColor: 'from-purple-500/20 to-pink-500/20',
          borderColor: 'border-purple-400/50',
          title: 'NEW HIGH SCORE!',
          subtitle: 'EXTRA MODE',
          scoreLabel: 'Lines Cleared'
        };
      case 'speedrun':
        return {
          icon: Zap,
          color: 'text-orange-400',
          bgColor: 'from-orange-500/20 to-red-500/20',
          borderColor: 'border-orange-400/50',
          title: 'NEW RECORD!',
          subtitle: 'SPEEDRUN MODE',
          scoreLabel: 'Round Reached'
        };
    }
  };

  const config = getModeConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fireworks Background */}
          {showFireworks && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 2,
                    repeat: 1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Celebration Card */}
          <motion.div
            className={`
              relative bg-gradient-to-br ${config.bgColor} 
              border-2 ${config.borderColor} 
              rounded-2xl p-8 max-w-md w-full mx-4 text-center
              shadow-2xl shadow-black/50
            `}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 0.6 
            }}
          >
            {/* Glowing Effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.bgColor} blur-xl opacity-50`} />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Trophy Icon */}
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <div className={`p-4 rounded-full bg-gradient-to-br ${config.bgColor} border ${config.borderColor}`}>
                  <Icon className={`w-12 h-12 ${config.color}`} />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className={`text-3xl font-retro font-bold ${config.color} mb-2 tracking-wider`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {config.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-sm font-mono text-gray-300 mb-6 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {config.subtitle}
              </motion.p>

              {/* Score Display */}
              <motion.div
                className="space-y-3 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div>
                  <div className="text-xs text-gray-400 font-mono mb-1">{config.scoreLabel}</div>
                  <div className={`text-4xl font-retro font-bold ${config.color} tracking-wider`}>
                    {newScore.toLocaleString()}
                  </div>
                </div>
                
                {previousScore > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 font-mono">Previous Best</div>
                    <div className="text-xl font-mono text-gray-400 line-through">
                      {previousScore.toLocaleString()}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Improvement Display */}
              {previousScore > 0 && (
                <motion.div
                  className={`text-sm font-mono ${config.color} bg-black/30 rounded-lg px-4 py-2`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  +{(newScore - previousScore).toLocaleString()} improvement!
                </motion.div>
              )}
            </div>

            {/* Pulsing Border Effect */}
            <motion.div
              className={`absolute inset-0 rounded-2xl border-2 ${config.borderColor}`}
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>

          {/* Sparkle Effects */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${40 + Math.random() * 20}%`,
                top: `${40 + Math.random() * 20}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                delay: 1 + Math.random() * 2,
                repeat: 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
