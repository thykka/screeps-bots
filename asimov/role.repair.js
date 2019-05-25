const spawnDrone = require('spawn.drone');

const findRepairTarget = function(creep) {
  let target = creep.room.find(FIND_MY_STRUCTURES)
    .filter(o => o.hits < o.hitsMax)
    .sort((a, b) => a.hits - b.hits);

  if(target.length === 0) {
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
  console.log('Saving target ' + JSON.stringify(target[0]));
  creep.memory.target = target.length > 0 ? target[0].id : false;
  return target.length === 0 ? false : target[0];
};

const RoleRepair = {
  name: 'repair',
  idealCount: 3,
  memory: {
    repairing: false,
    target: false,
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
      findRepairTarget(creep);
    }

    if(creep.memory.repairing) {
      if(!creep.memory.target) findRepairTarget(creep);
      if(creep.memory.target) {
        const target = Game.getObjectById(creep.memory.target);
        if(target) {
          const result = creep.repair(target);
          if(result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
          } else if(result !== 0) {
            console.log('cannot repair: ' + result + ', ' + JSON.stringify(Object.values(target)));
          }
        }
      }
    }
    else { // creep not repairing => harvest more energy
      let sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffff00'}});
      }
    }
  }
};

module.exports = RoleRepair;
