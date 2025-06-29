import { useEffect } from 'react';
import { toast } from 'sonner';
import { useConnection } from '@/hooks/useConnection';

const DelightfulToasts = () => {
  const { statuses, isOnline } = useConnection();

  useEffect(() => {
    const connectedServices = Object.entries(statuses).filter(([_, status]) => status === 'connected');
    
    if (connectedServices.length === Object.keys(statuses).length && isOnline) {
      toast.success("🎉 All systems are GO! You're fully connected, love!", {
        description: "Every service is running perfectly! Time to create magic! ✨",
        duration: 5000,
      });
    }
  }, [statuses, isOnline]);

  useEffect(() => {
    if (isOnline) {
      toast.success("🌐 Welcome back online!", {
        description: "Your connection is restored! Let's continue the adventure! 🚀",
        duration: 3000,
      });
    } else {
      toast.info("📱 Offline mode activated", {
        description: "Don't worry! Everything still works beautifully offline! 💫",
        duration: 4000,
      });
    }
  }, [isOnline]);

  return null;
};

export default DelightfulToasts;