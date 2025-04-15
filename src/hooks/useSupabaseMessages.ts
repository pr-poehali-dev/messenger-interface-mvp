import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message, getMessages, sendMessage } from '@/services/messageService';

export const useSupabaseMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(chatId);
        setMessages(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке сообщений:', err);
        setError('Не удалось загрузить сообщения');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Подписка на новые сообщения через Supabase Realtime
    const subscription = supabase
      .channel(`messages:chat_id=eq.${chatId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `chat_id=eq.${chatId}` 
        }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  const sendMessageToChat = async (content: string): Promise<boolean> => {
    if (!chatId) return false;
    
    try {
      // Здесь мы используем фиксированный sender_id для демонстрации
      // В реальном приложении нужно использовать ID текущего пользователя
      const currentUserId = supabase.auth.getUser().then(user => user.data.user?.id) || 'anonymous';
      const result = await sendMessage(chatId, String(currentUserId), content);
      return !!result;
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      setError('Не удалось отправить сообщение');
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage: sendMessageToChat
  };
};
