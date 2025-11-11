import { RollResult } from '../types';
import { formatRollResult, getResultColor } from '../utils/dice';

interface ResultsPanelProps {
  currentResult: RollResult | null;
  allResults: RollResult[];
  onClearResults: () => void;
}

function ResultsPanel({
  currentResult,
  allResults,
  onClearResults,
}: ResultsPanelProps) {
  if (!currentResult) {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-blue-300">
          投掷结果
        </h2>
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
              d="M14 10h-3.5a1 1 0 00-1 1v3a1 1 0 001 1h3.5a1 1 0 001-1v-3a1 1 0 00-1-1z M10 3l2 1m3-1l2 1m3 3l1 2m-1 3l1 2m-7 7l-2 1m-3-1l-2 1m-3-3l-1 2m1-3l-1 2"
            />
          </svg>
          <p className="text-sm text-gray-500">还未投掷</p>
          <p className="text-xs text-gray-600 mt-1">
            点击「投掷骰子」开始
          </p>
        </div>
      </div>
    );
  }

  const isMultiRoll = currentResult.rolls.length > 1;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-blue-300">
          投掷结果
        </h2>
        {allResults.length > 0 && (
          <button
            onClick={onClearResults}
            className="text-xs px-2 py-1 bg-red-900 hover:bg-red-800 text-red-200 rounded transition-colors"
            aria-label="Clear all results"
          >
            清空
          </button>
        )}
      </div>

      <div className="space-y-4 border-b border-gray-700 pb-4">
        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">规则</span>
            <span className="font-semibold text-blue-300">
              {currentResult.rule} (d{currentResult.rule === 'COC' ? '100' : '20'})
            </span>
          </div>

          {isMultiRoll && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">投掷次数</span>
                <span className="font-semibold text-blue-300">
                  {currentResult.rolls.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">总和</span>
                <span className="font-semibold text-blue-300 text-lg">
                  {currentResult.sum}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">最高值</span>
                <span className="font-semibold text-green-400">
                  {currentResult.max}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">最低值</span>
                <span className="font-semibold text-orange-400">
                  {currentResult.min}
                </span>
              </div>
            </>
          )}

          {currentResult.targetValue !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">目标值</span>
              <span className="font-semibold text-yellow-400">
                {currentResult.targetValue}
              </span>
            </div>
          )}

          <div className="border-t border-gray-600 pt-3 mt-3">
            <span className="text-sm text-gray-400 block mb-2">结果</span>
            <div className="space-y-1">
              {isMultiRoll ? (
                currentResult.rolls.map((roll: number, index: number) => {
                  const resultType = currentResult.results[index];
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-gray-600 rounded text-sm"
                    >
                      <span>第 {index + 1} 次</span>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold"
                          style={{
                            color: getResultColor(resultType),
                          }}
                        >
                          {roll}
                        </span>
                        {currentResult.targetValue !== undefined && (
                          <span
                            className="text-xs font-semibold px-2 py-1 rounded"
                            style={{
                              backgroundColor: getResultColor(resultType) + '40',
                              color: getResultColor(resultType),
                            }}
                          >
                            {formatRollResult(resultType)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-between px-3 py-3 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg">
                  <span className="text-lg font-semibold">骰子点数</span>
                  <span
                    className="text-3xl font-bold"
                    style={{
                      color: getResultColor(currentResult.results[0]),
                    }}
                  >
                    {currentResult.rolls[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {currentResult.targetValue !== undefined && isMultiRoll && (
            <div className="border-t border-gray-600 pt-3 mt-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1 text-center">
                  <div className="text-gray-400">成功</div>
                  <div className="text-lg font-bold text-green-400">
                    {currentResult.results.filter(
                      (r: string) => r === 'success' || r === 'critical-success'
                    ).length}
                  </div>
                </div>
                <div className="w-px h-10 bg-gray-600" />
                <div className="flex-1 text-center">
                  <div className="text-gray-400">失败</div>
                  <div className="text-lg font-bold text-red-400">
                    {currentResult.results.filter(
                      (r: string) => r === 'failure' || r === 'critical-failure'
                    ).length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentResult.targetValue === undefined && (
            <div className="border-t border-gray-600 pt-3 mt-3">
              <div
                className="px-3 py-2 rounded text-center font-semibold"
                style={{
                  backgroundColor: getResultColor(currentResult.results[0]) + '30',
                  color: getResultColor(currentResult.results[0]),
                }}
              >
                {formatRollResult(currentResult.results[0])}
              </div>
            </div>
          )}
        </div>
      </div>

      {allResults.length > 1 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">历史记录</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {allResults.map((result, index) => (
              <div
                key={index}
                className="p-2 bg-gray-700 rounded text-xs text-gray-300 flex items-center justify-between"
              >
                <span>
                  第 {index + 1}: {result.rule} {result.rolls.join(',')}
                  {result.rolls.length > 1 && ` (和: ${result.sum})`}
                </span>
                <span className="text-gray-500">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
