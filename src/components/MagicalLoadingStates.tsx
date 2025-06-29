import { motion } from 'framer-motion';
import { Loader2, Heart, Star, Sparkles } from 'lucide-react';

interface MagicalLoadingProps {
  isLoading: boolean;
  message?: string;
  type?: 'default' | 'hearts' | 'stars' | 'sparkles';
}

const MagicalLoadingStates = ({ 
  isLoading, 
  message = "Working some magic...", 
  type = 'default' 
}: MagicalLoadingProps) => {
  if (!isLoading) return null;

  const getIcon = () => {
    switch (type) {
      case 'hearts':
        return <Heart className="h-6 w-6 text-pink-500" />;
      case 'stars':
        return <Star className="h-6 w-6 text-yellow-500" />;
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-purple-500" />;
      default:
        return <Loader2 className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <motion.div
        animate={{ 
          rotate: type === 'default' ? 360 : [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: type === 'default' ? 1 : 0.5, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {getIcon()}
      </motion.div>
      
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-sm text-muted-foreground font-medium"
      >
        {message}
      </motion.p>
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
          animate={{
            y: [-20, -60, -20],
            x: [0, (i - 3) * 10, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

export default MagicalLoadingStates;