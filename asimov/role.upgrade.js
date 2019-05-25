const spawnDrone = require('spawn.drone');
const harvestBehavior = require('behavior.harvest');

const RoleUpgrade = {
  name: 'upgrade',
  idealCount: 8,
  memory: {
    upgrading: false,
  },
  spawn: (spawner, prefix) => spawnDrone(spawner, RoleUpgrade, [WORK, CARRY, CARRY, MOVE], prefix),
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
      harvestBehavior(creep);
    }
  }
};

module.exports = RoleUpgrade;
