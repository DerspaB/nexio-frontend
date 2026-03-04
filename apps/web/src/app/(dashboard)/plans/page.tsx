'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Search, Plus } from 'lucide-react';
import type { PlanFilters } from '@nexio/types';
import { plansApi } from '@/lib/api';
import { usePlans } from '@/hooks/use-plans';
import { PlansTable } from '@/components/features/plans/PlansTable';
import { CreatePlanModal } from '@/components/features/plans/CreatePlanModal';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'TEMPLATE', label: 'Template' },
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'PAUSED', label: 'Pausado' },
  { value: 'COMPLETED', label: 'Completado' },
] as const;

type TabValue = 'all' | 'templates';

export default function PlansPage() {
  const [tab, setTab] = useState<TabValue>('templates');
  const [filters, setFilters] = useState<PlanFilters>({
    page: 1,
    limit: 10,
    isTemplate: true,
  });
  const [searchInput, setSearchInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { plans, total, page, totalPages, isLoading, mutate } = usePlans(filters);

  const updateFilters = useCallback((patch: Partial<PlanFilters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...patch }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchInput || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, updateFilters]);

  function handleTabChange(newTab: TabValue) {
    setTab(newTab);
    setFilters({
      page: 1,
      limit: 10,
      isTemplate: newTab === 'templates' ? true : undefined,
      search: searchInput || undefined,
    });
  }

  function handleStatusChange(status: string) {
    updateFilters({ status: status || undefined });
  }

  function handlePageChange(newPage: number) {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }

  function handlePlanCreated() {
    setModalOpen(false);
    mutate();
  }

  async function handleDuplicate(id: string) {
    try {
      await plansApi.duplicatePlan(id);
      mutate();
    } catch {
      // silent
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este plan?')) return;
    try {
      await plansApi.deletePlan(id);
      mutate();
    } catch {
      // silent
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    backgroundColor: active ? '#EEF2FF' : 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-button)',
    cursor: 'pointer',
  });

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
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Planes</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            {total} plan{total !== 1 ? 'es' : ''} encontrado{total !== 1 ? 's' : ''}
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
          Nuevo plan
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 16,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-input)',
          padding: 4,
          width: 'fit-content',
        }}
      >
        <button
          onClick={() => handleTabChange('templates')}
          style={tabStyle(tab === 'templates')}
        >
          Templates
        </button>
        <button
          onClick={() => handleTabChange('all')}
          style={tabStyle(tab === 'all')}
        >
          Todos
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
            placeholder="Buscar por nombre..."
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

      {!isLoading && plans.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-border)',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <ClipboardList
            size={48}
            style={{ color: 'var(--color-border)', marginBottom: 16 }}
          />
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            No hay planes
          </h3>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            Crea tu primer plan de entrenamiento para comenzar
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
            Nuevo plan
          </button>
        </div>
      ) : (
        <PlansTable
          plans={plans}
          isLoading={isLoading}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
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

      <CreatePlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handlePlanCreated}
      />
    </div>
  );
}
