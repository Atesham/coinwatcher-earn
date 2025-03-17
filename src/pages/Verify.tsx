
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const Verify: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated after the auth check, redirect to home page
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-app-dark flex flex-col items-center justify-center p-6">
      <div className="glass-card rounded-xl p-8 w-full max-w-md text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin">
            <Loader className="h-12 w-12 text-app-blue" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verifying your login...</h1>
          <p className="text-white/70">
            Please wait while we verify your email link. You'll be redirected automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
