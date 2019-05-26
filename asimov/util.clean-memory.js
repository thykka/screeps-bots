module.exports = function cleanMemory() {
  let dead = false;
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      dead = !dead ? name : dead + ', ' + name;
    }
  }
  return dead;
};
