import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatsPanel } from "./ChatsPanel";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MessageView } from "./MessageView";

export const MessengerLayout = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [appearance, setAppearance] = useState<"minimalist" | "colorful">("colorful");
  const [showAppearanceSettings, setShowAppearanceSettings] = useState(true);

  return (
    <div className={cn("flex h-screen w-full overflow-hidden")}> 
      <ChatsPanel onSelectChat={setSelectedChat} />
      
      <div className="flex-1 relative overflow-hidden bg-background">
        {!selectedChat && showAppearanceSettings ? (
          <div className="w-full h-full flex items-center justify-center overflow-auto bg-[#1e1e2e] p-4 relative">
            <div 
              className="absolute inset-0 z-0 opacity-15"
              style={{
                backgroundImage: "url('/placeholder.svg')",
                backgroundSize: "400px",
                backgroundRepeat: "repeat"
              }}
            ></div>
            
            <div className="z-10 relative">
              <ThemeSwitcher 
                currentTheme={theme} 
                onThemeChange={setTheme} 
                appearance={appearance}
                onAppearanceChange={setAppearance}
              />
            </div>
            
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
              onClick={() => setShowAppearanceSettings(false)}
            >
              ✕
            </button>
          </div>
        ) : (
          <MessageView chatId={selectedChat} />
        )}
      </div>
    </div>
  );
};

export default MessengerLayout;
