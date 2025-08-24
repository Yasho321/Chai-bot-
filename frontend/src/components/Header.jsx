import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { Button } from './ui/button';
import { Moon, Sun, LogOut, User, Coffee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header = () => {
  const { authUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-lg blur-sm opacity-50"></div>
            <div className="relative bg-primary   p-2 rounded-lg">
              <Coffee className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-primary bg-clip-text text-transparent">
              Chai Bot
            </h1>
            <p className="text-xs text-muted-foreground">Chai Code Learning Guide</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="border-border hover:bg-accent"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User Menu */}
          {authUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-border hover:bg-accent">
                  <User className="h-4 w-4 mr-2" />
                  {authUser.name}
                </Button>
              </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg z-50">
                <div className="px-2 py-1.5 text-sm border-b border-border">
                  <p className="font-medium">{authUser.name}</p>
                  <p className="text-xs text-muted-foreground">{authUser.email}</p>
                  {authUser.role === 'admin' && (
                    <p className="text-xs text-primary font-medium mt-1">Administrator</p>
                  )}
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;