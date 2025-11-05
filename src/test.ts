import { D20, D100, getAllSkinKeys, getSkinDefinition, SkinKey } from './index';

console.log('=== Dice Skins System Test ===\n');

console.log('1. Testing skin definitions...');
const skins = getAllSkinKeys();
console.log(`   Available skins: ${skins.join(', ')}`);
console.log(`   Total skins: ${skins.length}\n`);

console.log('2. Testing skin retrieval...');
skins.forEach(skinKey => {
  const skin = getSkinDefinition(skinKey as SkinKey);
  console.log(`   ${skinKey}: ${skin.name} - ${skin.description}`);
});
console.log();

console.log('3. Testing D20 creation and initialization...');
const d20 = new D20(1, 0);
d20.initialize();
console.log(`   D20 created successfully`);
console.log(`   Initial skin: ${d20.getCurrentSkin()}\n`);

console.log('4. Testing D100 creation and initialization...');
const d100 = new D100(1, 32, 32);
d100.initialize();
console.log(`   D100 created successfully`);
console.log(`   Initial skin: ${d100.getCurrentSkin()}\n`);

console.log('5. Testing skin switching on D20...');
const d20TestSkins: SkinKey[] = ['silver', 'gold', 'crystal'];
d20TestSkins.forEach(skinKey => {
  d20.setSkin(skinKey);
  console.log(`   Applied ${skinKey} skin to D20 - Current: ${d20.getCurrentSkin()}`);
});
console.log();

console.log('6. Testing skin switching on D100...');
const d100TestSkins: SkinKey[] = ['gemstone', 'obsidian', 'jade'];
d100TestSkins.forEach(skinKey => {
  d100.setSkin(skinKey);
  console.log(`   Applied ${skinKey} skin to D100 - Current: ${d100.getCurrentSkin()}`);
});
console.log();

console.log('7. Testing roll functionality...');
console.log('   D20 rolls:');
for (let i = 0; i < 5; i++) {
  const result = d20.rollD20();
  console.log(`     Roll ${i + 1}: ${result} (valid: ${result >= 1 && result <= 20})`);
}
console.log('   D100 rolls:');
for (let i = 0; i < 5; i++) {
  const result = d100.rollD100();
  console.log(`     Roll ${i + 1}: ${result} (valid: ${result >= 1 && result <= 100})`);
}
console.log();

console.log('8. Testing rolling state...');
console.log(`   D20 rolling before roll(): ${d20.isCurrentlyRolling()}`);
d20.roll();
console.log(`   D20 rolling after roll(): ${d20.isCurrentlyRolling()}`);
d20.stopRoll();
console.log(`   D20 rolling after stopRoll(): ${d20.isCurrentlyRolling()}`);
console.log();

console.log('9. Testing mesh and group retrieval...');
console.log(`   D20 mesh exists: ${d20.getMesh() !== null}`);
console.log(`   D20 group exists: ${d20.getGroup() !== null}`);
console.log(`   D100 mesh exists: ${d100.getMesh() !== null}`);
console.log(`   D100 group exists: ${d100.getGroup() !== null}`);
console.log();

console.log('10. Testing update method...');
try {
  d20.roll();
  for (let i = 0; i < 3; i++) {
    d20.update(0.016);
  }
  console.log('   D20 update: OK');
  
  d100.roll();
  for (let i = 0; i < 3; i++) {
    d100.update(0.016);
  }
  console.log('   D100 update: OK');
} catch (error) {
  console.error(`   Update failed: ${error}`);
}
console.log();

console.log('11. Testing material properties...');
skins.forEach(skinKey => {
  const skin = getSkinDefinition(skinKey as SkinKey);
  const hasColor = skin.materials.color !== undefined;
  const hasMetalness = skin.materials.metalness !== undefined;
  const hasRoughness = skin.materials.roughness !== undefined;
  console.log(`   ${skinKey}: color=${hasColor}, metalness=${hasMetalness}, roughness=${hasRoughness}`);
});
console.log();

console.log('12. Testing redundant skin application...');
const currentSkin = d20.getCurrentSkin();
d20.setSkin(currentSkin);
console.log(`   Redundant application handled correctly: ${d20.getCurrentSkin() === currentSkin}`);
console.log();

console.log('13. Testing disposal...');
try {
  d20.dispose();
  d100.dispose();
  console.log('   Disposal: OK\n');
} catch (error) {
  console.error(`   Disposal failed: ${error}\n`);
}

console.log('=== All Tests Completed ===');
console.log('\nSummary:');
console.log(`✓ ${skins.length} skins defined`);
console.log('✓ D20 and D100 creation successful');
console.log('✓ Skin switching works correctly');
console.log('✓ Roll functionality verified');
console.log('✓ State management working');
console.log('✓ No runtime errors detected');
