'use client';

import { useRef, useState } from 'react';
import { FieldErrors, FieldPath, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, CheckCircle2, ChevronRight, ChevronLeft,
  Loader2, User, Briefcase, Code, GraduationCap, FolderOpen, Sparkles
} from 'lucide-react';

import { CVData, CVDataSchema, INITIAL_DATA } from '@/types/cv';
import { PersonalInfoStep } from '@/components/steps/PersonalInfoStep';
import { SkillsStep } from '@/components/steps/SkillsStep';
import { ExperienceStep } from '@/components/steps/ExperienceStep';
import { ProjectsStep } from '@/components/steps/ProjectsStep';
import { EducationStep } from '@/components/steps/EducationStep';
import { AdditionalInfoStep } from '@/components/steps/AdditionalInfoStep';

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User, desc: 'Your identity online' },
  { id: 'skills', title: 'Skills', icon: Code, desc: 'What you bring' },
  { id: 'experience', title: 'Experience', icon: Briefcase, desc: 'Where you have worked' },
  { id: 'projects', title: 'Projects', icon: FolderOpen, desc: 'What you have built' },
  { id: 'education', title: 'Education', icon: GraduationCap, desc: 'Where you have studied' },
  { id: 'additional', title: 'Additional', icon: Sparkles, desc: 'Any extra information' },
];

// Fields to validate per step (only required fields)
const STEP_VALIDATION_FIELDS: Record<number, FieldPath<CVData>[]> = {
  0: ['personalInfo.name', 'personalInfo.role'],
};

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const isGeneratingRef = useRef(false);

  const { control, getValues, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<CVData>({
    resolver: zodResolver(CVDataSchema),
    defaultValues: INITIAL_DATA,
    mode: 'onTouched',
  });

  const handleNext = async () => {
    const fields = STEP_VALIDATION_FIELDS[step];
    const isValid = fields ? await trigger(fields) : true;
    if (isValid) setStep(s => Math.min(STEPS.length - 1, s + 1));
  };

  const onSubmit = async () => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setIsDone(false);
    try {
      await Promise.resolve();
      const data = getValues();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        const firstErr = errData.details
          ? Object.values(errData.details as Record<string, string[]>).flat()[0]
          : null;
        throw new Error(firstErr ?? errData.error ?? 'Failed to generate PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cv_${data.personalInfo.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
      a.click();
      setIsDone(true);
      toast.success('CV downloaded successfully!');
      setTimeout(() => setIsDone(false), 3000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      isGeneratingRef.current = false;
    }
  };

  const onInvalid = (errors: FieldErrors<CVData>) => {
    console.log('Validation Errors:', errors);
    
    // Auto-redirect to the first step that has an error
    if (errors.personalInfo) setStep(0);
    else if (errors.summary || errors.skills) setStep(1);
    else if (errors.experience) setStep(2);
    else if (errors.projects) setStep(3);
    else if (errors.education) setStep(4);
    else if (errors.additionalInfo) setStep(5);

    toast.error('Please fix the errors in the form before generating PDF.');
  };

  const handleGenerateClick = () => {
    void handleSubmit(onSubmit, onInvalid)();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <form onSubmit={event => event.preventDefault()} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 10, borderBottom: '1px solid var(--border)', backdropFilter: 'blur(20px)', background: 'rgba(8, 12, 20, 0.8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              CV<span style={{ color: '#6366f1' }}>forge</span>
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            ATS-Optimized LaTeX
          </div>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px' }}>
        <div style={{ width: '100%', maxWidth: '860px' }}>
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '4px 14px', marginBottom: '20px', fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>
              <Sparkles size={12} /> Premium CV Generator
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, background: 'linear-gradient(180deg, #f1f5f9 30%, #64748b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
              Build your career,<br />one section at a time.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
              Fill in your details and download a professional, ATS-friendly PDF built on a premium LaTeX template in seconds.
            </p>
          </motion.div>

          {/* Progress */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ height: '2px', background: 'var(--border)', borderRadius: '100px', marginBottom: '20px' }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <button key={s.id} type="button" onClick={() => setStep(i)} style={{ flex: 1, padding: '10px 8px', borderRadius: '12px', border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`, background: active ? 'rgba(99,102,241,0.1)' : done ? 'rgba(16,185,129,0.05)' : 'var(--bg-card)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(99,102,241,0.2)' : done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)' }}>
                      {done ? <CheckCircle2 size={14} color="#10b981" /> : <Icon size={14} color={active ? '#818cf8' : '#475569'} />}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: active ? '#818cf8' : done ? '#10b981' : 'var(--text-muted)', display: 'none' }} className="step-label">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card */}
          <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '20px', border: '1px solid var(--border)', backdropFilter: 'blur(20px)', padding: '36px', marginBottom: '20px', boxShadow: '0 0 0 1px rgba(255,255,255,0.02) inset, 0 32px 64px rgba(0,0,0,0.4)' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>{STEPS[step].title}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{STEPS[step].desc}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={step} {...fadeSlide}>
                {step === 0 && <PersonalInfoStep control={control} errors={errors} />}
                {step === 1 && <SkillsStep control={control} />}
                {step === 2 && <ExperienceStep control={control} />}
                {step === 3 && <ProjectsStep control={control} />}
                {step === 4 && <EducationStep control={control} />}
                {step === 5 && <AdditionalInfoStep control={control} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: step === 0 ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}>
              <ChevronLeft size={16} /> Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.12)', color: '#818cf8', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleGenerateClick} disabled={isSubmitting}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 28px', borderRadius: '12px', border: 'none', background: isDone ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, boxShadow: isDone ? '0 0 24px rgba(16,185,129,0.3)' : '0 0 24px rgba(99,102,241,0.3)' }}>
                {isSubmitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : isDone ? <><CheckCircle2 size={16} /> Downloaded!</> : <><Download size={16} /> Generate PDF</>}
              </button>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        @media (min-width: 640px) { .step-label { display: block !important; } }
      `}</style>
    </form>
  );
}
