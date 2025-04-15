import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ThemeSwitcherProps {
  currentTheme: "dark" | "light" | "system";
  onThemeChange: (theme: "dark" | "light" | "system") => void;
  appearance: "minimalist" | "colorful";
  onAppearanceChange: (appearance: "minimalist" | "colorful") => void;
}

export const ThemeSwitcher = ({
  currentTheme,
  onThemeChange,
  appearance,
  onAppearanceChange
}: ThemeSwitcherProps) => {
  // Apply theme to document
  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (currentTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [currentTheme]);

  return (
    <div className="max-w-[320px] bg-sidebar rounded-xl p-6 text-center">
      <h1 className="text-xl font-medium text-white mb-6">Внешний вид</h1>

      <div className="flex gap-3 justify-center mb-6">
        <ThemeButton 
          theme="system" 
          currentTheme={currentTheme} 
          onClick={() => onThemeChange("system")}
          icon="🖥️"
          label="Системная"
        />
        <ThemeButton 
          theme="dark" 
          currentTheme={currentTheme} 
          onClick={() => onThemeChange("dark")}
          icon="🌙"
          label="Темная"
        />
        <ThemeButton 
          theme="light" 
          currentTheme={currentTheme} 
          onClick={() => onThemeChange("light")}
          icon="☀️"
          label="Светлая"
        />
      </div>

      <h2 className="text-lg font-medium text-white mb-3">Режим чата</h2>
      
      <div className="flex gap-3 justify-center mb-6">
        <AppearanceButton 
          type="minimalist"
          currentAppearance={appearance}
          onClick={() => onAppearanceChange("minimalist")}
        />
        <AppearanceButton 
          type="colorful"
          currentAppearance={appearance}
          onClick={() => onAppearanceChange("colorful")}
        />
      </div>

      <p className="text-sm text-white/70 mb-4">
        Вы можете изменить эти параметры и многие другие в Настройки > Внешний вид.
      </p>

      <Button 
        variant="ghost" 
        className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 gap-2"
      >
        Следующий совет
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface ThemeButtonProps {
  theme: "dark" | "light" | "system";
  currentTheme: "dark" | "light" | "system";
  onClick: () => void;
  icon: string;
  label: string;
}

const ThemeButton = ({ theme, currentTheme, onClick, icon, label }: ThemeButtonProps) => {
  const isActive = theme === currentTheme;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-3 rounded-xl transition-all",
        isActive 
          ? "bg-blue-600 text-white" 
          : "bg-sidebar-accent text-white/80 hover:bg-sidebar-accent/80"
      )}
    >
      <span className="text-xl mb-1">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
};

interface AppearanceButtonProps {
  type: "minimalist" | "colorful";
  currentAppearance: "minimalist" | "colorful";
  onClick: () => void;
}

const AppearanceButton = ({ type, currentAppearance, onClick }: AppearanceButtonProps) => {
  const isActive = type === currentAppearance;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-36 h-24 rounded-xl overflow-hidden transition-all border-2",
        isActive ? "border-blue-500" : "border-transparent"
      )}
    >
      <div className={cn(
        "absolute inset-0",
        type === "minimalist" ? "bg-gray-800" : "bg-blue-900"
      )}>
        <div className="flex flex-col h-full p-2">
          {/* Chat interface preview */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex-shrink-0"></div>
            <div className="h-2 bg-gray-400 rounded-full w-24"></div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex-shrink-0"></div>
            <div className="h-2 bg-gray-400 rounded-full w-20"></div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-white">
        {type === "minimalist" ? "Минималист" : "Красочный"}
      </div>
    </button>
  );
};
