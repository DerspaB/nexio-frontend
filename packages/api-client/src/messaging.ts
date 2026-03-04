import type {
  ConversationListItem,
  Message,
  Conversation,
  CreateMessageRequest,
  CreateConversationRequest,
  MessageFilters,
  PaginatedResponse,
} from '@nexio/types';
import { API_ROUTES } from '@nexio/constants';
import type { ApiClient } from './client';

export function createMessagingApi(client: ApiClient) {
  return {
    getConversations() {
      return client.get<ConversationListItem[]>(API_ROUTES.conversations.list);
    },

    getMessages(conversationId: string, filters?: MessageFilters) {
      const params: Record<string, string | number | undefined> = {};
      if (filters) {
        if (filters.page) params.page = filters.page;
        if (filters.limit) params.limit = filters.limit;
      }
      return client.get<PaginatedResponse<Message>>(
        API_ROUTES.conversations.messages(conversationId),
        params,
      );
    },

    sendMessage(conversationId: string, data: CreateMessageRequest) {
      return client.post<Message>(
        API_ROUTES.conversations.messages(conversationId),
        data,
      );
    },

    markAsRead(conversationId: string) {
      return client.patch<void>(API_ROUTES.conversations.read(conversationId));
    },

    createConversation(data: CreateConversationRequest) {
      return client.post<Conversation>(API_ROUTES.conversations.create, data);
    },
  };
}
