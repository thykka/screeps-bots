// const _ = require('lodash');

const loops = {};
const loopModules = [
  'spawn',
  'tower',
  'creep',
];
loopModules.forEach(module => loops[module] = require(module));

module.exports.loop = function mainLoop() {
  let cache = {};

  loopModules.forEach(module => {
    try {
      const result = loops[module]({ cache });
      if(typeof result !== 'undefined') {
        if(typeof result.cache !== 'undefined') {
          cache[module] = result.cache;
        }
      }
    } catch(e) { console.log(e); }
  });

  console.log(cache);
};
