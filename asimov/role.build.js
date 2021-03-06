const { bodyLevels } = require('settings');

const spawnDrone = require('spawn.drone');
const harvestBehavior = require('behavior.harvest');

const RoleBuild = {
  name: 'build',
  idealCount: 8,
  memory: {
    building: false,
  },
  spawn: (spawner, prefix, level = 0) => spawnDrone(spawner, RoleBuild, bodyLevels[level][RoleBuild.name], prefix),
  run: (creep, creepIndex, finder) => {
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
    }

    if(creep.memory.building) {
      const targets = finder.find({
        creep,
        type: FIND_MY_CONSTRUCTION_SITES,
      });
      if(targets.length) {
        const creepTarget = targets[creepIndex % targets.length];
        if(creep.build(creepTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creepTarget, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      harvestBehavior(creep, creepIndex, false, finder);
    }
  }
};

module.exports = RoleBuild;
