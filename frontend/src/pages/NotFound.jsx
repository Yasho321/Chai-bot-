import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-destructive to-warning rounded-2xl blur-lg opacity-20"></div>
          <div className="relative bg-gradient-to-r from-destructive to-warning p-6 rounded-2xl">
            <AlertTriangle className="h-16 w-16 text-white mx-auto" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-shadow"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Attempted route: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;