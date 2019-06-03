console.log('==> Reinitialize ' + Game.time);

require('proto.spawn');
require('proto.creep');
require('proto.room');
const Brain = require('brain');
const brain = new Brain();

global.Tasks = require('tasks');


module.exports.loop = function mainLoop() {
  cleanMemory();
  try {
    brain.loop();
  } catch(e) {
    console.log(e);
  }
};

function cleanMemory() {
  let dead = false;
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      dead = !dead ? name : dead + ', ' + name;
    }
  }
  if(dead && Game.rooms.sim) {
    Game.notify('Dead creeps: ' + dead);
  }
  return dead;
};
