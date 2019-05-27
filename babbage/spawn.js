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
      spwn: this.id,
    }
  });

  if(!result) {
    return Game.creeps[c.name];
  }
  console.log(this.name + ': Spawn ' + c.name + ' failed: ' + result);
};
StructureSpawn.prototype.getAdjacentCreeps = function getAdjacentCreeps() {
  const minX = this.pos.x-1;
  const minY = this.pos.y-1;
  const maxX = this.pos.x+1;
  const maxY = this.pos.y+1;

  return this.room.find(FIND_MY_CREEPS, {
    filter: c => {
      return (
        c.pos.x >= minX && c.pos.x <= maxX &&
        c.pos.y >= minY && c.pos.y <= maxY
      );
    }
  });
};

module.exports.loop = function loopSpawn(opts) {
  _.forEach(Game.spawns, (spawn => {
    const roomExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
      filter: o => o instanceof StructureExtension
    });

    // Check spawn energy
    const energy = spawn.getRoomEnergy(roomExtensions);
    const minEnergyToSpawn = 300;

    // Spawn a creep if there's none left
    if(energy >= minEnergyToSpawn && _.size(Game.creeps) === 0) {
      spawn.newCreep();
    }

    if(!spawn.spawning) {
      // spawn.renewCreep(creep)
      const adjacent = spawn.getAdjacentCreeps();
      if(adjacent[0] && adjacent[0].ticksToLive < 1200) {
        const result = spawn.renewCreep(adjacent[0]);
        if(!result) {
          adjacent[0].say('+');
        } else {
          console.log(spawn.name + ' heal failed: ' + result);
        }
      }
    }

    console.log(spawn.name + ' E' + energy);
  }));
};
