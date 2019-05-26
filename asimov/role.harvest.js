const spawnDrone = require('spawn.drone');
const harvestBehavior = require('behavior.harvest');

const RoleHarvest = {
  name: 'harvest',
  idealCount: 3,
  memory: {
    working: false,
  },
  spawn: (spawner, prefix) => spawnDrone(spawner, RoleHarvest, [WORK, WORK, CARRY, MOVE], prefix),
  run: (creep, creepIndex, finder) => {
    // bringing energy to structure, but no energy left
    if(creep.memory.working && creep.carry.energy === 0) {
      creep.memory.working = false;
    }

    // harvesting energy, but full
    else if(!creep.memory.working && creep.carry.energy === creep.carryCapacity) {
      creep.memory.working = true;
    }

    // unloading energy
    if(creep.memory.working) {
      let structure = creep.pos.findClosestByPath(
        FIND_MY_STRUCTURES,
        {
          filter: (structure) => (
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_TOWER
          ) && structure.energy < structure.energyCapacity
        }
      );

      if(!structure) {
        structure = creep.room.storage;
      } else if(
        creep.transfer(structure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffff00'}});
      }
    }
    // get more energy
    else { harvestBehavior(creep, creepIndex, true, finder); }
  }
};

module.exports = RoleHarvest;
