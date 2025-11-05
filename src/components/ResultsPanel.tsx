import type { DiceRoll } from '../types/dice';
import { getJudgmentDisplay } from '../utils/judgmentDisplay';

interface ResultsPanelProps {
  diceRolls: DiceRoll[];
}

function ResultsPanel({ diceRolls }: ResultsPanelProps) {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatRollDetails = (roll: DiceRoll) => {
    const diceStr = roll.rolls.length === 1 
      ? `${roll.rolls[0]}` 
      : `[${roll.rolls.join(', ')}]`;
    
    return `${roll.numberOfDice}${roll.dieType}: ${diceStr}`;
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-blue-300 mb-4">
        Roll Results
      </h2>

      {diceRolls.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">No rolls yet</p>
          <p className="text-xs text-gray-600 mt-1">
            Roll some dice to see results
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="log" aria-label="Dice roll history">
          {[...diceRolls].reverse().map((roll, index) => {
            const display = getJudgmentDisplay(roll.judgment);
            const sequenceNumber = diceRolls.length - index;
            
            return (
              <li
                key={roll.id}
                className={`p-3 ${display.bgColor} border ${display.borderColor} rounded-md text-sm transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                      {sequenceNumber}
                    </span>
                    <span className="text-xs text-gray-400 uppercase font-medium">
                      {roll.ruleset}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${display.color} flex items-center space-x-1`}>
                    <span className="text-base" aria-hidden="true">{display.icon}</span>
                    <span>{display.label}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-gray-400 text-xs">Roll:</span>
                    <span className="text-white font-medium">
                      {formatRollDetails(roll)}
                    </span>
                  </div>

                  {roll.rolls.length > 1 && (
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-400 text-xs">Total:</span>
                      <span className="text-white font-bold text-lg">
                        {roll.total}
                      </span>
                    </div>
                  )}

                  {roll.targetValue !== undefined && (
                    <div className="flex items-baseline justify-between">
                      <span className="text-gray-400 text-xs">Target:</span>
                      <span className="text-gray-300 font-medium">
                        {roll.ruleset === 'DND' ? '≥ ' : '≤ '}{roll.targetValue}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-500 border-t border-gray-700 pt-2">
                  {formatTimestamp(roll.timestamp)}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {diceRolls.length > 0 && (
        <div className="pt-4 text-center border-t border-gray-700">
          <p className="text-xs text-gray-500">
            {diceRolls.length} {diceRolls.length === 1 ? 'roll' : 'rolls'} in history
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
