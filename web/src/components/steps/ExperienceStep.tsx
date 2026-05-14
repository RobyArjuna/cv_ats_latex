import { Control, Controller, useFieldArray } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Field } from '../ui/Field';
import { Plus, Trash2 } from 'lucide-react';

interface Props { control: Control<CVData> }

const cardStyle = { padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)', position: 'relative' as const };
const addBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1px dashed var(--border-hover)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, justifyContent: 'center' as const, width: '100%' };
const removeBtnStyle = { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444', display: 'flex' };

export function ExperienceStep({ control }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {fields.map((field, i) => (
        <div key={field.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Experience #{i + 1}</span>
            {fields.length > 1 && <button type="button" onClick={() => remove(i)} style={removeBtnStyle}><Trash2 size={14} /></button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {(['title', 'company', 'location', 'dates'] as const).map(name => (
              <Controller key={name} control={control} name={`experience.${i}.${name}`} render={({ field: f }) => (
                <Field label={name.charAt(0).toUpperCase() + name.slice(1)} value={f.value as string} onChange={f.onChange} onBlur={f.onBlur}
                  placeholder={name === 'title' ? 'e.g. Sales Manager' : name === 'company' ? 'Company Name' : name === 'location' ? 'City, State' : 'Month Year -- Present'} />
              )} />
            ))}
          </div>
          <div style={{ marginTop: '14px' }}>
            <Controller control={control} name={`experience.${i}.points`} render={({ field: f }) => (
              <Field label="Key Achievements (one per line)" value={(f.value as string[]).join('\n')}
                onChange={v => f.onChange(v.split('\n'))} onBlur={f.onBlur}
                placeholder="Managed a team of 10 people.\nIncreased efficiency by 20%." rows={4} />
            )} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append({ title: '', company: '', location: '', dates: '', points: [''] })} style={addBtnStyle}>
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );
}
