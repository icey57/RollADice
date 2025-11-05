export { Dice } from './components/Dice';
export { D20 } from './components/D20';
export { D100 } from './components/D100';

export {
  skinDefinitions,
  getSkinDefinition,
  getAllSkinKeys,
} from './skins/skinDefinitions';

export {
  createMaterial,
  updateMaterial,
  loadTexture,
  loadTextureSync,
  preloadTextures,
  clearTextureCache,
} from './skins/materialFactory';

export type {
  MaterialSettings,
  SkinDefinition,
  SkinKey,
  SkinRegistry,
} from './types/skins';
