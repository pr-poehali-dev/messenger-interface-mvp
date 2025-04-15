import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessageViewProps {
  chatId: string | null;
}

export const MessageView = ({ chatId }: MessageViewProps) => {
  const [message, setMessage] = useState("");

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-foreground/60">
        Выберите чат для начала общения
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white">
            {chatId === "archived" ? "🗃️" : chatId === "playstation" ? "🎮" : "👤"}
          </div>
          <div>
            <div className="font-medium">
              {chatId === "archived" ? "Архивированные чаты" : 
               chatId === "ga-chat" ? "GA 🎮 Chat" :
               chatId === "playstation" ? "Мир PlayStation" :
               chatId === "nu-ne-noi" ? "Ну не ной!" :
               chatId === "lama-ai" ? "Lama AI" :
               chatId === "ga-store" ? "GA 🎮 Store" :
               chatId === "dostup" ? "«Дай Доступ!» к игросервисам" :
               chatId === "stvrlight" ? "Stvrlightxtx [BestQuality...]" :
               "Чат"}
            </div>
            <div className="text-xs text-foreground/60">был(а) недавно</div>
          </div>
        </div>
        <div className="flex items-center">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent">
            <span className="text-foreground">🔍</span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent">
            <span className="text-foreground">⋮</span>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center h-full text-foreground/60">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
            {chatId === "archived" ? "🗃️" : chatId === "playstation" ? "🎮" : "👤"}
          </div>
          <h3 className="text-lg font-medium mb-1">
            {chatId === "archived" ? "Архивированные чаты" : 
             chatId === "ga-chat" ? "GA 🎮 Chat" :
             chatId === "playstation" ? "Мир PlayStation" :
             chatId === "nu-ne-noi" ? "Ну не ной!" :
             chatId === "lama-ai" ? "Lama AI" :
             chatId === "ga-store" ? "GA 🎮 Store" :
             chatId === "dostup" ? "«Дай Доступ!» к игросервисам" :
             chatId === "stvrlight" ? "Stvrlightxtx [BestQuality...]" :
             "Чат"}
          </h3>
          <p className="text-sm">История сообщений будет отображаться здесь</p>
        </div>
      </div>

      {/* Message input */}
      <div className="p-3 border-t">
        <div className="flex items-end">
          <button className="p-2 mr-2 text-foreground/70 hover:text-foreground">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Написать сообщение..."
              className="pr-10 py-3 min-h-[44px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="absolute right-2 bottom-[10px] text-foreground/70 hover:text-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </div>
          
          <button className="p-2 ml-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!message.trim()}>
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
