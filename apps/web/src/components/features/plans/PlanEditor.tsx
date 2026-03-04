'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Plan, WorkoutBlock, WorkoutDay, BlockType } from '@nexio/types';
import { plansApi, daysApi, blocksApi } from '@/lib/api';
import { PlanHeader } from './PlanHeader';
import { PlanSidebar } from './PlanSidebar';
import { WorkoutBlockCard } from './WorkoutBlockCard';
import { AddBlockButton } from './AddBlockButton';
import { AddDayModal } from './AddDayModal';
import { AssignPlanModal } from './AssignPlanModal';

interface PlanEditorProps {
  plan: Plan;
  onMutate: () => void;
}

export function PlanEditor({ plan, onMutate }: PlanEditorProps) {
  const days = plan.workoutDays ?? [];
  const [selectedDayId, setSelectedDayId] = useState<string | null>(days[0]?.id ?? null);
  const [localBlocks, setLocalBlocks] = useState<WorkoutBlock[]>([]);
  const [saving, setSaving] = useState(false);
  const [addDayOpen, setAddDayOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const pendingUpdates = useRef<Map<string, Partial<WorkoutBlock>>>(new Map());
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>();

  const selectedDay = days.find((d) => d.id === selectedDayId);

  useEffect(() => {
    if (selectedDay?.workoutBlocks) {
      setLocalBlocks([...selectedDay.workoutBlocks].sort((a, b) => a.order - b.order));
    } else {
      setLocalBlocks([]);
    }
  }, [selectedDay]);

  useEffect(() => {
    if (days.length > 0 && !days.find((d) => d.id === selectedDayId)) {
      setSelectedDayId(days[0].id);
    }
  }, [days, selectedDayId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const flushUpdates = useCallback(async () => {
    if (pendingUpdates.current.size === 0) return;
    setSaving(true);
    const updates = Array.from(pendingUpdates.current.entries());
    pendingUpdates.current.clear();

    try {
      await Promise.all(
        updates.map(([id, data]) => {
          const { exercise, ...apiData } = data as Record<string, unknown>;
          return blocksApi.updateBlock(id, apiData);
        }),
      );
      onMutate();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }, [onMutate]);

  const scheduleAutosave = useCallback(() => {
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(flushUpdates, 3000);
  }, [flushUpdates]);

  useEffect(() => {
    return () => clearTimeout(autosaveTimer.current);
  }, []);

  function handleBlockUpdate(id: string, data: Partial<WorkoutBlock>) {
    setLocalBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data } : b)),
    );
    const existing = pendingUpdates.current.get(id) ?? {};
    pendingUpdates.current.set(id, { ...existing, ...data });
    scheduleAutosave();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localBlocks.findIndex((b) => b.id === active.id);
    const newIndex = localBlocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...localBlocks];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setLocalBlocks(reordered);

    try {
      await blocksApi.reorderBlocks({
        items: reordered.map((b, i) => ({ id: b.id, order: i })),
      });
      onMutate();
    } catch {
      // revert
      setLocalBlocks(localBlocks);
    }
  }

  async function handleAddBlock(type: BlockType) {
    if (!selectedDayId) return;
    const order = localBlocks.length;

    const data: Record<string, unknown> = {
      workoutDayId: selectedDayId,
      type,
      order,
      sets: type === 'EXERCISE' || type === 'SUPERSET' ? 3 : 0,
      reps: type === 'EXERCISE' || type === 'SUPERSET' ? '10' : '',
      restSeconds: type === 'REST' ? 60 : 0,
      notes: type === 'NOTE' ? '' : undefined,
    };

    try {
      await blocksApi.createBlock(data as never);
      onMutate();
    } catch {
      // silent
    }
  }

  async function handleDeleteBlock(id: string) {
    setLocalBlocks((prev) => prev.filter((b) => b.id !== id));
    pendingUpdates.current.delete(id);
    try {
      await blocksApi.deleteBlock(id);
      onMutate();
    } catch {
      // silent
    }
  }

  async function handleAddDay(data: { name: string; dayOfWeek: number }) {
    try {
      await daysApi.createDay({
        planId: plan.id,
        name: data.name,
        dayOfWeek: data.dayOfWeek,
        order: days.length,
      });
      setAddDayOpen(false);
      onMutate();
    } catch {
      // silent
    }
  }

  async function handleDeleteDay(dayId: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este día y todos sus bloques?')) return;
    try {
      await daysApi.deleteDay(dayId);
      onMutate();
    } catch {
      // silent
    }
  }

  async function handleNameChange(name: string) {
    try {
      await plansApi.updatePlan(plan.id, { name });
      onMutate();
    } catch {
      // silent
    }
  }

  async function handleSave() {
    clearTimeout(autosaveTimer.current);
    await flushUpdates();
  }

  async function handleAssign(clientId: string) {
    setAssignLoading(true);
    try {
      await plansApi.assignPlan(plan.id, clientId);
      setAssignOpen(false);
      onMutate();
    } catch {
      // silent
    } finally {
      setAssignLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <PlanHeader
        plan={plan}
        saving={saving}
        onNameChange={handleNameChange}
        onSave={handleSave}
        onAssign={() => setAssignOpen(true)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PlanSidebar
          days={days}
          selectedDayId={selectedDayId}
          durationWeeks={plan.durationWeeks}
          onSelectDay={setSelectedDayId}
          onAddDay={() => setAddDayOpen(true)}
          onDeleteDay={handleDeleteDay}
        />

        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {!selectedDay ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--color-text-secondary)',
              }}
            >
              <p style={{ fontSize: 16, marginBottom: 12 }}>
                {days.length === 0
                  ? 'Este plan no tiene días aún'
                  : 'Selecciona un día del panel izquierdo'}
              </p>
              {days.length === 0 && (
                <button
                  onClick={() => setAddDayOpen(true)}
                  style={{
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
                  Agregar primer día
                </button>
              )}
            </div>
          ) : (
            <div style={{ maxWidth: 700 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                {selectedDay.name}
              </h2>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localBlocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {localBlocks.map((block) => (
                      <WorkoutBlockCard
                        key={block.id}
                        block={block}
                        onUpdate={handleBlockUpdate}
                        onDelete={handleDeleteBlock}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {localBlocks.length === 0 && (
                <div
                  style={{
                    padding: 32,
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                    fontSize: 14,
                    border: '1px dashed var(--color-border)',
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                >
                  No hay bloques en este día. Agrega uno abajo.
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <AddBlockButton onAdd={handleAddBlock} />
              </div>
            </div>
          )}
        </main>
      </div>

      <AddDayModal
        open={addDayOpen}
        durationWeeks={plan.durationWeeks}
        onClose={() => setAddDayOpen(false)}
        onAdd={handleAddDay}
      />

      <AssignPlanModal
        open={assignOpen}
        loading={assignLoading}
        onClose={() => setAssignOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}
