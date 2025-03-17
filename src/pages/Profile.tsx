
import React from 'react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Shield, Gift, Users, Settings, ChevronRight, Bell, Moon, HelpCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const menuItems = [
    {
      id: 'account',
      title: 'Account',
      items: [
        { 
          icon: <Shield className="h-5 w-5 text-app-blue" />,
          label: 'Security Center',
          badge: 'NEW'
        },
        { 
          icon: <Bell className="h-5 w-5 text-app-green" />,
          label: 'Notifications',
        },
        { 
          icon: <Moon className="h-5 w-5 text-app-purple" />,
          label: 'Appearance',
        },
      ]
    },
    {
      id: 'earnings',
      title: 'Earnings',
      items: [
        { 
          icon: <Gift className="h-5 w-5 text-app-yellow" />,
          label: 'Invite Friends',
          subtitle: 'Earn 20 coins per referral'
        },
        { 
          icon: <Users className="h-5 w-5 text-app-blue" />,
          label: 'Mining Team',
          subtitle: '5 active members'
        },
      ]
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        { 
          icon: <HelpCircle className="h-5 w-5 text-app-blue" />,
          label: 'Help Center',
        },
        { 
          icon: <Settings className="h-5 w-5 text-white/70" />,
          label: 'Settings',
        },
      ]
    }
  ];
  
  return (
    <Layout>
      {/* User profile section */}
      <UserProfile />
      
      {/* Menu sections */}
      <div className="space-y-6 mt-6">
        {menuItems.map((section) => (
          <div key={section.id}>
            <h2 className="text-white/70 font-medium mb-3 px-1">{section.title}</h2>
            <div className="glass-card rounded-xl overflow-hidden">
              {section.items.map((item, index) => (
                <React.Fragment key={item.label}>
                  <button className="w-full text-left p-4 flex items-center justify-between transition-colors duration-200 hover:bg-white/5">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="ml-2 bg-app-blue text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-sm text-white/60">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40" />
                  </button>
                  {index < section.items.length - 1 && (
                    <div className="h-px bg-white/5 mx-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* App version */}
      <div className="mt-8 text-center text-sm text-white/40">
        CoinTap v1.0.0
      </div>
    </Layout>
  );
};

export default Profile;
