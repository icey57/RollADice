import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultsPanel from './ResultsPanel';
import type { DiceRoll } from '../types/dice';

describe('ResultsPanel', () => {
  const mockRoll: DiceRoll = {
    id: 'test-1',
    timestamp: Date.now(),
    ruleset: 'DND',
    dieType: 'd20',
    numberOfDice: 1,
    rolls: [15],
    total: 15,
    targetValue: 10,
    judgment: 'success',
  };

  const mockCriticalSuccessRoll: DiceRoll = {
    id: 'test-2',
    timestamp: Date.now(),
    ruleset: 'DND',
    dieType: 'd20',
    numberOfDice: 1,
    rolls: [20],
    total: 20,
    targetValue: 15,
    judgment: 'critical-success',
  };

  const mockCriticalFailureRoll: DiceRoll = {
    id: 'test-3',
    timestamp: Date.now(),
    ruleset: 'DND',
    dieType: 'd20',
    numberOfDice: 1,
    rolls: [1],
    total: 1,
    targetValue: 15,
    judgment: 'critical-failure',
  };

  const mockMultipleDiceRoll: DiceRoll = {
    id: 'test-4',
    timestamp: Date.now(),
    ruleset: 'DND',
    dieType: 'd6',
    numberOfDice: 3,
    rolls: [4, 5, 3],
    total: 12,
    targetValue: 10,
    judgment: 'success',
  };

  const mockCOCRoll: DiceRoll = {
    id: 'test-5',
    timestamp: Date.now(),
    ruleset: 'COC',
    dieType: 'd100',
    numberOfDice: 1,
    rolls: [45],
    total: 45,
    targetValue: 50,
    judgment: 'success',
  };

  it('should render empty state when no rolls', () => {
    render(<ResultsPanel diceRolls={[]} />);
    
    expect(screen.getByText('No rolls yet')).toBeInTheDocument();
    expect(screen.getByText('Roll some dice to see results')).toBeInTheDocument();
  });

  it('should display a single roll correctly', () => {
    render(<ResultsPanel diceRolls={[mockRoll]} />);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('DND')).toBeInTheDocument();
    expect(screen.getByText('1d20: 15')).toBeInTheDocument();
    expect(screen.getByText(/≥.*10/)).toBeInTheDocument();
  });

  it('should display critical success correctly', () => {
    render(<ResultsPanel diceRolls={[mockCriticalSuccessRoll]} />);
    
    expect(screen.getByText('Critical Success')).toBeInTheDocument();
    expect(screen.getByText('1d20: 20')).toBeInTheDocument();
  });

  it('should display critical failure correctly', () => {
    render(<ResultsPanel diceRolls={[mockCriticalFailureRoll]} />);
    
    expect(screen.getByText('Critical Failure')).toBeInTheDocument();
    expect(screen.getByText('1d20: 1')).toBeInTheDocument();
  });

  it('should display multiple dice roll with total', () => {
    render(<ResultsPanel diceRolls={[mockMultipleDiceRoll]} />);
    
    expect(screen.getByText('3d6: [4, 5, 3]')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('should display COC ruleset with correct target comparison', () => {
    render(<ResultsPanel diceRolls={[mockCOCRoll]} />);
    
    expect(screen.getByText('COC')).toBeInTheDocument();
    expect(screen.getByText(/≤.*50/)).toBeInTheDocument();
  });

  it('should display multiple rolls in reverse order', () => {
    const roll1: DiceRoll = { ...mockRoll, id: 'roll-1', rolls: [10], total: 10 };
    const roll2: DiceRoll = { ...mockRoll, id: 'roll-2', rolls: [15], total: 15 };
    const roll3: DiceRoll = { ...mockRoll, id: 'roll-3', rolls: [20], total: 20 };
    
    render(<ResultsPanel diceRolls={[roll1, roll2, roll3]} />);
    
    const rollElements = screen.getAllByText('DND');
    expect(rollElements).toHaveLength(3);
    
    expect(screen.getByText('3 rolls in history')).toBeInTheDocument();
  });

  it('should display sequence numbers correctly', () => {
    const roll1: DiceRoll = { ...mockRoll, id: 'roll-1' };
    const roll2: DiceRoll = { ...mockRoll, id: 'roll-2' };
    
    render(<ResultsPanel diceRolls={[roll1, roll2]} />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should not display total for single die roll', () => {
    render(<ResultsPanel diceRolls={[mockRoll]} />);
    
    const totalLabels = screen.queryAllByText('Total:');
    expect(totalLabels).toHaveLength(0);
  });

  it('should display total for multiple dice roll', () => {
    render(<ResultsPanel diceRolls={[mockMultipleDiceRoll]} />);
    
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('should not display target when not provided', () => {
    const rollNoTarget: DiceRoll = { ...mockRoll, targetValue: undefined };
    render(<ResultsPanel diceRolls={[rollNoTarget]} />);
    
    expect(screen.queryByText('Target:')).not.toBeInTheDocument();
  });

  it('should display target when provided', () => {
    render(<ResultsPanel diceRolls={[mockRoll]} />);
    
    expect(screen.getByText('Target:')).toBeInTheDocument();
  });

  it('should display timestamp', () => {
    render(<ResultsPanel diceRolls={[mockRoll]} />);
    
    const timestamp = new Date(mockRoll.timestamp).toLocaleTimeString();
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });

  it('should display roll count correctly', () => {
    const { rerender } = render(<ResultsPanel diceRolls={[mockRoll]} />);
    expect(screen.getByText('1 roll in history')).toBeInTheDocument();
    
    rerender(<ResultsPanel diceRolls={[mockRoll, mockCriticalSuccessRoll]} />);
    expect(screen.getByText('2 rolls in history')).toBeInTheDocument();
  });

  it('should handle neutral judgment', () => {
    const neutralRoll: DiceRoll = {
      ...mockRoll,
      targetValue: undefined,
      judgment: 'neutral',
    };
    
    render(<ResultsPanel diceRolls={[neutralRoll]} />);
    
    expect(screen.getByText('Roll')).toBeInTheDocument();
  });
});
