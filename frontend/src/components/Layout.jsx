import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children, currentView, onNavigate }) => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Apply theme on mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, [setTheme]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-primary to-primary-glow p-6 rounded-2xl">
              <div className="h-8 w-8 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return children; // Auth forms will be rendered
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar currentView={currentView} onNavigate={onNavigate} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--success))',
              secondary: 'hsl(var(--success-foreground))',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(var(--destructive))',
              secondary: 'hsl(var(--destructive-foreground))',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;