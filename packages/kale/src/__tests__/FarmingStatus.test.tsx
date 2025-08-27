import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FarmingStatus } from '../components/FarmingStatus';
import { KaleFarmStatus } from '../types';

describe('FarmingStatus', () => {
  const mockStatus: KaleFarmStatus = {
    isActive: true,
    stakeAmount: '100.1234567',
    plantLedger: 1000,
    currentLedger: 1100,
    gap: 100,
    pendingRewards: '10.1234567',
    lastWorkHash: 'abc123',
    lastWorkLedger: 1050
  };

  it('should render loading state', () => {
    render(<FarmingStatus status={null} isLoading={true} />);

    expect(screen.getByText('🌾 Farming Status')).toBeInTheDocument();
  });

  it('should render inactive status', () => {
    render(<FarmingStatus status={null} isLoading={false} />);

    expect(screen.getByText('No farming data available')).toBeInTheDocument();
    expect(screen.getByText('Stake some KALE to start farming!')).toBeInTheDocument();
  });

  it('should render active farming status', () => {
    render(<FarmingStatus status={mockStatus} isLoading={false} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('100.1234567 KALE')).toBeInTheDocument();
    expect(screen.getByText('#1,100')).toBeInTheDocument();
    expect(screen.getByText('#1,000')).toBeInTheDocument();
    expect(screen.getByText('100 ledgers')).toBeInTheDocument();
    expect(screen.getByText('10.1234567 KALE')).toBeInTheDocument();
  });

  it('should render rewards available message', () => {
    render(<FarmingStatus status={mockStatus} isLoading={false} />);

    expect(screen.getByText('Rewards Available!')).toBeInTheDocument();
    expect(screen.getByText('Harvest your 10.1234567 KALE')).toBeInTheDocument();
  });

  it('should render last work information', () => {
    render(<FarmingStatus status={mockStatus} isLoading={false} />);

    expect(screen.getByText('Last Work')).toBeInTheDocument();
    expect(screen.getByText('abc123')).toBeInTheDocument();
    expect(screen.getByText('Ledger #1,050')).toBeInTheDocument();
  });

  it('should not render rewards message when no pending rewards', () => {
    const statusWithoutRewards = { ...mockStatus, pendingRewards: '0' };

    render(<FarmingStatus status={statusWithoutRewards} isLoading={false} />);

    expect(screen.queryByText('Rewards Available!')).not.toBeInTheDocument();
  });

  it('should not render last work section when no last work hash', () => {
    const statusWithoutWork = { ...mockStatus, lastWorkHash: undefined };

    render(<FarmingStatus status={statusWithoutWork} isLoading={false} />);

    expect(screen.queryByText('Last Work')).not.toBeInTheDocument();
  });
});
