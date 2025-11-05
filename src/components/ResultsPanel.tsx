interface ResultsPanelProps {
  results: string[];
}

function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-blue-300 mb-4">
        Activity Log
      </h2>

      {results.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">No activity yet</p>
          <p className="text-xs text-gray-600 mt-1">Actions will appear here</p>
        </div>
      ) : (
        <ul className="space-y-2" role="log" aria-label="Activity log">
          {results.map((result, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-650 transition-colors"
            >
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                  {results.length - index}
                </span>
                <span className="flex-1 break-words">{result}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="pt-4 text-center">
          <p className="text-xs text-gray-500">
            {results.length} {results.length === 1 ? 'action' : 'actions'}{' '}
            recorded
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
