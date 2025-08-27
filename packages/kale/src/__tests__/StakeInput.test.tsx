import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StakeInput } from '../components/StakeInput';

describe('StakeInput', () => {
  const mockOnStake = vi.fn();

  beforeEach(() => {
    mockOnStake.mockClear();
  });

  it('should render stake input form', () => {
    render(<StakeInput onStake={mockOnStake} />);

    expect(screen.getByText('🌱 Stake KALE')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount to Stake')).toBeInTheDocument();
    expect(screen.getByText('Stake KALE')).toBeInTheDocument();
  });

  it('should handle input change', () => {
    render(<StakeInput onStake={mockOnStake} />);

    const input = screen.getByLabelText('Amount to Stake');
    fireEvent.change(input, { target: { value: '100.1234567' } });

    expect(input).toHaveValue('100.1234567');
  });

  it('should call onStake when form is submitted', async () => {
    mockOnStake.mockResolvedValue(undefined);

    render(<StakeInput onStake={mockOnStake} />);

    const input = screen.getByLabelText('Amount to Stake');
    const button = screen.getByText('Stake KALE');

    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnStake).toHaveBeenCalledWith('100');
    });
  });

  it('should disable input and button when disabled prop is true', () => {
    render(<StakeInput onStake={mockOnStake} disabled={true} />);

    const input = screen.getByLabelText('Amount to Stake');
    const button = screen.getByText('Stake KALE');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should show loading state when submitting', async () => {
    mockOnStake.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<StakeInput onStake={mockOnStake} />);

    const input = screen.getByLabelText('Amount to Stake');
    const button = screen.getByText('Stake KALE');

    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(button);

    expect(screen.getByText('Staking...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(mockOnStake).toHaveBeenCalledWith('100');
    });
  });

  it('should disable button when input is empty', () => {
    render(<StakeInput onStake={mockOnStake} />);

    const button = screen.getByText('Stake KALE');
    expect(button).toBeDisabled();
  });

  it('should clear input after successful stake', async () => {
    mockOnStake.mockResolvedValue(undefined);

    render(<StakeInput onStake={mockOnStake} />);

    const input = screen.getByLabelText('Amount to Stake');
    const button = screen.getByText('Stake KALE');

    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});
