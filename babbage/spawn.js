const Renew = require('renew');
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
      spawn.renewCreeps();

      if(energy >= minEnergyToSpawn) {
        const creepCount = _.size(Game.creeps);
        const currentLevel = spawn.room.controller.level;
        const idealCount = SpawnLevel[currentLevel].ideal;

        if(creepCount < idealCount) {
          spawn.newCreep({ level: currentLevel });
        }

      } else if (Game.time % 1 === 0) {
        spawn.visualizeEnergy(energy, minEnergyToSpawn);
      }
    }
  }));
};

const SpawnLevel = {
  '0': {
    ideal: 1,
    body: [WORK, CARRY, MOVE],
  },
  '1': {
    ideal: 5,
    body: [WORK, CARRY, MOVE],
  },
  '2': {
    ideal: 10,
    body: [WORK, CARRY, MOVE],
  },
  '3': {
    ideal: 15,
    body: [WORK, CARRY, MOVE],
  }
};

module.exports.SpawnBehavior = SpawnBehavior;
StructureSpawn.prototype.renewCreeps = Renew.renewCreeps;

StructureSpawn.prototype.getRoomEnergy = function getRoomEnergy(extensions) {
  return this.energy + extensions.reduce((acc, o) => o.energy + acc, 0);
};

StructureSpawn.prototype.newCreep = function newCreep(opts) {
  const defs = {
    body: [WORK, CARRY, MOVE],
    name: (Date.now().toString(32).slice(-2)),
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
  console.log(this.name + ' - failed spawning creep ' + c.name + ': ' + result);
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

StructureSpawn.prototype.visualizeEnergy = function visualizeEnergy(energy = -1, minEnergy = 1) {
  const percentage = 100 * (energy / minEnergy);
  new RoomVisual(this.room).text(
    `${ energy }/${ minEnergy } ${ percentage.toFixed(0) }%`,
    this.pos.x, this.pos.y + 1.2,
    { font: 0.3, color: '#FF0', }
  );
};
