import { useState } from 'react';
import { Rule, RollResult, DiceSkin } from './types';
import ControlPanel from './components/ControlPanel';
import Canvas3D from './components/Canvas3D';
import ResultsPanel from './components/ResultsPanel';
import { DEFAULT_SKINS } from './utils/skins';

function App() {
  const [rule, setRule] = useState<Rule>('COC');
  const [numberOfRolls, setNumberOfRolls] = useState(1);
  const [targetValue, setTargetValue] = useState<number | undefined>(undefined);
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [customSkins, setCustomSkins] = useState<DiceSkin[]>([]);
  const [currentSkinId, setCurrentSkinId] = useState('bronze');
  const [allResults, setAllResults] = useState<RollResult[]>([]);

  const handleRoll = (result: RollResult) => {
    setCurrentResult(result);
    setAllResults((prev) => [...prev, result]);
  };

  const handleAddCustomSkin = (skin: DiceSkin) => {
    setCustomSkins((prev) => [...prev, skin]);
  };

  const handleClearResults = () => {
    setAllResults([]);
    setCurrentResult(null);
  };

  const getAllSkins = (): DiceSkin[] => {
    return [...DEFAULT_SKINS, ...customSkins];
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white overflow-hidden">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold text-blue-400">
          掷骰子程序
        </h1>
      </header>

      <main className="h-[calc(100vh-56px)] flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto shrink-0">
          <ControlPanel
            rule={rule}
            numberOfRolls={numberOfRolls}
            targetValue={targetValue}
            currentSkinId={currentSkinId}
            skins={getAllSkins()}
            isRolling={isRolling}
            onRuleChange={setRule}
            onNumberOfRollsChange={setNumberOfRolls}
            onTargetValueChange={setTargetValue}
            onSkinChange={setCurrentSkinId}
            onRoll={handleRoll}
            onAddCustomSkin={handleAddCustomSkin}
            onRollingStart={() => setIsRolling(true)}
            onRollingEnd={() => setIsRolling(false)}
          />
        </aside>

        <section 
          className="flex-1 min-h-[300px] lg:min-h-0 bg-gray-900"
          role="main"
          aria-label="3D Dice Canvas"
        >
          <Canvas3D
            rule={rule}
            numberOfRolls={numberOfRolls}
            targetValue={targetValue}
            currentSkinId={currentSkinId}
            skins={getAllSkins()}
            isRolling={isRolling}
            onRoll={handleRoll}
            onRollingEnd={() => setIsRolling(false)}
          />
        </section>

        <aside className="w-full lg:w-80 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 overflow-y-auto shrink-0">
          <ResultsPanel
            currentResult={currentResult}
            allResults={allResults}
            onClearResults={handleClearResults}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
