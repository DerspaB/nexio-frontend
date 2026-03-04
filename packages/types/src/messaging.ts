export type MessageType = 'TEXT' | 'IMAGE' | 'FILE';

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  unreadCount: number;
  lastReadAt: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  type: MessageType;
  createdAt: string;
}

export interface Conversation {
  id: string;
  organizationId: string;
  lastMessageAt: string | null;
  participants: ConversationParticipant[];
  lastMessage?: Message | null;
}

export interface ConversationListItem extends Conversation {
  unreadCount: number;
}

export interface CreateMessageRequest {
  content: string;
}

export interface CreateConversationRequest {
  participantId: string;
}

export interface MessageFilters {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
}
