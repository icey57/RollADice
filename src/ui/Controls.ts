import { ConfigStore, Ruleset } from '../store/ConfigStore';
import { SkinKey } from '../types/skins';
import { skinDefinitions } from '../skins/skinDefinitions';

export interface ControlsOptions {
  container: HTMLElement;
  store: ConfigStore;
  className?: string;
}

export class Controls {
  private container: HTMLElement;
  private store: ConfigStore;
  private controlsElement: HTMLElement | null = null;
  private unsubscribe: (() => void) | null = null;

  private rulesetToggle: HTMLSelectElement | null = null;
  private rollCountInput: HTMLInputElement | null = null;
  private targetValueInput: HTMLInputElement | null = null;
  private skipAnimationCheckbox: HTMLInputElement | null = null;
  private skinSelector: HTMLSelectElement | null = null;

  constructor(options: ControlsOptions) {
    this.container = options.container;
    this.store = options.store;
  }

  render(): void {
    const controls = document.createElement('div');
    controls.className = 'dice-controls';
    controls.setAttribute('role', 'form');
    controls.setAttribute('aria-label', 'Dice configuration controls');

    controls.innerHTML = `
      <div class="dice-controls__group">
        <label for="dice-ruleset" class="dice-controls__label">
          Ruleset
        </label>
        <select 
          id="dice-ruleset" 
          class="dice-controls__select"
          aria-label="Select game ruleset"
        >
          <option value="DND">Dungeons & Dragons (DND)</option>
          <option value="COC">Call of Cthulhu (COC)</option>
        </select>
      </div>

      <div class="dice-controls__group">
        <label for="dice-roll-count" class="dice-controls__label">
          Roll Count
          <span class="dice-controls__required" aria-label="required">*</span>
        </label>
        <input 
          type="number" 
          id="dice-roll-count" 
          class="dice-controls__input"
          min="1"
          step="1"
          required
          aria-required="true"
          aria-describedby="dice-roll-count-error"
        />
        <span id="dice-roll-count-error" class="dice-controls__error" role="alert"></span>
      </div>

      <div class="dice-controls__group">
        <label for="dice-target-value" class="dice-controls__label">
          Target Value
          <span class="dice-controls__optional">(optional)</span>
        </label>
        <input 
          type="number" 
          id="dice-target-value" 
          class="dice-controls__input"
          min="0"
          step="1"
          placeholder="Leave empty for no target"
          aria-describedby="dice-target-value-help"
        />
        <span id="dice-target-value-help" class="dice-controls__help">
          Set a target value to compare rolls against
        </span>
      </div>

      <div class="dice-controls__group dice-controls__group--checkbox">
        <label class="dice-controls__checkbox-label">
          <input 
            type="checkbox" 
            id="dice-skip-animation" 
            class="dice-controls__checkbox"
            aria-label="Skip dice roll animation"
          />
          <span>Skip Animation</span>
        </label>
      </div>

      <div class="dice-controls__group">
        <label for="dice-skin" class="dice-controls__label">
          Dice Skin
        </label>
        <select 
          id="dice-skin" 
          class="dice-controls__select"
          aria-label="Select dice skin"
        >
        </select>
      </div>
    `;

    this.controlsElement = controls;
    this.container.appendChild(controls);

    this.rulesetToggle = controls.querySelector('#dice-ruleset');
    this.rollCountInput = controls.querySelector('#dice-roll-count');
    this.targetValueInput = controls.querySelector('#dice-target-value');
    this.skipAnimationCheckbox = controls.querySelector('#dice-skip-animation');
    this.skinSelector = controls.querySelector('#dice-skin');

    this.populateSkinSelector();
    this.setupEventListeners();
    this.syncWithStore();

    this.unsubscribe = this.store.subscribe(() => {
      this.syncWithStore();
    });
  }

