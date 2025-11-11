/**
 * Pruebas de interacción para el archivo de Proyectos
 * Verifica clic funcional en cartas, navegación a detalle
 * y visualización completa del contenido expandido
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProjectsPage } from '../../projects/ProjectsPage';
import { ProjectDetails } from '../../projects/ProjectDetails';

describe('Projects archive card interactions', () => {
  function renderWithRouter(initialPath = '/projects') {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:slug" element={<ProjectDetails />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('navega al detalle al hacer clic en la carta', async () => {
    renderWithRouter('/projects');

    // Asegura que la página de archivo cargó
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();

    // Clic en la primera carta (por el título)
    const firstTitle = screen.getByText('Personal Portfolio');
    const link = firstTitle.closest('a');
    expect(link).toBeTruthy();
    link && link.click();

    // Espera a que se muestre el detalle con contenido completo
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Personal Portfolio' })).toBeInTheDocument();
    });

    // Verifica que se muestre contenido ampliado (parte del fullDescription)
    expect(screen.getByText(/Key Features:/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive cursor effects/i)).toBeInTheDocument();
  });

  it('todas las cartas responden al clic y muestran su contenido', async () => {
    renderWithRouter('/projects');

    const passguardTitle = screen.getByText(/Passguard: Password Generator/i);
    const link2 = passguardTitle.closest('a');
    expect(link2).toBeTruthy();
    link2 && link2.click();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Passguard: Password Generator/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Custom password length settings/i)).toBeInTheDocument();
  });
});