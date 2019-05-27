const _ = require('lodash');

const loopModules = [
  'spawn',
  'tower',
  'creep',
];
const loop = {};
loopModules.forEach(module => loop[module] = require(module));

module.exports.loop = function mainLoop() {
  let cache = {};

  loopModules.forEach(module => {
    try {
      module.loop({ cache });
    } catch(e) { console.log(e); }
  });

  console.log(cache);
};
