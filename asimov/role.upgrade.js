const RoleUpgrade = {
  name: 'upgrade',
  idealCount: 8,
  spawn: (spawner, prefix) => {
    return spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      RoleUpgrade.name + prefix, {
        memory: {
          role: RoleUpgrade.name,
          upgrading: false
        }
      }
    );
  },
  run: (creep) => {

    if(creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
    }

    if(creep.memory.upgrading) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0000ff'}});
      }
    }
    else {
      let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
      }
    }
  }
};

module.exports = RoleUpgrade;
