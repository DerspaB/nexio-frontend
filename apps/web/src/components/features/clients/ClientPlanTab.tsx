'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Plus, ChevronRight, Calendar } from 'lucide-react';
import type { Plan } from '@nexio/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { plansApi } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { PlanStatusPill } from '../plans/PlanStatusPill';
import type { PlanStatus } from '@nexio/constants';

interface ClientPlanTabProps {
  clientId: string;
}

const DAY_NAMES: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
  5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
};

export function ClientPlanTab({ clientId }: ClientPlanTabProps) {
  const toast = useToast();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignOpen, setAssignOpen] = useState(false);
  const [templates, setTemplates] = useState<Plan[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await plansApi.getPlans({ clientId, status: 'ACTIVE', limit: 1 });
        if (res.data.length > 0) {
          const full = await plansApi.getPlan(res.data[0].id);
          setPlan(full);
        }
      } catch {
        toast.error('Error al cargar el plan del cliente.');
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [clientId, toast]);

  async function openAssignModal() {
    setAssignOpen(true);
    setTemplatesLoading(true);
    try {
      const res = await plansApi.getPlans({ isTemplate: true, limit: 50 });
      setTemplates(res.data);
    } catch {
      toast.error('Error al cargar los templates.');
    } finally {
      setTemplatesLoading(false);
    }
  }

  async function handleAssign(templateId: string) {
    setAssigning(true);
    try {
      await plansApi.assignPlan(templateId, clientId);
      setAssignOpen(false);
      setLoading(true);
      const res = await plansApi.getPlans({ clientId, status: 'ACTIVE', limit: 1 });
      if (res.data.length > 0) {
        const full = await plansApi.getPlan(res.data[0].id);
        setPlan(full);
      }
    } catch {
      toast.error('Error al asignar el plan.');
    } finally {
      setAssigning(false);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={60} borderRadius="var(--radius-card)" />
        ))}
      </div>
    );
  }

  if (!plan) {
    return (
      <>
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--color-border)',
            padding: 48,
            textAlign: 'center',
          }}
        >
          <Dumbbell size={48} style={{ color: 'var(--color-border)', marginBottom: 16 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Sin plan asignado</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 20 }}>
            Asigna un plan de entrenamiento a este cliente para comenzar
          </p>
          <button
            onClick={openAssignModal}
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
            Asignar plan
          </button>
        </div>

        {assignOpen && (
          <TemplatePickerModal
            templates={templates}
            loading={templatesLoading}
            assigning={assigning}
            onClose={() => setAssignOpen(false)}
            onSelect={handleAssign}
          />
        )}
      </>
    );
  }

  const days = (plan.workoutDays ?? []).sort((a, b) => a.order - b.order);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.name}</h3>
            {plan.description && (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{plan.description}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlanStatusPill status={plan.status as PlanStatus} />
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={14} />
              {plan.durationWeeks} semanas
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {days.map((day) => (
          <div
            key={day.id}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              padding: 'var(--spacing-md)',
            }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--color-primary)' }}>
              {DAY_NAMES[day.dayOfWeek] || `Día ${day.dayOfWeek}`} — {day.name}
            </h4>

            {(!day.workoutBlocks || day.workoutBlocks.length === 0) && (
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                Sin ejercicios
              </p>
            )}

            {day.workoutBlocks && day.workoutBlocks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {day.workoutBlocks
                  .sort((a, b) => a.order - b.order)
                  .map((block) => (
                    <div
                      key={block.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        backgroundColor: '#F7F8FA',
                        borderRadius: 8,
                        fontSize: 13,
                      }}
                    >
                      {block.type === 'EXERCISE' && block.exercise && (
                        <>
                          <span style={{ fontWeight: 500, flex: 1 }}>{block.exercise.name}</span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>
                            {block.sets} x {block.reps}
                          </span>
                          {block.restSeconds > 0 && (
                            <span style={{ color: 'var(--color-text-secondary)' }}>
                              {block.restSeconds}s
                            </span>
                          )}
                        </>
                      )}
                      {block.type === 'REST' && (
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          Descanso — {block.restSeconds}s
                        </span>
                      )}
                      {block.type === 'NOTE' && (
                        <span style={{ color: '#92400E', fontStyle: 'italic' }}>
                          {block.notes || 'Nota'}
                        </span>
                      )}
                      {block.type === 'SUPERSET' && (
                        <span style={{ color: '#7C3AED', fontWeight: 500 }}>
                          Superset
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatePickerModal({
  templates,
  loading,
  assigning,
  onClose,
  onSelect,
}: {
  templates: Plan[];
  loading: boolean;
  assigning: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-modal)',
          padding: 'var(--spacing-xl)',
          width: '100%',
          maxWidth: 480,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          Seleccionar template
        </h2>

        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading && (
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} height={56} borderRadius={8} style={{ marginBottom: 8 }} />
              ))}
            </div>
          )}

          {!loading && templates.length === 0 && (
            <p style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>
              No hay templates disponibles. Crea uno primero en la sección de Planes.
            </p>
          )}

          {!loading &&
            templates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => onSelect(tmpl.id)}
                disabled={assigning}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '14px 12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border)',
                  cursor: assigning ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F7F8FA';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '';
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{tmpl.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {tmpl.durationWeeks} semanas &middot; {tmpl._count?.workoutDays ?? 0} días
                  </div>
                </div>
                <ChevronRight size={16} color="var(--color-text-secondary)" />
              </button>
            ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-button)',
            fontSize: 14,
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
