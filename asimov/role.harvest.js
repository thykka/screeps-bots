const RoleHarvest = {
  name: 'harvest',
  run: (creep) => {
    if( // bringing energy to structure, but no energy left
      creep.memory.working &&
      creep.carry.energy === 0
    ) {
      creep.memroy.working = false;
    }
    else if( // harvesting energy, but full
      !creep.memory.working &&
      creep.carry.energy === creep.carryCapacity
    ) {
      creep.memory.working = true;
    }

    if(creep.memory.working) {
      const structure = creep.pos.findClosestByPath(
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
        creep.moveTo(structure);
      }
    }
    else {
      creep.getEnergy(false, true);
    }
  }
};

module.exports = RoleHarvest;
