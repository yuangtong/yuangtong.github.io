import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useCVTimeline } from '../useCVTimeline';

vi.mock('../../data/timeline', () => ({
  timeline: [
    { id: '1', dateRange: '2020 – 2021', title: 'Software Engineer', description: 'Built apps', iconKey: 'code' }
  ]
}));

// Mock TranslationContext provider minimal
const TranslationContext = React.createContext<any>(null);
function TranslationProvider({ children, language = 'es' }: { children: React.ReactNode; language?: 'en' | 'es' }) {
  const translate = async (text: string) => `TR_${text}`;
  return (
    <TranslationContext.Provider value={{ language, setLanguage: () => {}, translate }}>
      {children}
    </TranslationContext.Provider>
  );
}

vi.mock('../../context/TranslationContext', () => ({
  useTranslation: () => React.useContext(TranslationContext),
}));

function TimelineProbe() {
  const { milestones, loading, error } = useCVTimeline();
  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  return <div>{milestones[0]?.title}</div>;
}

describe('useCVTimeline', () => {
  it('aplica traducción sobre los hitos cuando idioma no es en', async () => {
    render(
      <TranslationProvider language="es">
        <TimelineProbe />
      </TranslationProvider>
    );
    await waitFor(() => screen.getByText(/TR_Software Engineer/));
    expect(screen.getByText('TR_Software Engineer')).toBeInTheDocument();
  });

  it('no traduce cuando idioma es en', async () => {
    render(
      <TranslationProvider language="en">
        <TimelineProbe />
      </TranslationProvider>
    );
    await waitFor(() => screen.getByText(/Software Engineer/));
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });
});