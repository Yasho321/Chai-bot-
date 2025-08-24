import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';

const Index = () => {
  const { authUser, checkAuth, isCheckingAuth , isLoggedout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoggedout) {
    return (
      <AuthPage />
    );
  }

  // If user is authenticated, show dashboard, otherwise show auth page
  return authUser ? <Dashboard /> : (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-primary p-6 rounded-2xl">
              <div className="h-8 w-8 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Loading Chai Bot...</p>
        </div>
      </div>);
};

export default Index;