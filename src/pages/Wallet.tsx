
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useMining } from '@/context/MiningContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, ArrowUp, ArrowDown, CreditCard, Coins, ChevronRight, Bell } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
}

const Wallet: React.FC = () => {
  const { coins } = useMining();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Fetch transactions from Firebase
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        const transactionsRef = collection(db, 'transactions');
        const q = query(
          transactionsRef, 
          where('userId', '==', user.uid),
          orderBy('date', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const transactionsList: Transaction[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          transactionsList.push({
            id: doc.id,
            type: data.type,
            amount: data.amount,
            date: data.date,
            status: data.status
          });
        });
        
        setTransactions(transactionsList);
        
        // If no transactions, add dummy data for now
        if (transactionsList.length === 0) {
          setTransactions([
            {
              id: '1',
              type: 'mining',
              amount: 12.5,
              date: new Date().toISOString(),
              status: 'completed',
            },
            {
              id: '2',
              type: 'bonus',
              amount: 5.0,
              date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              status: 'completed',
            }
          ]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        
        // Add dummy data if error
        setTransactions([
          {
            id: '1',
            type: 'mining',
            amount: 12.5,
            date: new Date().toISOString(),
            status: 'completed',
          },
          {
            id: '2',
            type: 'bonus',
            amount: 5.0,
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: 'completed',
          }
        ]);
      }
    };
    
    fetchTransactions();
  }, [user]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get icon based on transaction type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mining':
        return <Coins className="h-5 w-5 text-app-blue" />;
      case 'bonus':
        return <Bell className="h-5 w-5 text-app-green" />;
      case 'referral':
        return <ArrowUp className="h-5 w-5 text-app-purple" />;
      default:
        return <ArrowRight className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Layout>
      {/* Wallet card */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-sm text-white/70">Available Balance</h2>
            <div className="flex items-baseline mt-1">
              <span className="text-3xl font-bold">{coins.toFixed(2)}</span>
              <span className="ml-1 text-white/70">coins</span>
            </div>
          </div>
          <div className="bg-app-blue/10 rounded-full p-2">
            <CreditCard className="h-6 w-6 text-app-blue" />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button className="flex-1 bg-app-blue hover:bg-app-light-blue text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>Send</span>
          </button>
          <button className="flex-1 bg-app-card hover:bg-app-card/80 text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <ArrowDown className="h-4 w-4 mr-1" />
            <span>Receive</span>
          </button>
        </div>
      </div>
      
      {/* Transaction history */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <button className="text-app-blue text-sm flex items-center">
            See All
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="glass-card rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="bg-app-card rounded-full p-2 mr-3">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">
                      {transaction.type === 'mining' ? 'Mining Reward' : 
                       transaction.type === 'bonus' ? 'Daily Bonus' : 
                       transaction.type === 'referral' ? 'Referral Bonus' : 
                       transaction.type}
                    </h3>
                    <div className="flex items-center text-xs text-white/60">
                      <span>{formatDate(transaction.date)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">+{transaction.amount}</div>
                  <div className="text-xs text-app-green capitalize">
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-4 text-center text-white/70">
              No transactions yet. Start mining to earn coins!
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
