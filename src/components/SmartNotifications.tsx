import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useConnection } from '@/hooks/useConnection';

const SmartNotifications = () => {
  const { statuses, isOnline } = useConnection();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState<Record<string, string>>({});

  // Welcome message on first load
  useEffect(() => {
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast.success("🌟 Welcome to Apex Genesis 2.0!", {
          description: "Your universal connector is ready to create magic! Everything is designed to work perfectly for you! 💫",
          duration: 6000,
        });
        setHasShownWelcome(true);
      }, 1000);
    }
  }, [hasShownWelcome]);

  // Smart connection notifications
  useEffect(() => {
    Object.entries(statuses).forEach(([service, status]) => {
      const previousStatus = connectionHistory[service];
      
      if (previousStatus && previousStatus !== status) {
        switch (status) {
          case 'connected':
            toast.success(`✨ ${service} connected!`, {
              description: "Everything is working beautifully! 🎉",
              duration: 3000,
            });
            break;
          case 'connecting':
            toast.loading(`🔄 Connecting to ${service}...`, {
              description: "Hang tight, we're working on it! 💪",
              duration: 2000,
            });
            break;
          case 'error':
            toast.error(`⚠️ ${service} connection issue`, {
              description: "Don't worry! We'll keep trying and you can still use offline features! 🛡️",
              duration: 4000,
            });
            break;
        }
      }
    });
    
    setConnectionHistory(statuses);
  }, [statuses, connectionHistory]);

  // Motivational messages
  useEffect(() => {
    const motivationalMessages = [
      "🚀 You're doing amazing! Keep building!",
      "💡 Every connection makes your system more powerful!",
      "🌈 Your creativity is limitless!",
      "⭐ This system believes in you!",
      "🎯 You're on the right track!",
      "💖 Made with love, just for you!"
    ];

    const showMotivationalMessage = () => {
      const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      toast.info(message, {
        duration: 4000,
      });
    };

    // Show motivational message every 5 minutes
    const interval = setInterval(showMotivationalMessage, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Time-based greetings
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "";
    
    if (hour < 12) {
      greeting = "🌅 Good morning! Ready to build something amazing?";
    } else if (hour < 17) {
      greeting = "☀️ Good afternoon! Hope you're having a productive day!";
    } else {
      greeting = "🌙 Good evening! Perfect time for some creative coding!";
    }

    setTimeout(() => {
      toast.info(greeting, {
        duration: 4000,
      });
    }, 3000);
  }, []);

  return null;
};

export default SmartNotifications;