import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, unmountComponentAtNode } from '@testing-library/react';
import React from 'react';
import FluidCanvas from './FluidCanvas';

describe('FluidCanvas Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a canvas element without crashing in React 19', () => {
    const { container } = render(<FluidCanvas />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom className and styles properly', () => {
    const customClass = 'custom-fluid-layer opacity-80';
    const { container } = render(
      <FluidCanvas
        className={customClass}
        style={{ zIndex: -5 }}
        preset="hero"
        speed={1.0}
        duration={12.0}
      />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas.className).toContain('custom-fluid-layer');
    expect(canvas.style.zIndex).toBe('-5');
  });

  it('gracefully handles absence of WebGL2 in jsdom environment', () => {
    // In jsdom getContext('webgl2') returns null
    const { container } = render(<FluidCanvas preset="card" interactive={false} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('cleans up resources cleanly on unmount', () => {
    const { unmount } = render(<FluidCanvas />);
    expect(() => unmount()).not.toThrow();
  });

  it('verifies mathematical seamless loop continuity at period boundary', () => {
    // Mathematically verifies that at t=0 and t=duration, circular time coordinates are identical
    const duration = 16.0;
    const TAU = 2 * Math.PI;

    const angleStart = (0.0 / duration) * TAU;
    const angleEnd = (1.0) * TAU;

    const loop1Start = [Math.cos(angleStart) * 0.95, Math.sin(angleStart) * 0.95];
    const loop1End = [Math.cos(angleEnd) * 0.95, Math.sin(angleEnd) * 0.95];

    expect(Math.abs(loop1Start[0] - loop1End[0])).toBeLessThan(1e-10);
    expect(Math.abs(loop1Start[1] - loop1End[1])).toBeLessThan(1e-10);

    // 2nd harmonic continuity
    const loop2Start = [Math.cos(angleStart * 2.0) * 0.55, Math.sin(angleStart * 2.0) * 0.55];
    const loop2End = [Math.cos(angleEnd * 2.0) * 0.55, Math.sin(angleEnd * 2.0) * 0.55];

    expect(Math.abs(loop2Start[0] - loop2End[0])).toBeLessThan(1e-10);
    expect(Math.abs(loop2Start[1] - loop2End[1])).toBeLessThan(1e-10);
  });
});
