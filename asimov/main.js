const _ = require('lodash');

const ROLES = {
  harvest: require('role.harvest'),
};

const cleanMemory = require('util.clean-memory');

module.exports.loop = function () {
  cleanMemory.run();

  if(
    _.keys(Game.creeps).length === 0 &&
    _.has(Game.spawns, 'Spawn1') &&
    Game.spawns['Spawn1'].energy >= 300 &&
    !Game.spawns['Spawn1'].spawning
  ) {
    Game.spawns['Spawn1'].spawnCreep(
      [WORK, MOVE, CARRY],
      'Harvest1', {
        role: 'harvest',
        working: false,
      }
    );
  }
  _.forEach(Game.creeps, (creep) => {
    const creepRole = ROLES[creep.memory.role];
    if(creepRole && typeof creepRole['run'] === 'function') {
      creepRole.run(creep);
    }
  });
};
