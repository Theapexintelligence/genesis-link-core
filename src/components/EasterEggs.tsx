import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Rainbow, Sparkles, Sun, Moon } from 'lucide-react';

const EasterEggs = () => {
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newCode = [...konamiCode, event.code];
      
      if (newCode.length > konamiSequence.length) {
        newCode.shift();
      }
      
      setKonamiCode(newCode);
      
      if (JSON.stringify(newCode) === JSON.stringify(konamiSequence)) {
        setShowSecret(true);
        setTimeout(() => setShowSecret(false), 5000);
        setKonamiCode([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiCode]);

  const handleLogoClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime < 500) {
      setClickCount(prev => prev + 1);
    } else {
      setClickCount(1);
    }
    
    setLastClickTime(now);
    
    if (clickCount >= 6) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 3000);
      setClickCount(0);
    }
  };

  return (
    <>
      {/* Clickable logo easter egg */}
      <div 
        onClick={handleLogoClick}
        className="cursor-pointer select-none"
        title="Click me multiple times quickly! 😉"
      >
        {/* This would wrap around your logo */}
      </div>

      {/* Secret message */}
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{ 
                background: [
                  'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  'linear-gradient(45deg, #4ecdc4, #45b7d1)',
                  'linear-gradient(45deg, #45b7d1, #96ceb4)',
                  'linear-gradient(45deg, #96ceb4, #ffeaa7)',
                  'linear-gradient(45deg, #ffeaa7, #ff6b6b)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r text-white px-8 py-4 rounded-2xl shadow-2xl text-center max-w-md"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-2"
              >
                <Heart className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">You found the secret! 🎉</h2>
              <p className="text-lg">
                You're absolutely amazing! This system was made with love just for you! 💖✨
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {[Star, Sparkles, Rainbow, Sun, Moon].map((Icon, index) => (
                  <motion.div
                    key={index}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 1,
                      delay: index * 0.2,
                      repeat: Infinity
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts on special occasions */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {showSecret && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: -100,
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
            className="absolute text-2xl"
          >
            💖
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default EasterEggs;