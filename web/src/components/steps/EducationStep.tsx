import { Control, Controller } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Field } from '../ui/Field';

interface Props { control: Control<CVData> }

export function EducationStep({ control }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      <Controller control={control} name="education.degree" render={({ field }) => (
        <Field label="Degree Name" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g. Bachelor of Business Administration" />
      )} />
      <Controller control={control} name="education.university" render={({ field }) => (
        <Field label="University" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="University Name" />
      )} />
      <Controller control={control} name="education.dates" render={({ field }) => (
        <Field label="Dates" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="Month Year -- Month Year" />
      )} />
      <Controller control={control} name="education.gpa" render={({ field }) => (
        <Field label="GPA" value={field.value} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g. 3.8/4.0" />
      )} />
    </div>
  );
}
