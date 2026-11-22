/**
 * Prueba unitaria: Header navegación
 * Verifica que el logo y el icono Home redirigen a '/'
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../layout/Header';

const LocationDisplay: React.FC = () => {
  const loc = useLocation();
  return <div data-testid="location">{loc.pathname}</div>;
};

describe('Header navigation', () => {
  it('logo YT navega al home desde /projects', async () => {
    render(
      <MemoryRouter initialEntries={["/projects"]}>
        <Header />
        <Routes>
          <Route path="/" element={<LocationDisplay />} />
          <Route path="/projects" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('location').textContent).toBe('/projects');
    fireEvent.click(screen.getByRole('link', { name: /go to home/i }));
    expect(screen.getByTestId('location').textContent).toBe('/');
  });
});