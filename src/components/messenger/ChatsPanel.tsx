import { useState } from "react";
import { Search, PenSquare, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ChatItem = {
  id: string;
  avatar: string;
  title: string;
  lastMessage: string;
  time: string;
  unread?: number;
  pinned?: boolean;
  isChannel?: boolean;
};

const MOCK_CHATS: ChatItem[] = [
  {
    id: "archived",
    avatar: "/placeholder.svg",
    title: "Архивированные чаты",
    lastMessage: "Турция — обмен денег, карты, крипта. Чат TravelAsk",
    time: "",
    unread: 3,
  },
  {
    id: "stvrlight",
    avatar: "/placeholder.svg",
    title: "Stvrlightxtx [BestQuality...]",
    lastMessage: "pls join my new channel",
    time: "3/7/25",
    pinned: true,
  },
  {
    id: "ga-chat",
    avatar: "/placeholder.svg",
    title: "GA 🎮 Chat",
    lastMessage: "pausenberg: Обои зачет",
    time: "04:13",
    unread: 4204,
  },
  {
    id: "playstation",
    avatar: "/placeholder.svg",
    title: "Мир PlayStation",
    lastMessage: "🎮 Премьеру второго сезона «The Last of Us» посмотрели 7,6 млн человек в день релиза",
    time: "Mon",
    unread: 656,
    isChannel: true,
  },
  {
    id: "nu-ne-noi",
    avatar: "/placeholder.svg",
    title: "Ну не ной!",
    lastMessage: "🎮 Prince of Persia: The Lost Crown вышла на мобильных устройствах",
    time: "Mon",
    unread: 512,
    isChannel: true,
  },
  {
    id: "lama-ai",
    avatar: "/placeholder.svg",
    title: "Lama AI",
    lastMessage: "🤖 GPT-4.1 mini также добавлен в бота! Присутствует поддержка...",
    time: "Mon",
    unread: 11,
    isChannel: true,
  },
  {
    id: "ga-store",
    avatar: "/placeholder.svg",
    title: "GA 🎮 Store",
    lastMessage: "В наличии много озаи плюс план изико 2750 пейсел 275",
    time: "Mon",
    unread: 4,
    isChannel: true,
  },
  {
    id: "dostup",
    avatar: "/placeholder.svg",
    title: "«Дай Доступ!» к игросервисам",
    lastMessage: "Metro 2033 Redux — БЕСПЛАТНО. На два дня игра стала бесплатной",
    time: "Mon",
    unread: 84,
    isChannel: true,
  },
];

interface ChatsPanelProps {
  onSelectChat: (chatId: string) => void;
}

export const ChatsPanel = ({ onSelectChat }: ChatsPanelProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showBirthdayBanner, setShowBirthdayBanner] = useState(true);

  return (
    <div className="w-[360px] h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white">👤</span>
          </div>
          <span className="font-medium text-sidebar-foreground">Чаты</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sidebar-accent">
          <PenSquare className="h-5 w-5 text-sidebar-foreground" />
        </button>
      </div>

      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sidebar-foreground/60" />
          <Input 
            placeholder="Поиск (⌘K)" 
            className="pl-9 bg-sidebar-accent border-none text-sidebar-foreground placeholder:text-sidebar-foreground/60 h-9"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-1">
        <TabsList className="mx-3 bg-transparent h-auto p-0 space-x-3">
          <TabsTrigger 
            value="all" 
            className={cn(
              "px-2 py-1 h-auto rounded-md bg-transparent data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-foreground text-sidebar-foreground/70",
              "hover:bg-sidebar-accent/50"
            )}
          >
            Все чаты
          </TabsTrigger>
          <TabsTrigger 
            value="incomes" 
            className={cn(
              "px-2 py-1 h-auto rounded-md bg-transparent data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-foreground text-sidebar-foreground/70",
              "hover:bg-sidebar-accent/50"
            )}
          >
            Входящие
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {showBirthdayBanner && (
        <div className="mx-3 mb-2 p-2 pr-8 bg-sidebar-accent/50 rounded-lg relative">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">🎂</div>
            <div>
              <div className="font-medium text-sm text-sidebar-foreground">Добавь свой день рождения!</div>
              <div className="text-xs text-sidebar-foreground/70">Пусть твои контакты знают, когда ты празднуешь.</div>
            </div>
          </div>
          <button 
            className="absolute right-1 top-1 text-sidebar-foreground/60 hover:text-sidebar-foreground" 
            onClick={() => setShowBirthdayBanner(false)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="overflow-y-auto flex-1">
        {MOCK_CHATS.map((chat) => (
          <button 
            key={chat.id}
            className="w-full text-left px-3 py-2 hover:bg-sidebar-accent flex items-start relative"
            onClick={() => onSelectChat(chat.id)}
          >
            <Avatar className="h-12 w-12 rounded-full mr-3 shrink-0 bg-sidebar-accent">
              <div className="flex items-center justify-center w-full h-full text-xl">
                {chat.id === "archived" ? "🗃️" : chat.id === "playstation" ? "🎮" : "👤"}
              </div>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <div className="font-medium text-sidebar-foreground truncate mr-1">
                  {chat.title}
                </div>
                <div className="text-xs text-sidebar-foreground/60 shrink-0">
                  {chat.time}
                </div>
              </div>
              
              <div className="text-sm text-sidebar-foreground/70 truncate mt-0.5">
                {chat.lastMessage}
              </div>
            </div>
            
            {chat.unread && (
              <div className="absolute right-3 top-[22px] min-w-[24px] h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center px-1.5">
                {chat.unread > 999 ? "999+" : chat.unread}
              </div>
            )}
            
            {chat.pinned && (
              <div className="absolute right-3 top-[22px] text-sidebar-foreground/60">
                📌
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="h-14 px-3 border-t border-sidebar-border flex items-center justify-between">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sidebar-accent">
          <span className="text-sidebar-foreground">👤</span>
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sidebar-accent">
          <Phone className="h-5 w-5 text-sidebar-foreground" />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center relative">
          <span className="text-white">💬</span>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            19
          </div>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-sidebar-accent relative">
          <span className="text-sidebar-foreground">⚙️</span>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            7
          </div>
        </button>
      </div>
    </div>
  );
};
