import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import DiceCanvas from './components/DiceCanvas';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [objectColor, setObjectColor] = useState('#0f4c75');
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [textureUrl, setTextureUrl] = useState('');
  const [results, setResults] = useState<string[]>([]);
  
  const [diceType, setDiceType] = useState<'d20' | 'd100'>('d20');
  const [rollCount, setRollCount] = useState(1);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [triggerRoll, setTriggerRoll] = useState(false);

  const addResult = (result: string) => {
    setResults((prev) => [...prev, result]);
  };

  const handleRoll = () => {
    setTriggerRoll(true);
  };

  const handleRollStart = () => {
    setTriggerRoll(false);
  };

  const handleRollComplete = (rollResults: number[]) => {
    const resultStr = rollResults.length === 1
      ? `Rolled ${diceType}: ${rollResults[0]}`
      : `Rolled ${rollResults.length}x ${diceType}: [${rollResults.join(', ')}] (Total: ${rollResults.reduce((a, b) => a + b, 0)})`;
    addResult(resultStr);
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white overflow-hidden">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold text-blue-400">
          3D Dice Roller
        </h1>
      </header>

      <main className="h-[calc(100vh-56px)] flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto shrink-0">
          <ControlPanel
            backgroundColor={backgroundColor}
            objectColor={objectColor}
            rotationSpeed={rotationSpeed}
            textureUrl={textureUrl}
            onBackgroundColorChange={setBackgroundColor}
            onObjectColorChange={setObjectColor}
            onRotationSpeedChange={setRotationSpeed}
            onTextureUrlChange={setTextureUrl}
            onAddResult={addResult}
            diceType={diceType}
            rollCount={rollCount}
            skipAnimation={skipAnimation}
            onDiceTypeChange={setDiceType}
            onRollCountChange={setRollCount}
            onSkipAnimationChange={setSkipAnimation}
            onRoll={handleRoll}
          />
        </aside>

        <section 
          className="flex-1 min-h-[300px] lg:min-h-0 bg-gray-900"
          role="main"
          aria-label="3D Canvas View"
        >
          <DiceCanvas
            diceType={diceType}
            rollCount={rollCount}
            skipAnimation={skipAnimation}
            onRollComplete={handleRollComplete}
            triggerRoll={triggerRoll}
            onRollStart={handleRollStart}
          />
        </section>

        <aside className="w-full lg:w-80 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 overflow-y-auto shrink-0">
          <ResultsPanel results={results} />
        </aside>
      </main>
    </div>
  );
}

export default App;
