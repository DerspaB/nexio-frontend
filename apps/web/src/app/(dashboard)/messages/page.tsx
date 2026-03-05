'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { useConversations } from '@/hooks/use-conversations';
import { useSocket } from '@/hooks/use-socket';
import { useChat } from '@/hooks/use-chat';
import { ConversationList } from '@/components/features/messages/ConversationList';
import { ChatThread } from '@/components/features/messages/ChatThread';
import { NewConversationModal } from '@/components/features/messages/NewConversationModal';
import type { Conversation } from '@nexio/types';

function getCurrentUserId(): string {
  try {
    const raw = localStorage.getItem('user');
    if (raw) return JSON.parse(raw).id ?? '';
  } catch {}
  return '';
}

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const { conversations, isLoading, mutate } = useConversations();
  const { socket, isConnected, showReconnecting } = useSocket();

  const {
    messages,
    sendMessage,
    loadMore,
    hasMore,
    isLoadingMore,
    isTyping,
    startTyping,
    stopTyping,
    markAsRead,
  } = useChat({
    conversationId: activeConversationId ?? '',
    socket,
    isConnected,
  });

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  // Update conversation list when new messages arrive via socket
  useEffect(() => {
    if (!socket) return;

    function handleNewMessage() {
      mutate();
    }

    socket.on('message:new', handleNewMessage);
    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, mutate]);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      setActiveConversationId(conversationId);
    },
    [],
  );

  const handleConversationCreated = useCallback(
    (conv: Conversation) => {
      mutate();
      setActiveConversationId(conv.id);
    },
    [mutate],
  );

  // Mark as read when opening a conversation
  useEffect(() => {
    if (activeConversationId) {
      markAsRead();
    }
  }, [activeConversationId, markAsRead]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const otherParticipant = activeConversation?.participants.find(
    (p) => p.userId !== currentUserId,
  );
  const participantName = otherParticipant
    ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`
    : '';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 0px)', margin: '-24px' }}>
      {showReconnecting && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#F59E0B',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 100,
          }}
        >
          Reconectando...
        </div>
      )}

      <ConversationList
        conversations={conversations}
        currentUserId={currentUserId}
        activeConversationId={activeConversationId}
        isLoading={isLoading}
        onSelect={handleSelectConversation}
        onNewConversation={() => setShowNewModal(true)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeConversationId ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
            }}
          >
            <MessageSquare size={64} style={{ marginBottom: 16, opacity: 0.2 }} />
            <p style={{ fontSize: 16 }}>Selecciona una conversación</p>
          </div>
        ) : (
          <ChatThread
            participantName={participantName}
            messages={messages}
            currentUserId={currentUserId}
            isTyping={isTyping}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onSend={sendMessage}
            onLoadMore={loadMore}
            onTypingStart={startTyping}
            onTypingStop={stopTyping}
          />
        )}
      </div>
      <NewConversationModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}
