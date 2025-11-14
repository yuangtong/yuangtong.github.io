import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { useScrollReveal } from '../useScrollReveal';

function TestComponent() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  return (
    <div>
      <div ref={ref} data-testid="reveal" className={isVisible ? 'visible' : 'hidden'}>Item</div>
    </div>
  );
}

describe('useScrollReveal', () => {
  it('marca el elemento visible cuando se simula intersección', async () => {
    const { getByTestId } = render(<TestComponent />);
    const el = getByTestId('reveal');
    expect(el).toHaveClass('hidden');
    // @ts-ignore
    global.__triggerIntersection__();
    expect(el).toHaveClass('visible');
  });
});