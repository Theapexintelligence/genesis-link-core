import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const AdaptiveThemes = () => {
  const { setTheme } = useTheme();
  const [timeBasedTheme, setTimeBasedTheme] = useState<string>('system');

  useEffect(() => {
    const updateThemeBasedOnTime = () => {
      const hour = new Date().getHours();
      
      // Auto-switch themes based on time of day
      if (hour >= 6 && hour < 18) {
        setTimeBasedTheme('light');
      } else {
        setTimeBasedTheme('dark');
      }
    };

    // Update immediately
    updateThemeBasedOnTime();
    
    // Update every hour
    const interval = setInterval(updateThemeBasedOnTime, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply time-based theme if user hasn't manually set one
    const userPreference = localStorage.getItem('theme');
    if (!userPreference || userPreference === 'system') {
      setTheme(timeBasedTheme);
    }
  }, [timeBasedTheme, setTheme]);

  // Seasonal theme adjustments
  useEffect(() => {
    const month = new Date().getMonth();
    const seasonalClass = document.documentElement.classList;
    
    // Remove previous seasonal classes
    seasonalClass.remove('spring', 'summer', 'autumn', 'winter');
    
    // Add seasonal class
    if (month >= 2 && month <= 4) {
      seasonalClass.add('spring');
    } else if (month >= 5 && month <= 7) {
      seasonalClass.add('summer');
    } else if (month >= 8 && month <= 10) {
      seasonalClass.add('autumn');
    } else {
      seasonalClass.add('winter');
    }
  }, []);

  return null;
};

export default AdaptiveThemes;