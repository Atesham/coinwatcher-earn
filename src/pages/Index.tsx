
import React from 'react';
import Layout from '@/components/Layout';
import MiningCircle from '@/components/MiningCircle';
import StatCards from '@/components/StatCards';
import { useMining } from '@/context/MiningContext';
import { Coins } from 'lucide-react';

const Index: React.FC = () => {
  const { coins } = useMining();
  
  return (
    <Layout>
      {/* Balance display */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-sm text-white/70">Your Balance</span>
          <div className="flex items-center">
            <Coins className="h-5 w-5 text-app-yellow mr-1" />
            <span className="text-2xl font-bold">{coins.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="glass-card rounded-full px-4 py-1 flex items-center space-x-1">
          <span className="text-app-blue text-sm">+12.56M</span>
          <span className="text-xs text-white/60">Coins Per Minute</span>
        </div>
      </div>
      
      {/* Stat cards */}
      <StatCards />
      
      {/* Mining circle */}
      <MiningCircle />
    </Layout>
  );
};

export default Index;
