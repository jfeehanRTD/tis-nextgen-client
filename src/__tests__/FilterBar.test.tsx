import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '@/components/FilterBar';

describe('FilterBar', () => {
  const defaultProps = {
    showBuses: true,
    showTrains: true,
    onToggleBuses: vi.fn(),
    onToggleTrains: vi.fn(),
    busCount: 42,
    trainCount: 8,
    totalCount: 50,
  };

  it('renders bus and train toggle buttons', () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByRole('button', { name: /buses/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /trains/i })).toBeInTheDocument();
  });

  it('displays vehicle counts', () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('calls onToggleBuses when bus button clicked', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /buses/i }));

    expect(defaultProps.onToggleBuses).toHaveBeenCalled();
  });

  it('calls onToggleTrains when train button clicked', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /trains/i }));

    expect(defaultProps.onToggleTrains).toHaveBeenCalled();
  });

  it('shows active state when filter is on', () => {
    render(<FilterBar {...defaultProps} showBuses={true} showTrains={false} />);

    const busBtn = screen.getByRole('button', { name: /buses/i });
    const trainBtn = screen.getByRole('button', { name: /trains/i });

    expect(busBtn).toHaveClass('bg-orange-500');
    expect(trainBtn).toHaveClass('bg-gray-300');
  });

  it('shows total count', () => {
    render(<FilterBar {...defaultProps} />);

    expect(screen.getByText(/50 vehicles/i)).toBeInTheDocument();
  });
});
