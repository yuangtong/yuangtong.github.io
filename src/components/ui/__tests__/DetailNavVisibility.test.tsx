/**
 * Pruebas: DetailNav visibilidad y comportamiento
 * - Visible en ContentDetail (blog/project/work)
 * - También aparece en páginas de listado (Projects, Blog, Work)
 * - Back navega al historial y Home a '/'
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentDetail } from '../ContentDetail';
import { ProjectsPage } from '../../../pages/projects/ProjectsPage';

const LocationDisplay: React.FC = () => {
  const loc = useLocation();
  return <div data-testid="location">{loc.pathname}</div>;
};

describe('DetailNav', () => {
  it('se muestra en ContentDetail y funciona Back/Home', () => {
    const mockItem = {
      id: 'b1',
      slug: 'post-uno',
      title: 'Post Uno',
      content: 'Contenido de prueba',
      date: '2024-08-01',
      readTime: '2 min',
      category: 'Blog',
      image: 'https://example.com/blog.jpg'
    };

    render(
      <MemoryRouter initialEntries={["/blogs/post-uno"]}>
        <Routes>
          <Route path="/" element={<LocationDisplay />} />
          <Route path="/blogs/:slug" element={<><LocationDisplay /><ContentDetail type="blog" item={mockItem} /></>} />
        </Routes>
      </MemoryRouter>
    );

    // DetailNav visible: botón Back y link Home
    const backBtn = screen.getByRole('button', { name: /go back/i });
    expect(backBtn).toBeInTheDocument();
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();

    // Back: con historial actual, vuelve a '/'
    fireEvent.click(backBtn);
    expect(screen.getByTestId('location').textContent).toBe('/');

    // Desde '/', Home también navega a '/'
    fireEvent.click(homeLink);
    expect(screen.getByTestId('location').textContent).toBe('/');
  });

  it('también se muestra en página de listado (Projects)', () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Routes>
          <Route path="/projects" element={<><LocationDisplay /><ProjectsPage /></>} />
        </Routes>
      </MemoryRouter>
    );

    // DetailNav presente en listados
    const backBtn = screen.getByRole('button', { name: /go back/i });
    expect(backBtn).toBeInTheDocument();
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });
});