import { useState } from 'react';
import { Rule, RollResult, DiceSkin } from '../types';
import { rollMultipleTimes } from '../utils/dice';
import { addCustomSkin, validateImageFile } from '../utils/skins';

interface ControlPanelProps {
  rule: Rule;
  numberOfRolls: number;
  targetValue: number | undefined;
  currentSkinId: string;
  skins: DiceSkin[];
  isRolling: boolean;
  onRuleChange: (rule: Rule) => void;
  onNumberOfRollsChange: (count: number) => void;
  onTargetValueChange: (value: number | undefined) => void;
  onSkinChange: (skinId: string) => void;
  onRoll: (result: RollResult) => void;
  onAddCustomSkin: (skin: DiceSkin) => void;
  onRollingStart: () => void;
  onRollingEnd: () => void;
}

function ControlPanel({
  rule,
  numberOfRolls,
  targetValue,
  currentSkinId,
  skins,
  isRolling,
  onRuleChange,
  onNumberOfRollsChange,
  onTargetValueChange,
  onSkinChange,
  onRoll,
  onAddCustomSkin,
  onRollingStart,
  onRollingEnd,
}: ControlPanelProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showTargetInput, setShowTargetInput] = useState(false);

  const handleRollDice = () => {
    onRollingStart();
    setTimeout(() => {
      const result = rollMultipleTimes(rule, numberOfRolls, targetValue);
      onRoll(result);
      onRollingEnd();
    }, 1500);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!validateImageFile(file)) {
      setUploadError('Invalid file. Please upload an image (JPG, PNG, WebP, GIF) under 5MB.');
      return;
    }

    try {
      const skin = await addCustomSkin(file);
      onAddCustomSkin(skin);
      onSkinChange(skin.id);
    } catch (error) {
      setUploadError('Failed to upload skin. Please try again.');
      console.error('Skin upload error:', error);
    }

    event.target.value = '';
  };

  const handleTargetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onTargetValueChange(undefined);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        onTargetValueChange(numValue);
      }
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold text-blue-300">
        掷骰子控制
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            规则选择
          </label>
          <div className="flex gap-2">
            {(['COC', 'DND'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRuleChange(r)}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition-colors ${
                  rule === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                disabled={isRolling}
              >
                {r}
                {r === 'COC' ? ' (d100)' : ' (d20)'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="rollCount"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            投掷次数
          </label>
          <input
            id="rollCount"
            type="number"
            min="1"
            max="100"
            value={numberOfRolls}
            onChange={(e) => {
              const val = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
              onNumberOfRollsChange(val);
            }}
            disabled={isRolling}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            aria-label="Number of rolls"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              目标值 (可选)
            </label>
            <button
              onClick={() => setShowTargetInput(!showTargetInput)}
              className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
              disabled={isRolling}
            >
              {showTargetInput ? '清除' : '设置'}
            </button>
          </div>
          {showTargetInput && (
            <input
              type="number"
              min="1"
              value={targetValue ?? ''}
              onChange={handleTargetValueChange}
              disabled={isRolling}
              placeholder="输入目标值"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              aria-label="Target value for success"
            />
          )}
          {targetValue !== undefined && (
            <p className="text-xs text-blue-400 mt-1">
              目标值: {targetValue}
            </p>
          )}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={handleRollDice}
            disabled={isRolling}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-md transition-colors"
            aria-label="Roll dice"
          >
            {isRolling ? '投掷中...' : '投掷骰子'}
          </button>
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">
            骰子皮肤
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {skins.map((skin) => (
              <button
                key={skin.id}
                onClick={() => onSkinChange(skin.id)}
                disabled={isRolling}
                className={`w-full px-3 py-2 rounded-md text-left text-sm font-medium transition-colors ${
                  currentSkinId === skin.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {skin.name}
                {skin.type === 'custom' && (
                  <span className="text-xs ml-1 text-gray-400">(自定义)</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label
              htmlFor="skinUpload"
              className="block w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium text-center rounded-md cursor-pointer transition-colors"
              role="button"
            >
              上传自定义皮肤
              <input
                id="skinUpload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isRolling}
                className="hidden"
                aria-label="Upload custom skin image"
              />
            </label>
          </div>

          {uploadError && (
            <div className="p-2 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
              {uploadError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
