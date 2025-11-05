import { ConfigStore, Controls, D20, D100 } from './src/index';

export function initializeDiceControlsExample(containerElement: HTMLElement) {
  const store = new ConfigStore({
    ruleset: 'DND',
    rollCount: 1,
    targetValue: null,
    skipAnimation: false,
    diceSkin: 'bronze',
  });

  const controls = new Controls({
    container: containerElement,
    store: store,
  });

  controls.render();

  const d20 = new D20(1, 0);
  d20.initialize();
  
  const d100 = new D100(1, 32, 32);
  d100.initialize();

  store.subscribe((config) => {
    console.log('Configuration updated:', config);

    d20.setSkin(config.diceSkin);
    d100.setSkin(config.diceSkin);

    if (config.skipAnimation) {
      d20.stopRoll();
      d100.stopRoll();
    }
  });

  function rollDice() {
    const config = store.getConfig();
    const results = [];

    for (let i = 0; i < config.rollCount; i++) {
      const result = config.ruleset === 'DND' ? d20.rollD20() : d100.rollD100();
      results.push(result);
    }

    if (!config.skipAnimation) {
      if (config.ruleset === 'DND') {
        d20.roll();
      } else {
        d100.roll();
      }
    }

    console.log(`Rolled ${config.rollCount} dice:`, results);

    if (config.targetValue !== null) {
      const successes = results.filter(r => r >= config.targetValue!).length;
      console.log(`Successes (>= ${config.targetValue}):`, successes);
    }

    return results;
  }

  function update(deltaTime: number) {
    d20.update(deltaTime);
    d100.update(deltaTime);
  }

  function cleanup() {
    controls.destroy();
    d20.dispose();
    d100.dispose();
  }

  return {
    store,
    controls,
    d20,
    d100,
    rollDice,
    update,
    cleanup,
  };
}
