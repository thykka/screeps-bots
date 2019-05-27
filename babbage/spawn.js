StructureSpawn.prototype.getRoomEnergy = function getRoomEnergy(extensions) {
  return this.energy + extensions.reduce((acc, o) => o.energy + acc, 0);
};
StructureSpawn.prototype.newCreep = function newCreep(opts) {
  const defs = {
    body: [WORK, CARRY, MOVE],
    name: 'c0',
    task: false,
    home: this.room.name,
  };
  const c = Object.assign({}, defs, opts);

  const result = this.spawnCreep(c.body, c.name, {
    memory: {
      home: c.home,
      task: c.task,
    }
  });

  if(!result) {
    return Game.creeps[c.name];
  }
  console.log(this.name + ': Spawn ' + c.name + ' failed: ' + result);
};

module.exports.loop = function loopSpawn(opts) {
  _.forEach(Game.spawns, (spawn => {
    const roomExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
      filter: o => o instanceof StructureExtension
    });

    const energy = spawn.getRoomEnergy(roomExtensions);
    const minEnergyToSpawn = 300;

    if(energy > minEnergyToSpawn && _.size(Game.creeps) === 0) {
      spawn.newCreep();
    }

    console.log(spawn.name + ' E' + energy);
  }));
};
