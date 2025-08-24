import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "../stores/themeStore";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-accent/10 transition-all duration-300"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;