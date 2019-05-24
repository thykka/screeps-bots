const RoleHarvest = {
  name: 'harvest',
  idealCount: 2,
  body: [WORK, MOVE, CARRY],
  spawn: (spawner, prefix = '') => {
    return spawner.spawnCreep(
      RoleHarvest.body,
      RoleHarvest.name + prefix, {
        memory: {
          role: RoleHarvest.name,
          working: false
        }
      }
    );
  },
  run: (creep) => {
    if( // bringing energy to structure, but no energy left
      creep.memory.working &&
      creep.carry.energy === 0
    ) {
      creep.memory.working = false;
    }
    else if( // harvesting energy, but full
      !creep.memory.working &&
      creep.carry.energy === creep.carryCapacity
    ) {
      creep.memory.working = true;
    }

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
    else { // get more energy
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

      if(source) {
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {visualizePathStyle: {stroke: '#000000'}});
        }
      }
    }
  }
};

module.exports = RoleHarvest;
