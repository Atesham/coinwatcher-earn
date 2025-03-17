
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

interface MiningContextProps {
  coins: number;
  miningRate: number;
  isMining: boolean;
  canMine: boolean;
  lastMined: Date | null;
  nextMineTime: Date | null;
  watchedAds: number;
  timeRemaining: number;
  miningActive: boolean;
  miningComplete: boolean;
  progress: number;
  adsWatched: number;
  totalAdsRequired: number;
  collectMining: () => void;
  startMining: () => void;
  stopMining: () => void;
  watchAd: () => void;
}

const MiningContext = createContext<MiningContextProps | undefined>(undefined);

export const MiningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userData, updateUserData } = useAuth();
  const [coins, setCoins] = useState(0);
  const [miningRate, setMiningRate] = useState(5);
  const [isMining, setIsMining] = useState(false);
  const [watchedAds, setWatchedAds] = useState(0);
  const [lastMined, setLastMined] = useState<Date | null>(null);
  const [nextMineTime, setNextMineTime] = useState<Date | null>(null);
  const [canMine, setCanMine] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [miningComplete, setMiningComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  // Define constants
  const totalAdsRequired = 2;

  // Initialize mining state from user data
  useEffect(() => {
    if (userData) {
      setCoins(userData.coins || 0);
      setMiningRate(userData.miningRate || 5);
      
      if (userData.lastMined) {
        const lastMinedDate = new Date(userData.lastMined);
        setLastMined(lastMinedDate);
        
        // Calculate next mining time (12 hours after last mining)
        const nextTime = new Date(lastMinedDate);
        nextTime.setHours(nextTime.getHours() + 12);
        setNextMineTime(nextTime);
        
        // Check if can mine
        const now = new Date();
        setCanMine(now >= nextTime);
        
        // Calculate time remaining for countdown
        if (now < nextTime) {
          const remaining = Math.floor((nextTime.getTime() - now.getTime()) / 1000);
          setTimeRemaining(remaining);
        } else {
          setTimeRemaining(0);
        }
      } else {
        // If never mined before, can mine immediately
        setCanMine(true);
        setNextMineTime(null);
        setTimeRemaining(0);
      }
    }
  }, [userData]);
  
  // Update timer countdown every second
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setCanMine(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeRemaining]);

  // Update mining progress while mining is active
  useEffect(() => {
    let progressTimer: NodeJS.Timeout | null = null;
    
    if (miningActive && !miningComplete) {
      setProgress(0);
      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setMiningComplete(true);
            setMiningActive(false);
            clearInterval(progressTimer!);
            return 100;
          }
          return newProgress;
        });
      }, 30); // 3 seconds total
    }
    
    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [miningActive, miningComplete]);

  // Update Firebase when coins change
  useEffect(() => {
    const updateCoins = async () => {
      if (user && userData && userData.coins !== coins) {
        try {
          await updateUserData({ coins });
        } catch (error) {
          console.error("Error updating coins in Firebase:", error);
        }
      }
    };

    updateCoins();
  }, [coins, user, userData, updateUserData]);

  // Watch ad functionality
  const watchAd = () => {
    // In a real app, this would show an actual ad
    // For now, we'll just simulate watching an ad
    setWatchedAds((prev) => {
      const newCount = prev + 1;
      
      if (newCount >= totalAdsRequired) {
        setCanMine(true);
        toast({
          title: "Mining Unlocked!",
          description: "You can now start mining coins.",
        });
      } else {
        toast({
          title: "Ad Watched",
          description: `Watch ${totalAdsRequired - newCount} more ad to unlock mining.`,
        });
      }
      
      return newCount;
    });
  };

  // Start mining
  const startMining = async () => {
    if (!canMine) {
      const timeRemaining = nextMineTime ? nextMineTime.getTime() - new Date().getTime() : 0;
      if (timeRemaining > 0) {
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        toast({
          title: "Mining not available",
          description: `You can mine again in ${hoursRemaining}h ${minutesRemaining}m.`,
          variant: "destructive"
        });
        return;
      }
      
      if (watchedAds < totalAdsRequired) {
        toast({
          title: "Watch Ads First",
          description: `Watch ${totalAdsRequired - watchedAds} more ads to start mining.`,
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsMining(true);
    setMiningActive(true);
    setMiningComplete(false);
    
    // Mining is handled by the useEffect above that updates progress
  };

  // Collect mining rewards
  const collectMining = async () => {
    if (miningComplete) {
      const newCoins = coins + miningRate;
      setCoins(newCoins);
      setIsMining(false);
      setMiningActive(false);
      setMiningComplete(false);
      setCanMine(false);
      setWatchedAds(0);
      setProgress(0);
      
      const now = new Date();
      setLastMined(now);
      
      const nextTime = new Date(now);
      nextTime.setHours(nextTime.getHours() + 12);
      setNextMineTime(nextTime);
      setTimeRemaining(12 * 60 * 60); // 12 hours in seconds
      
      // Update user data in Firebase
      if (user) {
        try {
          await updateUserData({ 
            coins: newCoins,
            lastMined: now.toISOString()
          });
          
          toast({
            title: "Mining Successful!",
            description: `You earned ${miningRate} coins. Next mining available in 12 hours.`,
          });
        } catch (error) {
          console.error("Error updating mining data:", error);
          toast({
            title: "Error Saving Mining Results",
            description: "There was an error saving your mining results.",
            variant: "destructive"
          });
        }
      }
    }
  };

  // Stop mining
  const stopMining = () => {
    setIsMining(false);
    setMiningActive(false);
    setProgress(0);
  };

  return (
    <MiningContext.Provider
      value={{
        coins,
        miningRate,
        isMining,
        canMine,
        lastMined,
        nextMineTime,
        watchedAds,
        timeRemaining,
        miningActive,
        miningComplete,
        progress,
        adsWatched: watchedAds,
        totalAdsRequired,
        collectMining,
        startMining,
        stopMining,
        watchAd,
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};

export const useMining = () => {
  const context = useContext(MiningContext);
  if (context === undefined) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
};
