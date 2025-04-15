import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  avatar_url?: string;
  last_message?: string;
  last_message_at?: string;
  is_channel?: boolean;
  unread_count?: number;
}

// Получение всех чатов текущего пользователя
export const getChats = async (): Promise<Chat[]> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Ошибка при получении чатов:', error);
    return [];
  }

  return data || [];
};

// Получение сообщений для конкретного чата
export const getMessages = async (chatId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Ошибка при получении сообщений для чата ${chatId}:`, error);
    return [];
  }

  return data || [];
};

// Отправка нового сообщения
export const sendMessage = async (chatId: string, senderId: string, content: string): Promise<Message | null> => {
  const message = {
    chat_id: chatId,
    sender_id: senderId,
    content,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  if (error) {
    console.error('Ошибка при отправке сообщения:', error);
    return null;
  }

  // Обновляем последнее сообщение в чате
  await supabase
    .from('chats')
    .update({
      last_message: content,
      last_message_at: message.created_at
    })
    .eq('id', chatId);

  return data;
};

// Создание нового чата
export const createChat = async (title: string, participants: string[]): Promise<Chat | null> => {
  const chat = {
    title,
    created_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('chats')
    .insert([chat])
    .select()
    .single();

  if (error) {
    console.error('Ошибка при создании чата:', error);
    return null;
  }

  // Добавляем участников в чат
  const chatParticipants = participants.map(participantId => ({
    chat_id: data.id,
    user_id: participantId
  }));

  const { error: participantsError } = await supabase
    .from('chat_participants')
    .insert(chatParticipants);

  if (participantsError) {
    console.error('Ошибка при добавлении участников в чат:', participantsError);
  }

  return data;
};

// Получение информации о чате
export const getChat = async (chatId: string): Promise<Chat | null> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id', chatId)
    .single();

  if (error) {
    console.error(`Ошибка при получении информации о чате ${chatId}:`, error);
    return null;
  }

  return data;
};
