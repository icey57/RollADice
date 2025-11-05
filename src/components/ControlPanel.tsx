import { useState } from 'react';

interface ControlPanelProps {
  backgroundColor: string;
  objectColor: string;
  rotationSpeed: number;
  textureUrl: string;
  onBackgroundColorChange: (color: string) => void;
  onObjectColorChange: (color: string) => void;
  onRotationSpeedChange: (speed: number) => void;
  onTextureUrlChange: (url: string) => void;
  onAddResult: (result: string) => void;
  diceType: 'd20' | 'd100';
  rollCount: number;
  skipAnimation: boolean;
  onDiceTypeChange: (type: 'd20' | 'd100') => void;
  onRollCountChange: (count: number) => void;
  onSkipAnimationChange: (skip: boolean) => void;
  onRoll: () => void;
}

function ControlPanel({
  backgroundColor,
  objectColor,
  rotationSpeed,
  textureUrl,
  onBackgroundColorChange,
  onObjectColorChange,
  onRotationSpeedChange,
  onTextureUrlChange,
  onAddResult,
  diceType,
  rollCount,
  skipAnimation,
  onDiceTypeChange,
  onRollCountChange,
  onSkipAnimationChange,
  onRoll,
}: ControlPanelProps) {
  const [tempTextureUrl, setTempTextureUrl] = useState(textureUrl);

  const handleApplyTexture = () => {
    onTextureUrlChange(tempTextureUrl);
    onAddResult(`Texture applied: ${tempTextureUrl || 'None'}`);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-blue-300 mb-4">
        Dice Controls
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dice Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onDiceTypeChange('d20')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                diceType === 'd20'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label="Select d20"
            >
              D20
            </button>
            <button
              onClick={() => onDiceTypeChange('d100')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                diceType === 'd100'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              aria-label="Select d100"
            >
              D100
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="rollCount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Number of Dice: {rollCount}
          </label>
          <input
            id="rollCount"
            type="range"
            min="1"
            max="5"
            step="1"
            value={rollCount}
            onChange={(e) => onRollCountChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            aria-label="Select number of dice"
          />
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={skipAnimation}
              onChange={(e) => onSkipAnimationChange(e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Skip animation"
            />
            <span className="text-sm font-medium text-gray-300">
              Skip Animation
            </span>
          </label>
        </div>

        <button
          onClick={onRoll}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-label="Roll dice"
        >
          🎲 Roll Dice
        </button>
      </div>

      <div className="pt-6 border-t border-gray-700">
        <h3 className="text-md font-semibold text-gray-400 mb-4">
          Visual Settings
        </h3>
        <div className="space-y-4">
        <div>
          <label 
            htmlFor="bgColor" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Background Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="bgColor"
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="h-10 w-16 rounded cursor-pointer border-2 border-gray-600 bg-gray-700"
              aria-label="Select background color"
            />
            <span className="text-sm text-gray-400 font-mono">
              {backgroundColor}
            </span>
          </div>
        </div>

        <div>
          <label 
            htmlFor="objColor" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Object Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="objColor"
              type="color"
              value={objectColor}
              onChange={(e) => onObjectColorChange(e.target.value)}
              className="h-10 w-16 rounded cursor-pointer border-2 border-gray-600 bg-gray-700"
              aria-label="Select object color"
            />
            <span className="text-sm text-gray-400 font-mono">
              {objectColor}
            </span>
          </div>
        </div>

        <div>
          <label 
            htmlFor="rotSpeed" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Rotation Speed: {rotationSpeed.toFixed(1)}x
          </label>
          <input
            id="rotSpeed"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={rotationSpeed}
            onChange={(e) => onRotationSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            aria-label="Adjust rotation speed"
          />
        </div>

        <div>
          <label 
            htmlFor="textureUrl" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Texture URL
          </label>
          <div className="space-y-2">
            <input
              id="textureUrl"
              type="text"
              value={tempTextureUrl}
              onChange={(e) => setTempTextureUrl(e.target.value)}
              placeholder="https://example.com/texture.jpg"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Enter texture URL"
            />
            <button
              onClick={handleApplyTexture}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Apply texture"
            >
              Apply Texture
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
