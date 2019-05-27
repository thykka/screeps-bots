const loops = {};
const loopModules = [
  'spawn',
  'tower',
  'creep',
];
loopModules.forEach(module => loops[module] = require(module));

module.exports.loop = function mainLoop() {

  loopModules.forEach(module => {
    try {
      const result = loops[module].loop();
    } catch(e) { console.log(e); }
  });
};
