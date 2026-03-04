'use client';

import { useState } from 'react';
import { Activity, Flame, Tag, Save } from 'lucide-react';
import type { Client } from '@nexio/types';
import { clientsApi } from '@/lib/api';
import { ClientStatusPill } from './ClientStatusPill';

interface ClientGeneralTabProps {
  client: Client;
  onUpdate: () => void;
}

export function ClientGeneralTab({ client, onUpdate }: ClientGeneralTabProps) {
  const [notes, setNotes] = useState(client.notes ?? '');
  const [tags, setTags] = useState<string[]>(client.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleAddTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await clientsApi.updateClient(client.id, { notes, tags });
      onUpdate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-card)',
    border: '1px solid var(--color-border)',
    padding: 'var(--spacing-lg)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Activity size={16} color="var(--color-primary)" />
            <span style={labelStyle}>Adherencia</span>
          </div>
          <p
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {client.adherenceRate}%
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Flame size={16} color="#F59E0B" />
            <span style={labelStyle}>Racha actual</span>
          </div>
          <p
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {client.currentStreak} <span style={{ fontSize: 16, fontWeight: 400 }}>días</span>
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={labelStyle}>Estado</span>
          </div>
          <ClientStatusPill status={client.status} />
        </div>
      </div>

      {/* Info card */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Información</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <div>
            <p style={labelStyle}>Email</p>
            <p style={valueStyle}>{client.user.email}</p>
          </div>
          <div>
            <p style={labelStyle}>Fecha de registro</p>
            <p style={valueStyle}>
              {new Date(client.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p style={labelStyle}>Coach asignado</p>
            <p style={valueStyle}>{client.coachId ?? 'Sin asignar'}</p>
          </div>
          <div>
            <p style={labelStyle}>ID de organización</p>
            <p style={{ ...valueStyle, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {client.organizationId}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Tag size={16} color="var(--color-text-secondary)" />
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Etiquetas</h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                backgroundColor: '#EEF2FF',
                color: 'var(--color-primary)',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: 'var(--color-primary)',
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          ))}
          {tags.length === 0 && (
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              Sin etiquetas
            </span>
          )}
        </div>

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Escribe y presiona Enter para agregar..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--color-border)',
            fontSize: 14,
            outline: 'none',
          }}
        />
      </div>

      {/* Notes */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Notas del coach</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Agrega notas sobre este cliente..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 'var(--radius-input)',
            border: '1px solid var(--color-border)',
            fontSize: 14,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              backgroundColor: saved ? 'var(--color-success)' : 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={14} />
            {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
