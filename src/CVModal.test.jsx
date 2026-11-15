import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import CVModal from './CVModal';

afterEach(() => cleanup());

describe('CVModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<CVModal isOpen={false} onClose={() => {}} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows name, both emails, download and print when open', () => {
    render(<CVModal isOpen onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('George Moses Azuoru')).toBeDefined();
    expect(screen.getByText('azuorugeorge@gmail.com')).toBeDefined();
    expect(screen.getByText('hello@emberfig.com')).toBeDefined();
    expect(screen.getByText('Download')).toBeDefined();
    expect(screen.getByText('Print')).toBeDefined();
  });

  it('close button and Escape both call onClose', () => {
    const onClose = vi.fn();
    render(<CVModal isOpen onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('unmounts after the exit transition', async () => {
    const { rerender, container } = render(<CVModal isOpen onClose={() => {}} />);
    rerender(<CVModal isOpen={false} onClose={() => {}} />);
    await waitFor(() => expect(container.innerHTML).toBe(''));
  });
});
