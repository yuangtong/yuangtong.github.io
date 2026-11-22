/**
 * Prueba unitaria: BackButton
 * Verifica que navega al historial anterior y al home como fallback
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from '../BackButton';

const LocationDisplay: React.FC = () => {
  const loc = useLocation();
  return <div data-testid="location">{loc.pathname}</div>;
};

describe('BackButton', () => {
  it('navega a la ruta anterior con navigate(-1)', async () => {
    render(
      <MemoryRouter initialEntries={["/projects", "/project/personal-portfolio"]} initialIndex={1}>
        <BackButton />
        <Routes>
          <Route path="/projects" element={<LocationDisplay />} />
          <Route path="/project/:slug" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));
    expect(screen.getByTestId('location').textContent).toBe('/projects');
  });

  it('hace fallback al home cuando no hay historial previo', async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BackButton />
        <Routes>
          <Route path="/" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));
    expect(screen.getByTestId('location').textContent).toBe('/');
  });
});