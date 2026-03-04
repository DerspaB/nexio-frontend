'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const SOCKET_URL = API_URL.replace('/api', '');
const RECONNECT_TOAST_DELAY = 3000;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [showReconnecting, setShowReconnecting] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(`${SOCKET_URL}/messaging`, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setShowReconnecting(false);
      clearTimeout(reconnectTimerRef.current);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      reconnectTimerRef.current = setTimeout(() => {
        setShowReconnecting(true);
      }, RECONNECT_TOAST_DELAY);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socketRef.current = socket;
  }, []);

  useEffect(() => {
    connect();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        connect();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(reconnectTimerRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return {
    socket: socketRef.current,
    isConnected,
    showReconnecting,
  };
}
