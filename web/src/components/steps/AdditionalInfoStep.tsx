import { Control, Controller, useFieldArray } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Field } from '../ui/Field';
import { Plus, Trash2 } from 'lucide-react';

interface Props { control: Control<CVData> }

export function AdditionalInfoStep({ control }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'additionalInfo' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {fields.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: '16px' }}>
          No additional sections yet. Add certifications, languages, interests, or anything else.
        </div>
      )}
      {fields.map((field, i) => (
        <div key={field.id} style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)', position: 'relative' }}>
          <button type="button" onClick={() => remove(i)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444' }}>
            <Trash2 size={14} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Controller control={control} name={`additionalInfo.${i}.title`} render={({ field: f }) => (
              <Field label="Section Title" value={f.value} onChange={f.onChange} onBlur={f.onBlur} placeholder="e.g. Languages, Certifications, Interests" />
            )} />
            <Controller control={control} name={`additionalInfo.${i}.content`} render={({ field: f }) => (
              <Field label="Content" value={f.value} onChange={f.onChange} onBlur={f.onBlur} placeholder="Enter the details for this section..." rows={3} />
            )} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append({ title: '', content: '' })}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1px dashed var(--border-hover)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, justifyContent: 'center', width: '100%' }}>
        <Plus size={16} /> Add Custom Section
      </button>
    </div>
  );
}
