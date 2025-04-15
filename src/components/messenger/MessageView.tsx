import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSupabaseMessages } from "@/hooks/useSupabaseMessages";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageViewProps {
  chatId: string | null;
}

export const MessageView = ({ chatId }: MessageViewProps) => {
  const [messageText, setMessageText] = useState("");
  const { messages, loading, error, sendMessage } = useSupabaseMessages(chatId);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    const success = await sendMessage(messageText);
    if (success) {
      setMessageText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-foreground/60">
        Выберите чат для начала общения
      </div>
    );
  }

  const getChatTitle = () => {
    return chatId === "archived" ? "Архивированные чаты" : 
           chatId === "ga-chat" ? "GA 🎮 Chat" :
           chatId === "playstation" ? "Мир PlayStation" :
           chatId === "nu-ne-noi" ? "Ну не ной!" :
           chatId === "lama-ai" ? "Lama AI" :
           chatId === "ga-store" ? "GA 🎮 Store" :
           chatId === "dostup" ? "«Дай Доступ!» к игросервисам" :
           chatId === "stvrlight" ? "Stvrlightxtx [BestQuality...]" :
           "Чат";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white">
            {chatId === "archived" ? "🗃️" : chatId === "playstation" ? "🎮" : "👤"}
          </div>
          <div>
            <div className="font-medium">{getChatTitle()}</div>
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
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-12 w-1/2 ml-auto" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === 'anonymous'; // В реальном приложении сравнить с ID пользователя
              
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isOwnMessage 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-secondary rounded-tl-none'
                    }`}
                  >
                    {message.content}
                    <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-200' : 'text-foreground/60'}`}>
                      {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-destructive">
            <p>{error}</p>
            <button className="mt-2 text-sm underline" onClick={() => window.location.reload()}>
              Попробовать снова
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-foreground/60">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
              {chatId === "archived" ? "🗃️" : chatId === "playstation" ? "🎮" : "👤"}
            </div>
            <h3 className="text-lg font-medium mb-1">{getChatTitle()}</h3>
            <p className="text-sm">Начните общение прямо сейчас</p>
          </div>
        )}
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
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="absolute right-2 bottom-[10px] text-foreground/70 hover:text-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            className="p-2 ml-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!messageText.trim() || loading}
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