  private populateSkinSelector(): void {
    if (!this.skinSelector) return;

    this.skinSelector.innerHTML = '';
    
    Object.keys(skinDefinitions).forEach((skinKey) => {
      const skin = skinDefinitions[skinKey as SkinKey];
      const option = document.createElement('option');
      option.value = skinKey;
      option.textContent = skin.name;
      option.setAttribute('data-description', skin.description);
      this.skinSelector!.appendChild(option);
    });
  }

  private setupEventListeners(): void {
    if (this.rulesetToggle) {
      this.rulesetToggle.addEventListener('change', (e) => {
        const value = (e.target as HTMLSelectElement).value as Ruleset;
        this.store.setRuleset(value);
      });
    }

    if (this.rollCountInput) {
      this.rollCountInput.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement;
        const value = input.value.trim();
        const errorElement = document.getElementById('dice-roll-count-error');

        if (value === '') {
          if (errorElement) {
            errorElement.textContent = 'Roll count is required';
          }
          input.setCustomValidity('Roll count is required');
          return;
        }

        const numValue = parseInt(value, 10);

        if (!Number.isInteger(numValue) || numValue < 1) {
          if (errorElement) {
            errorElement.textContent = 'Must be a positive integer';
          }
          input.setCustomValidity('Must be a positive integer');
          return;
        }

        if (errorElement) {
          errorElement.textContent = '';
        }
        input.setCustomValidity('');

        try {
          this.store.setRollCount(numValue);
        } catch (error) {
          if (errorElement) {
            errorElement.textContent = (error as Error).message;
          }
          input.setCustomValidity((error as Error).message);
        }
      });

      this.rollCountInput.addEventListener('blur', () => {
        if (this.rollCountInput && this.rollCountInput.value.trim() === '') {
          this.rollCountInput.value = String(this.store.getConfig().rollCount);
        }
      });
    }

    if (this.targetValueInput) {
      this.targetValueInput.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement;
        const value = input.value.trim();

        if (value === '') {
          input.setCustomValidity('');
          this.store.setTargetValue(null);
          return;
        }

        const numValue = parseInt(value, 10);

        if (!Number.isFinite(numValue) || numValue < 0) {
          input.setCustomValidity('Must be a non-negative number');
          return;
        }

        input.setCustomValidity('');

        try {
          this.store.setTargetValue(numValue);
        } catch (error) {
          input.setCustomValidity((error as Error).message);
        }
      });
    }

    if (this.skipAnimationCheckbox) {
      this.skipAnimationCheckbox.addEventListener('change', (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        this.store.setSkipAnimation(checked);
      });
    }

    if (this.skinSelector) {
      this.skinSelector.addEventListener('change', (e) => {
        const value = (e.target as HTMLSelectElement).value as SkinKey;
        this.store.setDiceSkin(value);
      });
    }
  }

  private syncWithStore(): void {
    const config = this.store.getConfig();

    if (this.rulesetToggle && this.rulesetToggle.value !== config.ruleset) {
      this.rulesetToggle.value = config.ruleset;
    }

    if (this.rollCountInput && parseInt(this.rollCountInput.value, 10) !== config.rollCount) {
      this.rollCountInput.value = String(config.rollCount);
    }

    if (this.targetValueInput) {
      const currentValue = this.targetValueInput.value.trim();
      const configValue = config.targetValue === null ? '' : String(config.targetValue);
      if (currentValue !== configValue) {
        this.targetValueInput.value = configValue;
      }
    }

    if (this.skipAnimationCheckbox && this.skipAnimationCheckbox.checked !== config.skipAnimation) {
      this.skipAnimationCheckbox.checked = config.skipAnimation;
    }

    if (this.skinSelector && this.skinSelector.value !== config.diceSkin) {
      this.skinSelector.value = config.diceSkin;
    }
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (this.controlsElement) {
      this.controlsElement.remove();
      this.controlsElement = null;
    }

    this.rulesetToggle = null;
    this.rollCountInput = null;
    this.targetValueInput = null;
    this.skipAnimationCheckbox = null;
    this.skinSelector = null;
  }

  getElement(): HTMLElement | null {
    return this.controlsElement;
  }
}
