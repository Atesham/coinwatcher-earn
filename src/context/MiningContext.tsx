
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
  const { toast } = useToast();

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
      } else {
        // If never mined before, can mine immediately
        setCanMine(true);
        setNextMineTime(null);
      }
    }
  }, [userData]);

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
  }, [coins, user, userData]);

  // Watch ad functionality
  const watchAd = () => {
    // In a real app, this would show an actual ad
    // For now, we'll just simulate watching an ad
    setWatchedAds((prev) => {
      const newCount = prev + 1;
      
      if (newCount >= 2) {
        setCanMine(true);
        toast({
          title: "Mining Unlocked!",
          description: "You can now start mining coins.",
        });
      } else {
        toast({
          title: "Ad Watched",
          description: `Watch ${2 - newCount} more ad to unlock mining.`,
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
      
      if (watchedAds < 2) {
        toast({
          title: "Watch Ads First",
          description: `Watch ${2 - watchedAds} more ads to start mining.`,
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsMining(true);
    
    // Simulate mining process
    setTimeout(async () => {
      const newCoins = coins + miningRate;
      setCoins(newCoins);
      setIsMining(false);
      setCanMine(false);
      setWatchedAds(0);
      
      const now = new Date();
      setLastMined(now);
      
      const nextTime = new Date(now);
      nextTime.setHours(nextTime.getHours() + 12);
      setNextMineTime(nextTime);
      
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
    }, 3000); // 3 second simulated mining time
  };

  // Stop mining
  const stopMining = () => {
    setIsMining(false);
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
