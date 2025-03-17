
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import RankingCard from '@/components/RankingCard';
import { Trophy, Users, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface UserRanking {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rank: number;
  coins: number;
  isCurrentUser?: boolean;
}

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [globalRankings, setGlobalRankings] = useState<UserRanking[]>([]);
  const [friendsRankings, setFriendsRankings] = useState<UserRanking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, userData } = useAuth();
  
  // Fetch global rankings from Firebase
  useEffect(() => {
    const fetchGlobalRankings = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('coins', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        let rank = 1;
        const rankings: UserRanking[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const isCurrentUser = doc.id === user?.uid;
          
          // If this is the current user, store their rank
          if (isCurrentUser) {
            rankings.push({
              id: doc.id,
              name: data.displayName || data.email.split('@')[0],
              email: data.email,
              avatar: data.avatar,
              rank: rank,
              coins: data.coins || 0,
              isCurrentUser: true
            });
          } else {
            rankings.push({
              id: doc.id,
              name: data.displayName || data.email.split('@')[0],
              email: data.email,
              avatar: data.avatar,
              rank: rank,
              coins: data.coins || 0
            });
          }
          
          rank++;
        });
        
        setGlobalRankings(rankings);
        
        // For now, use the same data for friends
        // In a real app, you would filter by friends
        setFriendsRankings(rankings.slice(0, 5));
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };
    
    if (user) {
      fetchGlobalRankings();
    }
  }, [user]);
  
  // Filter rankings based on search query
  const filteredRankings = searchQuery.trim() === '' 
    ? (activeTab === 'global' ? globalRankings : friendsRankings)
    : (activeTab === 'global' ? globalRankings : friendsRankings).filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Display top 3 users
  const topThree = filteredRankings.slice(0, 3);
  
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      {topThree.length > 0 && (
        <div className="flex justify-between mb-8">
          {topThree.map((user, index) => {
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
                    <Avatar className="w-full h-full">
                      <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt={user.name} />
                      <AvatarFallback className="bg-app-blue/20 text-app-blue">
                        {user.name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
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
      )}
      
      {/* Full rankings list */}
      <div className="space-y-3">
        <h2 className="text-white/70 font-medium px-1 mb-2">Rankings</h2>
        
        {filteredRankings.length > 0 ? (
          filteredRankings.map((user) => (
            <RankingCard key={user.id} user={user} />
          ))
        ) : (
          <div className="glass-card p-4 text-center text-white/70">
            No users found. Try a different search.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
