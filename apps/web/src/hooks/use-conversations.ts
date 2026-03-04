'use client';

import useSWR from 'swr';
import type { ConversationListItem } from '@nexio/types';
import { messagingApi } from '@/lib/api';

export function useConversations() {
  const { data, error, isLoading, mutate } = useSWR<ConversationListItem[]>(
    'conversations',
    () => messagingApi.getConversations(),
  );

  const conversations = Array.isArray(data) ? data : [];
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return {
    conversations,
    totalUnread,
    isLoading,
    error,
    mutate,
  };
}
