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
}: ControlPanelProps) {
  const [tempTextureUrl, setTempTextureUrl] = useState(textureUrl);

  const handleApplyTexture = () => {
    onTextureUrlChange(tempTextureUrl);
    onAddResult(`Texture applied: ${tempTextureUrl || 'None'}`);
  };

  const handleRandomize = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    onObjectColorChange(randomColor);
    onAddResult(`Randomized object color: ${randomColor}`);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-blue-300 mb-4">
        Controls
      </h2>

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

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={handleRandomize}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Randomize object color"
          >
            Randomize Color
          </button>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
