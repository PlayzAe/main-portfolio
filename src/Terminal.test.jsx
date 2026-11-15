import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Terminal, { runCommand } from './Terminal';

afterEach(() => cleanup());

describe('Terminal', () => {
  it('prints help on mount without stealing focus', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal command');
    expect(document.activeElement).not.toBe(input);
    expect(screen.getAllByText('projects').length).toBeGreaterThan(0);
  });

  it('runs a typed command', async () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal command');
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(await screen.findByText(/George Moses Azuoru, @playzae/)).toBeDefined();
  });

  it('clear empties the screen', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal command');
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.queryByText(/Type help/)).toBeNull();
  });

  it('parser handles empty, casing, $ prefix and unknown commands', () => {
    expect(runCommand('').lines).toEqual([]);
    expect(runCommand('   ').lines).toEqual([]);
    expect(runCommand('$HELP').lines.length).toBeGreaterThan(0);
    expect(runCommand('nope').lines[0]).toMatch(/command not found/);
    expect(runCommand('open arena').open).toMatch(/arena\.ai-desktop/);
    expect(runCommand('snake').game).toBe('snake');
  });
});
