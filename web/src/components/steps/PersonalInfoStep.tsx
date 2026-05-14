import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CVData } from '@/types/cv';
import { Field } from '../ui/Field';

interface Props {
  control: Control<CVData>;
  errors: FieldErrors<CVData>;
}

export function PersonalInfoStep({ control, errors }: Props) {
  const fields: { name: keyof CVData['personalInfo']; label: string; placeholder: string; type?: string; required?: boolean }[] = [
    { name: 'name', label: 'Full Name *', placeholder: 'Enter your full name', required: true },
    { name: 'role', label: 'Target Role *', placeholder: 'e.g. Project Manager', required: true },
    { name: 'location', label: 'Location', placeholder: 'City, Country' },
    { name: 'email', label: 'Email', placeholder: 'your.email@example.com', type: 'email' },
    { name: 'website', label: 'Website', placeholder: 'yourportfolio.com' },
    { name: 'github', label: 'GitHub', placeholder: 'github.com/username' },
    { name: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { name: 'social', label: 'Social/Instagram', placeholder: 'socialmedia.com/username' },
    { name: 'phone', label: 'Phone', placeholder: '+00 000 0000 000' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      {fields.map(({ name, label, placeholder, type }) => (
        <Controller
          key={name}
          control={control}
          name={`personalInfo.${name}`}
          render={({ field }) => (
            <Field
              label={label}
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              type={type}
              error={errors.personalInfo?.[name]?.message}
            />
          )}
        />
      ))}
    </div>
  );
}
