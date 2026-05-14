import { Control, Controller, useFieldArray } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Field } from '../ui/Field';
import { Plus, Trash2 } from 'lucide-react';

interface Props { control: Control<CVData> }

const cardStyle = { padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.015)' };
const addBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: '1px dashed var(--border-hover)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, justifyContent: 'center' as const, width: '100%' };
const removeBtnStyle = { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444', display: 'flex' };

export function ProjectsStep({ control }: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {fields.map((field, i) => (
        <div key={field.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project #{i + 1}</span>
            {fields.length > 1 && <button type="button" onClick={() => remove(i)} style={removeBtnStyle}><Trash2 size={14} /></button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {([
              { name: 'name', label: 'Project Name', placeholder: 'Project Title' },
              { name: 'tech', label: 'Tech Stack / Methods', placeholder: 'e.g. Analysis, Research' },
              { name: 'description', label: 'Description', placeholder: 'Brief description of your project' },
              { name: 'link', label: 'Link', placeholder: 'https://example.com/project' },
            ] as const).map(({ name, label, placeholder }) => (
              <Controller key={name} control={control} name={`projects.${i}.${name}`} render={({ field: f }) => (
                <Field label={label} value={f.value as string} onChange={f.onChange} onBlur={f.onBlur} placeholder={placeholder} />
              )} />
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '', tech: '', description: '', link: '' })} style={addBtnStyle}>
        <Plus size={16} /> Add Project
      </button>
    </div>
  );
}
