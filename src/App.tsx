import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import Canvas3D from './components/Canvas3D';
import ResultsPanel from './components/ResultsPanel';
import type { DiceRoll } from './types/dice';

function App() {
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [objectColor, setObjectColor] = useState('#0f4c75');
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [textureUrl, setTextureUrl] = useState('');
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);

  const addDiceRoll = (roll: DiceRoll) => {
    setDiceRolls((prev) => [...prev, roll]);
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white overflow-hidden">
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold text-blue-400">
          Roll A Dice - RPG Dice Roller
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
            onAddDiceRoll={addDiceRoll}
          />
        </aside>

        <section 
          className="flex-1 min-h-[300px] lg:min-h-0 bg-gray-900"
          role="main"
          aria-label="3D Canvas View"
        >
          <Canvas3D
            backgroundColor={backgroundColor}
            objectColor={objectColor}
            rotationSpeed={rotationSpeed}
            textureUrl={textureUrl}
          />
        </section>

        <aside className="w-full lg:w-80 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 overflow-y-auto shrink-0">
          <ResultsPanel diceRolls={diceRolls} />
        </aside>
      </main>
    </div>
  );
}

export default App;
