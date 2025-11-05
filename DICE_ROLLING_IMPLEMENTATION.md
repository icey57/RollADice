# Dice Rolling Implementation

## Overview
This document describes the dice rolling functionality implemented in the Roll A Dice application, including judgment logic for multiple RPG rulesets.

## Features Implemented

### 1. Dice Rolling System
- **Multiple Die Types**: d4, d6, d8, d10, d12, d20, d100
- **Multiple Dice**: Roll 1-20 dice at once
- **Two Rulesets**: D&D and Call of Cthulhu (COC)
- **Target Values**: Optional target number for success/failure determination

### 2. Judgment Logic

#### Call of Cthulhu (COC)
- **Critical Success**: Rolls 1-5
- **Critical Failure**: Rolls 96-100
- **Success/Failure**: When target provided, roll ≤ target = success, roll > target = failure
- **Priority**: Critical results take precedence over target-based results

#### Dungeons & Dragons (D&D)
- **Critical Success**: Natural 20 (single die only)
- **Critical Failure**: Natural 1 (single die only)
- **Success/Failure**: When target provided, roll ≥ target = success, roll < target = failure
- **Priority**: Critical results take precedence over target-based results

### 3. Results Display
- **Individual Rolls**: Shows all die values for multiple dice
- **Total**: Displays sum when rolling multiple dice
- **Target Comparison**: Shows target and appropriate comparison operator (≥ for D&D, ≤ for COC)
- **Judgment Badge**: Color-coded with icon:
  - Critical Success: Green with ★
  - Success: Light green with ✓
  - Neutral: Gray with ●
  - Failure: Light red with ✗
  - Critical Failure: Red with ☠
- **History**: Reverse chronological order with timestamps
- **Sequence Numbers**: Each roll numbered in order

### 4. Visual Design
- **Color-Coded Results**:
  - Critical Success: `bg-green-900/30 border-green-600 text-green-400`
  - Success: `bg-green-800/20 border-green-700 text-green-300`
  - Failure: `bg-red-800/20 border-red-700 text-red-300`
  - Critical Failure: `bg-red-900/30 border-red-600 text-red-400`
  - Neutral: `bg-gray-800/20 border-gray-600 text-gray-300`
- **Responsive Layout**: Adapts to mobile and desktop views
- **Accessibility**: Proper ARIA labels, semantic HTML, high contrast

## Testing

### Test Coverage (47 tests)
1. **Dice Logic Tests** (26 tests)
   - Roll generation validation
   - Die type parsing
   - COC judgment edge cases (boundary values 1, 5, 6, 95, 96, 100)
   - DND judgment edge cases (natural 1, 20, multiple dice)
   - Target value comparisons for both rulesets
   - Priority of critical results over target-based results

2. **Judgment Display Tests** (6 tests)
   - Correct display configuration for each judgment type
   - Consistency of display structure

3. **ResultsPanel Component Tests** (15 tests)
   - Empty state rendering
   - Single and multiple roll display
   - Critical success/failure rendering
   - Multiple dice total display
   - Ruleset-specific target comparison
   - Sequence numbering
   - Timestamp display
   - Roll history count

### Edge Cases Tested
- COC boundary values (5/6 and 95/96)
- DND criticals with single vs. multiple dice
- Target value equality boundaries
- Multiple dice totaling to critical values in COC
- Rolls without target values

## File Structure

```
src/
├── types/
│   └── dice.ts                      # Type definitions
├── utils/
│   ├── diceLogic.ts                 # Core rolling and judgment logic
│   ├── diceLogic.test.ts            # Logic tests
│   ├── judgmentDisplay.ts           # Display configuration
│   └── judgmentDisplay.test.ts      # Display tests
├── components/
│   ├── ControlPanel.tsx             # Dice rolling controls
│   ├── ResultsPanel.tsx             # Results display
│   └── ResultsPanel.test.tsx        # Component tests
└── test/
    ├── setup.ts                     # Test setup
    └── vitest.d.ts                  # Type definitions
```

## Usage Example

### Rolling Dice
1. Select a ruleset (D&D or COC)
2. Choose die type (d4, d6, d8, d10, d12, d20, d100)
3. Set number of dice (1-20)
4. Optionally enter a target value
5. Click "Roll Dice 🎲"

### Interpreting Results
- Check the judgment badge for success/failure
- View individual die values
- See the total for multiple dice
- Compare against target if provided
- Review roll history with timestamps

## API Reference

### Types
```typescript
type Ruleset = 'COC' | 'DND';
type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
type JudgmentType = 'critical-success' | 'success' | 'failure' | 'critical-failure' | 'neutral';

interface DiceRoll {
  id: string;
  timestamp: number;
  ruleset: Ruleset;
  dieType: DieType;
  numberOfDice: number;
  rolls: number[];
  total: number;
  targetValue?: number;
  judgment: JudgmentType;
}
```

### Functions
```typescript
// Roll a single die with specified sides
function rollDie(sides: number): number

// Parse die type string to number
function parseDieType(dieType: DieType): number

// Calculate judgment based on rules
function calculateJudgment(
  rolls: number[],
  total: number,
  ruleset: Ruleset,
  targetValue?: number
): JudgmentType

// Perform a complete dice roll
function performDiceRoll(
  ruleset: Ruleset,
  dieType: DieType,
  numberOfDice: number,
  targetValue?: number
): DiceRoll

// Get display configuration for judgment
function getJudgmentDisplay(judgment: JudgmentType): JudgmentDisplayConfig
```

## Future Enhancements
- Save/export roll history
- Custom rulesets
- Roll modifiers (+/- bonuses)
- Advantage/disadvantage (D&D 5e)
- Roll statistics and analytics
- Dice notation parser (e.g., "2d6+3")
