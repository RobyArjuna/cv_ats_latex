import { Control, Controller } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Field } from '../ui/Field';

interface Props { control: Control<CVData> }

export function SkillsStep({ control }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Controller control={control} name="summary" render={({ field }) => (
        <Field label="Professional Summary" value={field.value} onChange={field.onChange} onBlur={field.onBlur}
          placeholder="Briefly describe your professional background and key achievements..." rows={5} />
      )} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <Controller control={control} name="skills.languages" render={({ field }) => (
          <Field label="Languages & Frameworks" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g. English, Indonesian, Python" />
        )} />
        <Controller control={control} name="skills.tools" render={({ field }) => (
          <Field label="Tools & Technologies" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g. Microsoft Office, SAP, Trello" />
        )} />
        <Controller control={control} name="skills.others" render={({ field }) => (
          <Field label="Other Expertise" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g. Public Speaking, Leadership" />
        )} />
      </div>
    </div>
  );
}
