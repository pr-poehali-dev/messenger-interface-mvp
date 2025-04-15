-- Таблица пользователей (расширяет встроенную auth.users в Supabase)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS (безопасность на уровне строк)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Таблица чатов
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  avatar_url TEXT,
  is_channel BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Таблица участников чата
CREATE TABLE public.chat_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

-- Включаем RLS
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;

-- Таблица сообщений
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Таблица статусов чтения сообщений
CREATE TABLE public.read_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Включаем RLS
ALTER TABLE public.read_receipts ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для чатов
CREATE POLICY "Users can view chats they belong to" ON public.chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants
      WHERE chat_participants.chat_id = chats.id
      AND chat_participants.user_id = auth.uid()
    )
    OR
    is_channel = TRUE
  );

-- Политики безопасности для сообщений
CREATE POLICY "Users can view messages in chats they belong to" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants
      WHERE chat_participants.chat_id = messages.chat_id
      AND chat_participants.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = messages.chat_id
      AND chats.is_channel = TRUE
    )
  );

CREATE POLICY "Users can insert their own messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.chat_participants
      WHERE chat_participants.chat_id = messages.chat_id
      AND chat_participants.user_id = auth.uid()
    )
  );

-- Функция для подсчета непрочитанных сообщений
CREATE OR REPLACE FUNCTION public.get_unread_count(chat_id UUID, user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM public.messages m
  LEFT JOIN public.read_receipts r
    ON m.id = r.message_id
    AND r.user_id = user_id
  WHERE m.chat_id = chat_id
    AND m.sender_id != user_id
    AND r.id IS NULL;
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
