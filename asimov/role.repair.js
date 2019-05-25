const spawnDrone = require('spawn.drone');

const RoleRepair = {
  name: 'repair',
  idealCount: 3,
  memory: {
    repairing: false,
  },
  spawn: (spawner, prefix) => spawnDrone(spawner, RoleRepair, [WORK, CARRY, CARRY, MOVE], prefix),
  run: (creep) => {
    // Switch to getting energy
    if(creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }

    // Switch to repairing
    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;

      let target = creep.room.find(FIND_MY_STRUCTURES)
        .filter(o => o.hits < o.hitsMax)
        .sort((a, b) => a.hits - b.hits);

      íf(target.length === 0) {
        target = creep.room.find(FIND_STRUCTURES)
          .filter(o => ((
            o instanceof StructureWall ||
            o instanceof StructureRampart ||
            o instanceof StructureTower ||
            o instanceof StructureRoad
          ) && o.hits < o.hitsMax ))
          .sort((a, b) => a.hits - b.hits);
      }

      // Save target ID to memory
      creep.memory.target = target.length > 0 ? target[0].id : false;
    }

    // fetch target
    const target = Game.getObjectById(creep.memory.target);
    if(creep.memory.repairing && target) {
      const result = creep.repair(target);
      if(result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
      } else if(result !== 0) {
        console.log('cannot repair: ' + result + ', ' + JSON.stringify(Object.values(target)));
      }
    }
    else {
      let sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffff00'}});
      }
    }
  }
};

module.exports = RoleRepair;
