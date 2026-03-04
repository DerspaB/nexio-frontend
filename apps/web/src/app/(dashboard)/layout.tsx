'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardList, MessageSquare, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useConversations } from '@/hooks/use-conversations';
import type { UserPayload } from '@nexio/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserPayload | null>(null);
  const { totalUnread } = useConversations();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    apiClient.setToken(token);
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 200,
            height: 20,
            backgroundColor: 'var(--color-border)',
            borderRadius: 'var(--radius-input)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside
        style={{
          width: 240,
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-primary)',
            marginBottom: 32,
          }}
        >
          Nexio
        </h2>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard, badge: 0 },
            { href: '/clients', label: 'Clientes', icon: Users, badge: 0 },
            { href: '/plans', label: 'Planes', icon: ClipboardList, badge: 0 },
            { href: '/messages', label: 'Mensajes', icon: MessageSquare, badge: totalUnread },
            { href: '/settings', label: 'Ajustes', icon: Settings, badge: 0 },
          ].map(({ href, label, icon: Icon, badge }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return (
              <a
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-input)',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  backgroundColor: active ? '#EEF2FF' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                }}
              >
                <Icon size={18} />
                {label}
                {badge > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      minWidth: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#C62828',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 6px',
                    }}
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 16,
            fontSize: 14,
          }}
        >
          <p style={{ fontWeight: 500 }}>
            {user.firstName} {user.lastName}
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{user.role}</p>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              apiClient.setToken(null);
              router.push('/login');
            }}
            style={{
              marginTop: 8,
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--color-text-secondary)',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 'var(--spacing-xl)' }}>{children}</main>
    </div>
  );
}
