const RoleRepair = {
  name: 'repair',
  idealCount: 3,
  spawn: (spawner, prefix) => {
    return spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      RoleRepair.name + prefix, {
        memory: {
          role: RoleRepair.name,
          repairing: false
        }
      }
    );
  },
  run: (creep) => {
    if(creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }
    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
    }

    if(creep.memory.repairing) {
      const target = creep.room.find(FIND_MY_STRUCTURES).filter(
        object => object.hits < object.hitsMax
      );
      console.log('repair target: ' + target);

      if(target.length > 0) {
        const result = creep.repair(target[0]);
        if(result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0], {visualizePathStyle: {stroke: '#00ff00'}});
        } else {
          // nothing to repair?
          console.log('cannot repair: ' + result + ', ' + JSON.stringify(Object.values(target[0])));
        }
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
