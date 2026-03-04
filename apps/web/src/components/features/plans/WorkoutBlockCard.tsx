'use client';

import { useState } from 'react';
import { GripVertical, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkoutBlock, Exercise } from '@nexio/types';
import { ExerciseSearchPopover } from './ExerciseSearchPopover';

interface WorkoutBlockCardProps {
  block: WorkoutBlock;
  onUpdate: (id: string, data: Partial<WorkoutBlock>) => void;
  onDelete: (id: string) => void;
}

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  fontSize: 13,
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: 4,
  display: 'block',
};

export function WorkoutBlockCard({ block, onUpdate, onDelete }: WorkoutBlockCardProps) {
  const [showNotes, setShowNotes] = useState(!!block.notes);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleExerciseSelect(exercise: Exercise) {
    onUpdate(block.id, {
      exerciseId: exercise.id,
      exercise: {
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        thumbnailUrl: exercise.thumbnailUrl,
      },
    });
    setShowExerciseSearch(false);
  }

  if (block.type === 'REST') {
    return (
      <div ref={setNodeRef} style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            backgroundColor: '#F7F8FA',
            borderRadius: 12,
            border: '1px solid var(--color-border)',
          }}
        >
          <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--color-text-secondary)' }}>
            <GripVertical size={16} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginRight: 8 }}>
            Descanso
          </span>
          <input
            type="number"
            value={block.restSeconds}
            onChange={(e) => onUpdate(block.id, { restSeconds: parseInt(e.target.value) || 0 })}
            style={{ ...inputStyle, width: 80 }}
            min={0}
          />
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>seg</span>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => onDelete(block.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-secondary)' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (block.type === 'NOTE') {
    return (
      <div ref={setNodeRef} style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '12px 16px',
            backgroundColor: '#FFFBEB',
            borderRadius: 12,
            border: '1px solid #FDE68A',
          }}
        >
          <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--color-text-secondary)', marginTop: 4 }}>
            <GripVertical size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 6, display: 'block' }}>
              Nota
            </span>
            <textarea
              value={block.notes ?? ''}
              onChange={(e) => onUpdate(block.id, { notes: e.target.value })}
              placeholder="Escribe una nota..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', border: '1px solid #FDE68A' }}
            />
          </div>
          <button
            onClick={() => onDelete(block.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-secondary)' }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#F7F8FA',
          borderRadius: 12,
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--color-text-secondary)' }}>
            <GripVertical size={16} />
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <button
              onClick={() => setShowExerciseSearch(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: block.exercise ? 'var(--color-text-primary)' : 'var(--color-primary)',
                padding: 0,
                textAlign: 'left',
              }}
            >
              {block.exercise?.name ?? 'Seleccionar ejercicio'}
            </button>
            {block.exercise?.muscleGroup && (
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 8 }}>
                {block.exercise.muscleGroup}
              </span>
            )}
            {showExerciseSearch && (
              <ExerciseSearchPopover
                currentName={block.exercise?.name ?? ''}
                onSelect={handleExerciseSelect}
                onClose={() => setShowExerciseSearch(false)}
              />
            )}
          </div>

          <button
            onClick={() => onDelete(block.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-secondary)' }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginLeft: 24 }}>
          <div style={{ width: 60 }}>
            <span style={labelStyle}>Series</span>
            <input
              type="number"
              value={block.sets}
              onChange={(e) => onUpdate(block.id, { sets: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min={1}
            />
          </div>
          <div style={{ width: 70 }}>
            <span style={labelStyle}>Reps</span>
            <input
              type="text"
              value={block.reps}
              onChange={(e) => onUpdate(block.id, { reps: e.target.value })}
              style={inputStyle}
              placeholder="8-12"
            />
          </div>
          <div style={{ width: 70 }}>
            <span style={labelStyle}>Descanso</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input
                type="number"
                value={block.restSeconds}
                onChange={(e) => onUpdate(block.id, { restSeconds: parseInt(e.target.value) || 0 })}
                style={inputStyle}
                min={0}
              />
            </div>
          </div>
        </div>

        <div style={{ marginLeft: 24, marginTop: 6 }}>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              padding: '2px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {showNotes ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Notas
          </button>
          {showNotes && (
            <textarea
              value={block.notes ?? ''}
              onChange={(e) => onUpdate(block.id, { notes: e.target.value || null })}
              placeholder="Notas del ejercicio..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', marginTop: 4 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
