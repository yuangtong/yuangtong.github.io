/**
 * Componente UI: UpworkIcon
 * Propósito: Renderiza un ícono simple de Upwork (marca verde) con SVG
 * - Tamaño configurable vía props
 * - Color via currentColor para integrarse con Tailwind
 */
import React from 'react';

interface UpworkIconProps {
  size?: number;
  className?: string;
}

const UpworkIcon: React.FC<UpworkIconProps> = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* Marca simplificada: U y P combinadas */}
    <path d="M3 5a2 2 0 0 1 2-2h4a4 4 0 0 1 4 4v2h2a4 4 0 1 1 0 8h-1v-3h1a1 1 0 1 0 0-2h-2v5H11V7a2 2 0 0 0-2-2H7v8a4 4 0 1 1-4-4V5Z" />
  </svg>
);

export default UpworkIcon;