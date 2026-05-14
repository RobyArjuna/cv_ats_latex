import React, { useId } from 'react';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  rows?: number;
  error?: string;
}

export function Field({ label, value, onChange, onBlur, placeholder = '', type = 'text', rows, error }: FieldProps) {
  const id = useId();
  const baseStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: `1.5px solid ${error ? '#ef4444' : 'var(--border)'}`,
    background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)',
    fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit', resize: rows ? 'vertical' : undefined,
    minHeight: rows ? `${rows * 26}px` : undefined,
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = error ? '#ef4444' : 'rgba(99,102,241,0.6)');
  const onBlurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = error ? '#ef4444' : 'var(--border)';
    onBlur?.();
  };

  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: error ? '#f87171' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
        {label}
      </label>
      {rows
        ? <textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={baseStyle} onFocus={onFocus} onBlur={onBlurStyle} />
        : <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={baseStyle} onFocus={onFocus} onBlur={onBlurStyle} />
      }
      {error && <p style={{ marginTop: '4px', fontSize: '11px', color: '#f87171', fontWeight: 500 }}>{error}</p>}
    </div>
  );
}
