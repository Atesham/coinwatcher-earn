
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import RankingCard from '@/components/RankingCard';
import { Trophy, Users, Search } from 'lucide-react';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('global');
  
  // Dummy data for global rankings
  const globalRankings = [
    {
      id: 1,
      name: 'Emma Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rank: 1,
      coins: 1356789,
    },
    {
      id: 2,
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rank: 2,
      coins: 945678,
    },
    {
      id: 3,
      name: 'Sophia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      rank: 3,
      coins: 845123,
    },
    {
      id: 4,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rank: 16,
      coins: 354780,
      isCurrentUser: true,
    },
    {
      id: 5,
      name: 'Olivia Brown',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      rank: 4,
      coins: 650432,
    },
    {
      id: 6,
      name: 'Lucas Taylor',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      rank: 5,
      coins: 543210,
    },
  ];
  
  // Dummy data for friends rankings
  const friendsRankings = [
    {
      id: 1,
      name: 'David Lee',
      avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
      rank: 1,
      coins: 482567,
    },
    {
      id: 2,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rank: 2,
      coins: 354780,
      isCurrentUser: true,
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      rank: 3,
      coins: 287654,
    },
    {
      id: 4,
      name: 'Michael Brown',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      rank: 4,
      coins: 189432,
    },
    {
      id: 5,
      name: 'Jessica Miller',
      avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
      rank: 5,
      coins: 156789,
    },
  ];
  
  // Display rankings based on active tab
  const displayRankings = activeTab === 'global' ? globalRankings : friendsRankings;
  
  return (
    <Layout>
      {/* Top section */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">Community Rankings</h1>
        <p className="text-white/70 text-sm">Mine together and compete for the top spot!</p>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full bg-app-card border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-app-blue"
        />
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-app-card rounded-lg p-1.5">
        <button
          className={`tab-button flex-1 flex items-center justify-center ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <Trophy className="h-4 w-4 mr-1.5" />
          Global
        </button>
        <button
          className={`tab-button flex-1 flex items-center justify-center ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          <Users className="h-4 w-4 mr-1.5" />
          Friends
        </button>
      </div>
      
      {/* Top 3 rankings */}
      <div className="flex justify-between mb-8">
        {displayRankings.slice(0, 3).map((user, index) => {
          // Center the #1 rank, put #2 on left and #3 on right
          const order = index === 0 ? 2 : index === 1 ? 1 : 3;
          
          return (
            <div
              key={user.id}
              className="flex flex-col items-center"
              style={{ order }}
            >
              <div className={`
                relative
                ${order === 2 ? 'w-20 h-20 mb-1' : 'w-16 h-16 mt-4 mb-1'}
              `}>
                {/* Crown for #1 */}
                {order === 2 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-app-yellow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15 6L19 7L17 11L19 15L15 14L12 18L9 14L5 15L7 11L5 7L9 6L12 2Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
                
                <div className={`
                  w-full h-full rounded-full overflow-hidden border-2
                  ${order === 2 ? 'border-app-yellow' : order === 1 ? 'border-white/40' : 'border-app-yellow/40'}
                `}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className={`
                  absolute -bottom-2 right-0 rounded-full text-xs font-semibold px-2 py-0.5
                  ${order === 2 ? 'bg-app-yellow text-app-dark' : 
                    order === 1 ? 'bg-white/80 text-app-dark' : 
                    'bg-app-yellow/40 text-white'}
                `}>
                  #{user.rank}
                </div>
              </div>
              
              <div className="text-center mt-2">
                <div className="text-sm font-medium truncate max-w-[80px]">{user.name}</div>
                <div className="text-xs text-white/60">{user.coins.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Full rankings list */}
      <div className="space-y-3">
        <h2 className="text-white/70 font-medium px-1 mb-2">Rankings</h2>
        
        {displayRankings.map((user) => (
          <RankingCard key={user.id} user={user} />
        ))}
      </div>
    </Layout>
  );
};

export default Community;
