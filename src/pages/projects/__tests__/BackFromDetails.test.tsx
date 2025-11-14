/**
 * Prueba de integración: Back desde detalle de proyecto
 * Navega a un detalle y usa el BackButton global del Header para volver
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
// Header ya no incluye Back/Home; los controles viven en DetailNav dentro de las vistas de detalle
import { ProjectsPage } from '../ProjectsPage';
import { ProjectDetails } from '../ProjectDetails';

const LocationDisplay: React.FC = () => {
  const loc = useLocation();
  return <div data-testid="location">{loc.pathname}</div>;
};

describe('Projects detail back navigation', () => {
  it('vuelve a /projects al presionar Back en DetailNav', async () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route path="/projects" element={<><LocationDisplay /><ProjectsPage /></>} />
          <Route path="/project/:slug" element={<><LocationDisplay /><ProjectDetails /></>} />
          <Route path="/" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    // Abre el primer proyecto haciendo click en su tarjeta
    const cardLink = await screen.findByRole('link', { name: /read more/i });
    fireEvent.click(cardLink);

    expect(screen.getByTestId('location').textContent).toMatch(/\/project\//);

    // Click en Back dentro del DetailNav
    const backBtn = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(backBtn);
    expect(screen.getByTestId('location').textContent).toBe('/projects');
  });
});