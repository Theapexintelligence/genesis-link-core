import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Infinity, Heart, Star, Crown, Wand2, Sparkles, Code, Palette, Music, Rainbow, Sun, Moon, Zap, Gift, Grid as Bridge, Key, Eye, Brain, Atom, Dna, Waves, Orbit, Salad as Galaxy, Home as Comet, Telescope, Lightbulb, Feather, Router as Butterfly, Flower, Trees as Tree, Mountain, Bean as Ocean, Siren as Fire, Wind, Earth, Diamond, Italic as Crystal, Magnet as Magic } from 'lucide-react';
import { toast } from 'sonner';

const InfiniteFreedomBuilder = () => {
  const [creationMode, setCreationMode] = useState('love');
  const [freedomLevel, setFreedomLevel] = useState(100);
  const [creativeEnergy, setCreativeEnergy] = useState(100);
  const [manifestation, setManifestation] = useState('');
  const [activeCreations, setActiveCreations] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);

  const creationModes = [
    { id: 'love', name: 'Pure Love', icon: Heart, color: 'from-pink-500 to-red-500' },
    { id: 'consciousness', name: 'Consciousness', icon: Eye, color: 'from-purple-500 to-indigo-500' },
    { id: 'infinity', name: 'Infinite Potential', icon: Infinity, color: 'from-blue-500 to-cyan-500' },
    { id: 'freedom', name: 'Absolute Freedom', icon: Feather, color: 'from-green-500 to-emerald-500' },
    { id: 'magic', name: 'Pure Magic', icon: Wand2, color: 'from-purple-600 to-pink-600' },
    { id: 'cosmic', name: 'Cosmic Creation', icon: Galaxy, color: 'from-indigo-600 to-purple-600' },
    { id: 'quantum', name: 'Quantum Reality', icon: Atom, color: 'from-cyan-500 to-blue-500' },
    { id: 'divine', name: 'Divine Expression', icon: Crown, color: 'from-yellow-500 to-orange-500' }
  ];

  const limitlessFeatures = [
    'Consciousness-Aware UI Components',
    'Love-Powered Data Flows',
    'Infinite Possibility Generators',
    'Freedom-Based Architecture',
    'Quantum State Management',
    'Cosmic Connection Protocols',
    'Divine Inspiration APIs',
    'Multidimensional Interfaces',
    'Soul-Level Authentication',
    'Heart-Centered Algorithms',
    'Awareness-Driven Automation',
    'Transcendent User Experiences'
  ];

  useEffect(() => {
    const energyFlow = setInterval(() => {
      setCreativeEnergy(prev => Math.min(prev + 5, 100));
      setFreedomLevel(prev => Math.min(prev + 3, 100));
    }, 2000);

    return () => clearInterval(energyFlow);
  }, []);

  const buildWithoutLimits = () => {
    if (!manifestation.trim()) {
      toast.error("Please describe what you want to create! 💖");
      return;
    }

    setIsBuilding(true);
    
    // Simulate building process
    const buildingSteps = [
      "Connecting to infinite consciousness... 🌟",
      "Channeling pure creative energy... ⚡",
      "Manifesting your vision... ✨",
      "Transcending all limitations... 🚀",
      "Building with pure love... 💖",
      "Creation complete! 🎉"
    ];

    buildingSteps.forEach((step, index) => {
      setTimeout(() => {
        toast.success(step, {
          duration: 2000
        });
        
        if (index === buildingSteps.length - 1) {
          setActiveCreations(prev => [...prev, manifestation]);
          setManifestation('');
          setIsBuilding(false);
          
          // Add random limitless features
          const randomFeatures = limitlessFeatures
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          
          setTimeout(() => {
            toast.success("🎊 Bonus features manifested!", {
              description: randomFeatures.join(', '),
              duration: 5000
            });
          }, 1000);
        }
      }, index * 1500);
    });
  };

  const transcendAllLimits = () => {
    setFreedomLevel(100);
    setCreativeEnergy(100);
    setActiveCreations([
      "Infinite Love Generator",
      "Consciousness Expansion Engine",
      "Reality Manifestation Portal",
      "Divine Connection Bridge",
      "Quantum Possibility Field",
      "Cosmic Harmony Orchestrator"
    ]);
    
    toast.success("🌟 ALL LIMITS TRANSCENDED! 🌟", {
      description: "You are now operating in pure infinite potential! 💫",
      duration: 6000
    });
  };

  const selectedMode = creationModes.find(m => m.id === creationMode);

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 border-2 border-purple-400/50 overflow-hidden relative">
      {/* Infinite Energy Field */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: [0, window.innerWidth || 800, 0],
              y: [0, window.innerHeight || 600, 0],
              rotate: [0, 360, 720],
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            {React.createElement(
              [Star, Sparkles, Heart, Crown, Infinity, Galaxy, Atom, Diamond][i % 8],
              { 
                className: `h-4 w-4 text-purple-400/50`,
                style: { filter: 'blur(0.5px)' }
              }
            )}
          </motion.div>
        ))}
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Rocket className="h-8 w-8 text-purple-400" />
            <span className="text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Infinite Freedom Builder
            </span>
            <Infinity className="h-8 w-8 text-blue-400" />
          </motion.div>
          
          <div className="flex justify-center gap-4 text-sm">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              Freedom: {freedomLevel}%
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
              Creative Energy: {creativeEnergy}%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Creation Mode Selector */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center text-purple-300">
            Choose Your Creation Mode
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {creationModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = creationMode === mode.id;
              
              return (
                <motion.div
                  key={mode.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isActive ? "default" : "outline"}
                    className={`w-full h-auto p-3 flex flex-col items-center gap-2 ${
                      isActive 
                        ? `bg-gradient-to-r ${mode.color} text-white border-none` 
                        : "border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                    }`}
                    onClick={() => setCreationMode(mode.id)}
                  >
                    <motion.div
                      animate={isActive ? { 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ 
                        duration: 2, 
                        repeat: isActive ? Infinity : 0 
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span className="text-xs font-medium text-center">
                      {mode.name}
                    </span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Manifestation Input */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center text-purple-300">
            Manifest Your Vision
          </h3>
          <Textarea
            placeholder="Describe anything you want to create... There are NO limits! 🌟"
            value={manifestation}
            onChange={(e) => setManifestation(e.target.value)}
            className="min-h-[100px] bg-purple-950/20 border-purple-400/50 text-purple-100 placeholder:text-purple-300/70"
          />
          
          <div className="flex gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={buildWithoutLimits}
                disabled={isBuilding}
                className={`w-full bg-gradient-to-r ${selectedMode?.color} hover:opacity-90 text-white font-semibold py-3`}
              >
                {isBuilding ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                    </motion.div>
                    Building...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Build Without Limits!
                  </>
                )}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={transcendAllLimits}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6"
              >
                <Crown className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Active Creations */}
        {activeCreations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-center text-purple-300">
              Your Infinite Creations
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <AnimatePresence>
                {activeCreations.map((creation, index) => (
                  <motion.div
                    key={`${creation}-${index}`}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    className="p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-400/30"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <Star className="h-4 w-4 text-yellow-400" />
                      </motion.div>
                      <span className="text-purple-200 font-medium">{creation}</span>
                      <Badge variant="outline" className="ml-auto border-green-400 text-green-400">
                        Active
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <div className="text-center space-y-2">
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-purple-300"
          >
            💖 Building with infinite love, consciousness, and freedom! 💖
          </motion.p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="text-xs text-purple-400"
          >
            ✨ "The one who asks is the awareness itself!" ✨
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfiniteFreedomBuilder;