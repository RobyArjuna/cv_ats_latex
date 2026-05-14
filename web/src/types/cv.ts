import { z } from 'zod';

// ─── Zod Schemas ────────────────────────────────────────────────
// No .optional() or .default() here — defaultValues in useForm handles initialization.
// This ensures the inferred type is strict (no undefined) and compatible with react-hook-form.

export const PersonalInfoSchema = z.object({
  name:     z.string().min(1, 'Full name is required'),
  role:     z.string().min(1, 'Target role is required'),
  location: z.string(),
  email:    z.string().email('Must be a valid email').or(z.literal('')),
  website:  z.string(),
  github:   z.string(),
  linkedin: z.string(),
  social:   z.string(),
  phone:    z.string(),
});

export const SkillsSchema = z.object({
  languages: z.string(),
  tools:     z.string(),
  others:    z.string(),
});

export const ExperienceItemSchema = z.object({
  title:    z.string(),
  company:  z.string(),
  location: z.string(),
  dates:    z.string(),
  points:   z.array(z.string()),
});

export const ProjectItemSchema = z.object({
  name:        z.string(),
  tech:        z.string(),
  description: z.string(),
  link:        z.string(),
});

export const EducationSchema = z.object({
  degree:     z.string(),
  university: z.string(),
  dates:      z.string(),
  gpa:        z.string(),
});

export const AdditionalInfoItemSchema = z.object({
  title:   z.string().min(1, 'Section title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const CVDataSchema = z.object({
  personalInfo:   PersonalInfoSchema,
  summary:        z.string(),
  skills:         SkillsSchema,
  experience:     z.array(ExperienceItemSchema),
  projects:       z.array(ProjectItemSchema),
  education:      EducationSchema,
  additionalInfo: z.array(AdditionalInfoItemSchema),
});

// ─── Inferred TypeScript Types ───────────────────────────────────
// These are now strict (no undefined), fully compatible with useForm<CVData>

export type PersonalInfo       = z.infer<typeof PersonalInfoSchema>;
export type Skills             = z.infer<typeof SkillsSchema>;
export type ExperienceItem     = z.infer<typeof ExperienceItemSchema>;
export type ProjectItem        = z.infer<typeof ProjectItemSchema>;
export type Education          = z.infer<typeof EducationSchema>;
export type AdditionalInfoItem = z.infer<typeof AdditionalInfoItemSchema>;
export type CVData             = z.infer<typeof CVDataSchema>;

// ─── Initial State (default values for useForm) ──────────────────

export const INITIAL_DATA: CVData = {
  personalInfo:   { name: '', role: '', location: '', email: '', website: '', github: '', linkedin: '', social: '', phone: '' },
  summary:        '',
  skills:         { languages: '', tools: '', others: '' },
  experience:     [{ title: '', company: '', location: '', dates: '', points: [''] }],
  projects:       [{ name: '', tech: '', description: '', link: '' }],
  education:      { degree: '', university: '', dates: '', gpa: '' },
  additionalInfo: [],
};
