console.log('--> loaded babbage ' + Game.time);
const loops = {};
const loopModules = [
  'spawn',
  'tower',
  'creep',
];
loopModules.forEach(module => loops[module] = require(module));

module.exports.loop = function mainLoop() {
  cleanMemory();

  loopModules.forEach(module => {
    try {
      const result = loops[module].loop();
    } catch(e) { console.log(e); }
  });
};

function cleanMemory() {
  let dead = false;
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      dead = !dead ? name : dead + ', ' + name;
    }
  }
  if(dead) Game.notify('Dead creeps: ' + dead);
  return dead;
};
