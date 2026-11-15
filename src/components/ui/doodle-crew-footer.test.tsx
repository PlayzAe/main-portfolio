import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import DoodleCrewFooter from './doodle-crew-footer';

describe('DoodleCrewFooter Component', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders with default EMBERFIG wordmark and contains overflow-hidden classes', () => {
    const { container } = render(<DoodleCrewFooter id="contact" />);
    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer?.className).toContain('max-w-full');
    expect(footer?.className).toContain('overflow-hidden');
    expect(footer?.getAttribute('id')).toBe('contact');

    // SR title
    const heading = container.querySelector('h2.dcf-sr');
    expect(heading?.textContent).toBe('EMBERFIG');
  });

  it('supports custom wordmark GEORGE and distributes crew members', () => {
    const { container } = render(<DoodleCrewFooter wordmark="GEORGE" />);
    const heading = container.querySelector('h2.dcf-sr');
    expect(heading?.textContent).toBe('GEORGE');

    // Crew hit buttons exist for interactive poking
    const hitButtons = container.querySelectorAll('.dcf-hit');
    expect(hitButtons.length).toBeGreaterThanOrEqual(6);
  });

  it('verifies all required links point to George Moses Azuoru destinations', () => {
    const { container } = render(<DoodleCrewFooter />);

    // 1. GitHub: https://github.com/playzae
    const githubLinks = container.querySelectorAll('a[href="https://github.com/playzae"]');
    expect(githubLinks.length).toBeGreaterThan(0);

    // 2. Emberfig: https://emberfig.com
    const emberfigLinks = container.querySelectorAll('a[href="https://emberfig.com"]');
    expect(emberfigLinks.length).toBeGreaterThan(0);

    // 3. Quilore: https://quilore.com
    const quiloreLinks = container.querySelectorAll('a[href="https://quilore.com"]');
    expect(quiloreLinks.length).toBeGreaterThan(0);

    // 4. arena.ai-desktop: https://github.com/PlayzAe/arena.ai-desktop
    const arenaLinks = container.querySelectorAll('a[href="https://github.com/PlayzAe/arena.ai-desktop"]');
    expect(arenaLinks.length).toBeGreaterThan(0);

    // 5. Email: mailto:hello@emberfig.com
    const emailLinks = container.querySelectorAll('a[href="mailto:hello@emberfig.com"]');
    expect(emailLinks.length).toBeGreaterThan(0);
  });

  it('triggers interactive speech bubble when character is clicked', () => {
    const { container } = render(<DoodleCrewFooter />);
    const hitButtons = container.querySelectorAll('.dcf-hit');
    expect(hitButtons.length).toBeGreaterThan(0);

    // Click Bruno (first crew member)
    fireEvent.click(hitButtons[0]);
    const bubble = container.querySelector('.dcf-bubble');
    expect(bubble).toBeTruthy();
    expect(bubble?.textContent).toBe('Software that refuses to break.');
  });
});
