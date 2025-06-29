import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnection } from '@/hooks/useConnection';
import { Heart, Star, Sparkles, Zap, Rainbow, Sun, Moon } from 'lucide-react';

const FunConnectionAnimations = () => {
  const { isAnyConnected, statuses } = useConnection();
  const [showCelebration, setShowCelebration] = useState(false);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    const connected = Object.values(statuses).filter(status => status === 'connected').length;
    
    if (connected > connectionCount && connected > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    setConnectionCount(connected);
  }, [statuses, connectionCount]);

  const celebrationEmojis = ['🎉', '✨', '💖', '🌟', '🎊', '💫', '🦄', '🌈'];

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed top-20 right-4 z-50 pointer-events-none"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.5,
              repeat: 3,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 animate-pulse" />
              <span className="font-medium">Connection Success!</span>
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
          </motion.div>
          
          {/* Floating celebration emojis */}
          {celebrationEmojis.map((emoji, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 0, 
                x: 0,
                scale: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: -100, 
                x: (index - 4) * 20,
                scale: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="absolute text-2xl"
              style={{ 
                left: '50%',
                top: '50%'
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Ambient connection glow */}
      {isAnyConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-500/10 to-purple-600/10 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FunConnectionAnimations;