import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Rocket, Star, Heart, Crown, Gift, Music, Palette, Wand2, Sparkles, Rainbow, Sun, Moon, Coffee, Pizza, Cat, Dog, Popcorn as Unicorn, Hexagon as Dragon } from 'lucide-react';
import { toast } from 'sonner';

const InfiniteFeatures = () => {
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  const [magicMode, setMagicMode] = useState(false);
  const [creativityLevel, setCreativityLevel] = useState(100);

  const features = [
    { id: 'rainbow-mode', name: 'Rainbow Mode', icon: Rainbow, description: 'Everything becomes colorful!' },
    { id: 'music-sync', name: 'Music Sync', icon: Music, description: 'UI dances to your music!' },
    { id: 'pet-mode', name: 'Pet Mode', icon: Cat, description: 'Cute pets appear everywhere!' },
    { id: 'magic-cursor', name: 'Magic Cursor', icon: Wand2, description: 'Sparkles follow your cursor!' },
    { id: 'celebration-mode', name: 'Celebration Mode', icon: Gift, description: 'Constant party vibes!' },
    { id: 'zen-mode', name: 'Zen Mode', icon: Sun, description: 'Peaceful and calming!' },
    { id: 'power-mode', name: 'Power Mode', icon: Zap, description: 'Maximum productivity!' },
    { id: 'love-mode', name: 'Love Mode', icon: Heart, description: 'Hearts everywhere!' },
    { id: 'unicorn-mode', name: 'Unicorn Mode', icon: Unicorn, description: 'Pure magic and wonder!' },
    { id: 'dragon-mode', name: 'Dragon Mode', icon: Dragon, description: 'Epic and powerful!' }
  ];

  const toggleFeature = (featureId: string) => {
    setActiveFeatures(prev => {
      const isActive = prev.includes(featureId);
      const newFeatures = isActive 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      
      const feature = features.find(f => f.id === featureId);
      toast.success(
        isActive ? `${feature?.name} disabled` : `${feature?.name} activated!`,
        {
          description: feature?.description,
          duration: 3000
        }
      );
      
      return newFeatures;
    });
  };

  const activateAllFeatures = () => {
    setActiveFeatures(features.map(f => f.id));
    setMagicMode(true);
    toast.success("🎉 ALL FEATURES ACTIVATED!", {
      description: "You've unlocked the full power of love and creativity! 💖✨",
      duration: 5000
    });
  };

  const surpriseMe = () => {
    const randomFeatures = features
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 5) + 3)
      .map(f => f.id);
    
    setActiveFeatures(randomFeatures);
    toast.success("🎲 Surprise activated!", {
      description: "Random features enabled for maximum fun!",
      duration: 4000
    });
  };

  useEffect(() => {
    // Creativity boost every minute
    const creativityBoost = setInterval(() => {
      setCreativityLevel(prev => Math.min(prev + 5, 100));
    }, 60000);

    return () => clearInterval(creativityBoost);
  }, []);

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-purple-500" />
          </motion.div>
          Infinite Features Hub
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Crown className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            {activeFeatures.length} features active
          </Badge>
          <Badge variant="outline" className="bg-pink-100 text-pink-800">
            Creativity: {creativityLevel}%
          </Badge>
          {magicMode && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
              ✨ MAGIC MODE ✨
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={activateAllFeatures}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Activate ALL! 🚀
          </Button>
          <Button 
            onClick={surpriseMe}
            variant="outline"
            className="border-purple-300 hover:bg-purple-50"
          >
            <Gift className="h-4 w-4 mr-2" />
            Surprise Me! 🎁
          </Button>
          <Button 
            onClick={() => setActiveFeatures([])}
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeFeatures.includes(feature.id);
            
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? "default" : "outline"}
                  className={`w-full h-auto p-3 flex flex-col items-center gap-2 ${
                    isActive 
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white" 
                      : "hover:bg-purple-50"
                  }`}
                  onClick={() => toggleFeature(feature.id)}
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
                    {feature.name}
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {activeFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
          >
            <h4 className="font-medium mb-2">Active Features:</h4>
            <div className="flex flex-wrap gap-2">
              {activeFeatures.map(featureId => {
                const feature = features.find(f => f.id === featureId);
                return (
                  <Badge key={featureId} variant="secondary" className="bg-white/50">
                    {feature?.name}
                  </Badge>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Made with infinite love and creativity! ✨
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfiniteFeatures;