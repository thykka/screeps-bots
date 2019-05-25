module.exports = function cleanMemory() {
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('! bring out yer dead: ' + name);
    }
  }
};
