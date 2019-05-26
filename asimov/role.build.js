const spawnDrone = require('spawn.drone');
const harvestBehavior = require('behavior.harvest');

const RoleBuild = {
  name: 'build',
  idealCount: 8,
  memory: {
    building: false,
  },
  spawn: (spawner, prefix) => spawnDrone(spawner, RoleBuild, [WORK, CARRY, CARRY, MOVE], prefix),
  run: (creep, creepIndex, finder) => {
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
      if(targets.length) {
        const creepTarget = targets[creepIndex % targets.length];
        if(creep.build(creepTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creepTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      harvestBehavior(creep, false, finder);
    }
  }
};

module.exports = RoleBuild;
