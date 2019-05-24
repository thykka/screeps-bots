const RoleBuild = {
  name: 'build',
  idealCount: 8,
  spawn: (spawner, prefix) => {
    return spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      RoleBuild.name + prefix, {
        memory: {
          role: RoleBuild.name,
          building: false
        }
      }
    );
  },
  run: (creep) => {
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
      }
    }
  }
};

module.exports = RoleBuild;
