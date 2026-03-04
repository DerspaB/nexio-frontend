'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Plus } from 'lucide-react';
import type { ClientFilters } from '@nexio/types';
import { useClients } from '@/hooks/use-clients';
import { ClientsTable } from '@/components/features/clients/ClientsTable';
import { CreateClientModal } from '@/components/features/clients/CreateClientModal';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'AT_RISK', label: 'En riesgo' },
  { value: 'TRIAL', label: 'Prueba' },
  { value: 'INACTIVE', label: 'Inactivo' },
] as const;

export default function ClientsPage() {
  const [filters, setFilters] = useState<ClientFilters>({ page: 1, limit: 10 });
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { clients, total, page, totalPages, isLoading, mutate } = useClients(filters);

  const updateFilters = useCallback((patch: Partial<ClientFilters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...patch }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchInput || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, updateFilters]);

  function handleStatusChange(status: string) {
    updateFilters({ status: status || undefined });
  }

  function handlePageChange(newPage: number) {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }

  function handleClientCreated() {
    setModalOpen(false);
    mutate();
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Clientes</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            {total} cliente{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-button)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          Nuevo cliente
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
            }}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre o email..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 'var(--radius-input)',
              border: '1px solid var(--color-border)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        <select
          value={filters.status ?? ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--color-border)',
            fontSize: 14,
            outline: 'none',
            backgroundColor: 'var(--color-surface)',
            cursor: 'pointer',
            minWidth: 140,
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!isLoading && clients.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-border)',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <Users
            size={48}
            style={{ color: 'var(--color-border)', marginBottom: 16 }}
          />
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            No hay clientes
          </h3>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            Agrega tu primer cliente para comenzar a trabajar
          </p>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Nuevo cliente
          </button>
        </div>
      ) : (
        <ClientsTable clients={clients} isLoading={isLoading} />
      )}

      {!isLoading && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
          }}
        >
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-button)',
              backgroundColor: 'var(--color-surface)',
              fontSize: 14,
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              opacity: page <= 1 ? 0.5 : 1,
            }}
          >
            Anterior
          </button>
          <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-button)',
              backgroundColor: 'var(--color-surface)',
              fontSize: 14,
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              opacity: page >= totalPages ? 0.5 : 1,
            }}
          >
            Siguiente
          </button>
        </div>
      )}

      <CreateClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleClientCreated}
      />
    </div>
  );
}
