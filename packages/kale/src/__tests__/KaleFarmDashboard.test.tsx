import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KaleFarmDashboard } from '../components/KaleFarmDashboard';
import { StellarWalletConnector } from '@stellar-wallet-connector/core';

// Mock do connector
const mockConnector = {
  isConnected: vi.fn().mockReturnValue(true),
  getPublicKey: vi.fn().mockReturnValue('GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
  getCurrentWallet: vi.fn().mockReturnValue({ name: 'Test Wallet' })
} as any;

describe('KaleFarmDashboard', () => {
  it('should render dashboard when connected', () => {
    render(<KaleFarmDashboard connector={mockConnector} network="testnet" />);

    expect(screen.getByText('🌱 KALE Farming Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Stake KALE, submit proof-of-work, and harvest rewards')).toBeInTheDocument();
  });

  it('should render connect message when not connected', () => {
    const disconnectedConnector = {
      ...mockConnector,
      isConnected: vi.fn().mockReturnValue(false)
    } as any;

    render(<KaleFarmDashboard connector={disconnectedConnector} network="testnet" />);

    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
    expect(screen.getByText('Please connect your Stellar wallet to start farming KALE')).toBeInTheDocument();
  });

  it('should render stake input component', () => {
    render(<KaleFarmDashboard connector={mockConnector} network="testnet" />);

    expect(screen.getByText('🌱 Stake KALE')).toBeInTheDocument();
  });

  it('should render hash input component', () => {
    render(<KaleFarmDashboard connector={mockConnector} network="testnet" />);

    expect(screen.getByText('⚡ Submit Proof-of-Work')).toBeInTheDocument();
  });

  it('should render farming status component', () => {
    render(<KaleFarmDashboard connector={mockConnector} network="testnet" />);

    expect(screen.getByText('🌾 Farming Status')).toBeInTheDocument();
  });

  it('should render harvest button component', () => {
    render(<KaleFarmDashboard connector={mockConnector} network="testnet" />);

    expect(screen.getByText('🌾 Harvest Rewards')).toBeInTheDocument();
  });

  it('should render reward predictor component', () => {
    render(<KaleFarmDashboard connector={mockConnector} network="testnet" />);

    expect(screen.getByText('🔮 Reward Predictor')).toBeInTheDocument();
  });
});
