# 3D Dice Viewer

A 3D dice rolling application with support for Call of Cthulhu (COC) and Dungeons & Dragons (DND) rulesets.

## State Management

The application uses Zustand for centralized state management. The store is located in `src/store/diceStore.ts`.

### Store Features

- **Configuration Management**: Track active ruleset (COC/DND), dice skin, dice type, roll count, and target value
- **Roll Management**: Handle pending rolls and record results with judgment logic
- **History Tracking**: Maintain roll history with statistics (total rolls, success/failure counts)
- **Animation Control**: Toggle animation skip functionality

### Usage

```typescript
import { useDiceStore } from './store';

function MyComponent() {
  const { config, history, setRuleset, triggerRoll } = useDiceStore();
  
  // Update configuration
  setRuleset('DND');
  
  // Trigger a roll
  triggerRoll();
  
  return <div>...</div>;
}
```

### Judgment Logic

#### Call of Cthulhu (COC)
- **Critical Success**: Roll of 1
- **Extreme Success**: Roll ≤ targetValue / 5
- **Hard Success**: Roll ≤ targetValue / 2
- **Success**: Roll ≤ targetValue
- **Critical Failure**: Roll of 100, or ≥ 96 when failed
- **Failure**: Roll > targetValue

#### Dungeons & Dragons (DND)
- **Critical Success**: Roll equals maximum dice value
- **Critical Failure**: Roll of 1
- **Success**: Roll ≥ targetValue
- **Failure**: Roll < targetValue

## Development

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Testing

The project includes comprehensive unit tests for:
- Judgment logic boundary conditions (COC and DND)
- Store state management
- Roll recording and history tracking

All tests are written with Vitest and can be run with `npm test`.
