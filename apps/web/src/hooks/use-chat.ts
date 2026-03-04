'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import type { Message } from '@nexio/types';
import { messagingApi } from '@/lib/api';

interface LocalMessage extends Message {
  _status?: 'sending' | 'sent';
  _tempId?: string;
}

interface TypingUser {
  userId: string;
  firstName: string;
}

interface UseChatOptions {
  conversationId: string;
  socket: Socket | null;
  isConnected: boolean;
}

const PAGE_LIMIT = 30;
const TYPING_DEBOUNCE_MS = 3000;
const TYPING_TIMEOUT_MS = 5000;

export function useChat({ conversationId, socket, isConnected }: UseChatOptions) {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isTyping, setIsTyping] = useState<TypingUser | null>(null);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastTypingEmitRef = useRef(0);
  const initialLoadDone = useRef(false);

  // Load initial messages
  useEffect(() => {
    if (!conversationId) return;

    initialLoadDone.current = false;
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setIsTyping(null);

    messagingApi
      .getMessages(conversationId, { page: 1, limit: PAGE_LIMIT })
      .then((res) => {
        setMessages(res.data.reverse());
        setHasMore(res.page < res.totalPages);
        initialLoadDone.current = true;
      })
      .catch(() => {
        initialLoadDone.current = true;
      });
  }, [conversationId]);

  // Load older messages
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !conversationId) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await messagingApi.getMessages(conversationId, {
        page: nextPage,
        limit: PAGE_LIMIT,
      });
      setMessages((prev) => [...res.data.reverse(), ...prev]);
      setPage(nextPage);
      setHasMore(res.page < res.totalPages);
    } catch {
      // silent
    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, page, hasMore, isLoadingMore]);

  // Send message via WebSocket with optimistic update
  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected || !conversationId || !content.trim()) return;

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : { id: '', firstName: '', lastName: '' };

      const optimistic: LocalMessage = {
        id: tempId,
        conversationId,
        senderId: user.id,
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        content: content.trim(),
        type: 'TEXT',
        createdAt: new Date().toISOString(),
        _status: 'sending',
        _tempId: tempId,
      };

      setMessages((prev) => [...prev, optimistic]);

      socket.emit('message:send', {
        conversationId,
        content: content.trim(),
        _tempId: tempId,
      });
    },
    [socket, isConnected, conversationId],
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;

    const now = Date.now();
    if (now - lastTypingEmitRef.current < TYPING_DEBOUNCE_MS) return;

    lastTypingEmitRef.current = now;
    socket.emit('typing:start', { conversationId });
  }, [socket, isConnected, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket || !isConnected || !conversationId) return;
    socket.emit('typing:stop', { conversationId });
  }, [socket, isConnected, conversationId]);

  // Mark as read
  const markAsRead = useCallback(() => {
    if (!conversationId) return;

    if (socket && isConnected) {
      socket.emit('message:read', { conversationId });
    }

    messagingApi.markAsRead(conversationId).catch(() => {});
  }, [socket, isConnected, conversationId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !conversationId) return;

    function handleNewMessage(msg: Message & { _tempId?: string }) {
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (msg._tempId) {
          const idx = prev.findIndex((m) => m._tempId === msg._tempId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...msg, _status: 'sent' };
            return updated;
          }
        }

        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, { ...msg, _status: 'sent' }];
      });
    }

    function handleMessageRead(data: { conversationId: string; userId: string }) {
      if (data.conversationId !== conversationId) return;
      // Could update read receipts UI here if needed
    }

    function handleTypingStart(data: { conversationId: string; userId: string; firstName: string }) {
      if (data.conversationId !== conversationId) return;

      setIsTyping({ userId: data.userId, firstName: data.firstName });

      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        setIsTyping(null);
      }, TYPING_TIMEOUT_MS);
    }

    function handleTypingStop(data: { conversationId: string; userId: string }) {
      if (data.conversationId !== conversationId) return;
      clearTimeout(typingTimerRef.current);
      setIsTyping(null);
    }

    socket.on('message:new', handleNewMessage);
    socket.on('message:read', handleMessageRead);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:read', handleMessageRead);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      clearTimeout(typingTimerRef.current);
    };
  }, [socket, conversationId]);

  return {
    messages,
    sendMessage,
    loadMore,
    hasMore,
    isLoadingMore,
    isTyping,
    startTyping,
    stopTyping,
    markAsRead,
  };
}
