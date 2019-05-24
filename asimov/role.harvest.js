const RoleHarvest = {
  name: 'harvest',
  idealCount: 1,
  spawn: (spawner, index) => {
    return spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      RoleHarvest.name + index, {
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
      creep.say('h: harvest');
    }
    else if( // harvesting energy, but full
      !creep.memory.working &&
      creep.carry.energy === creep.carryCapacity
    ) {
      creep.memory.working = true;
      creep.say('h: transfer');
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
        creep.moveTo(structure, {visualizePathStyle: {stroke: '#00ff88'}});
      }
    }
    else { // get more energy
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

      if(source) {
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {visualizePathStyle: {stroke: '#88ff00'}});
        }
      }
    }
  }
};

module.exports = RoleHarvest;
