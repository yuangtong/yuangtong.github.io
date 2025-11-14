// Archivo: WorkSectionLimit.test.tsx
// Propósito: Verificar que la sección Work limita elementos en Home y ofrece navegación a la vista completa.
import React from 'react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Work from '../Work';
import { featuredWorks } from '../../../pages/work/workData';
import { DISPLAY_CONFIG } from '../../../utils/constants';

describe('Work section grid behavior', () => {
  test('limits visible items in Home according to DISPLAY_CONFIG.HOME_WORKS_LIMIT', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    );

    // Each work item renders an h3 heading with the title
    const itemHeadings = screen.getAllByRole('heading', { level: 3 });
    const expectedCount = Math.min(featuredWorks.length, DISPLAY_CONFIG.HOME_WORKS_LIMIT);
    expect(itemHeadings.length).toBe(expectedCount);
  });

  test('renders navigation to view all works', () => {
    render(
      <MemoryRouter>
        <Work />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /view all works/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/work');
  });
});