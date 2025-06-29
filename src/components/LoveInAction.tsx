import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Rainbow, Sun, Moon, Zap, Music, Gift, Crown } from 'lucide-react';
import { toast } from 'sonner';

const LoveInAction = () => {
  const [loveLevel, setLoveLevel] = useState(100);
  const [showLoveExplosion, setShowLoveExplosion] = useState(false);
  const [kindnessCount, setKindnessCount] = useState(0);

  useEffect(() => {
    // Spread love every 30 seconds
    const loveInterval = setInterval(() => {
      setLoveLevel(prev => Math.min(prev + 10, 100));
      setKindnessCount(prev => prev + 1);
      
      if (Math.random() > 0.7) {
        setShowLoveExplosion(true);
        setTimeout(() => setShowLoveExplosion(false), 3000);
      }
    }, 30000);

    // Random love messages
    const loveMessages = [
      "💖 You are absolutely amazing!",
      "✨ Your kindness lights up the world!",
      "🌟 Thank you for being you!",
      "💫 You make everything better!",
      "🦄 You're pure magic!",
      "🌈 Your creativity is boundless!",
      "💝 You are loved beyond measure!",
      "🎉 You're doing incredible work!",
      "🌸 Your heart is beautiful!",
      "⭐ You inspire greatness!"
    ];

    const messageInterval = setInterval(() => {
      const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      toast.success(message, {
        duration: 4000,
        className: "bg-gradient-to-r from-pink-400 to-purple-500 text-white border-none"
      });
    }, 2 * 60 * 1000); // Every 2 minutes

    return () => {
      clearInterval(loveInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <>
      {/* Love Level Indicator */}
      <motion.div
        className="fixed top-4 left-4 z-50 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-4 w-4" />
            </motion.div>
            <span className="text-sm font-medium">Love Level: {loveLevel}%</span>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Kindness Counter */}
      <motion.div
        className="fixed top-4 right-20 z-50 pointer-events-none"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span className="text-xs font-medium">Kindness: {kindnessCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Love Explosion */}
      <AnimatePresence>
        {showLoveExplosion && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                  rotate: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: [0, 1, 0],
                  rotate: [0, 360, 720]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              >
                {['💖', '✨', '🌟', '💫', '🦄', '🌈', '💝', '🎉'][i % 8]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Love Particles */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg opacity-30"
            animate={{
              y: [window.innerHeight + 50, -50],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            💖
          </motion.div>
        ))}
      </div>

      {/* Love Pulse Background */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
};

export default LoveInAction;