const _ = require('lodash');

require('overrides.create-creep');

module.exports.loop = function () {
  if(
    _.keys(Game.creeps).length === 0 &&
    _.has(Game.spawns, 'Spawn1') &&
    Game.spawns['Spawn1'].energy >= 300 &&
    !Game.spawns['Spawn1'].spawning
  ) {
    Game.spawns['Spawn1'].spawnCreep(
      [WORK, MOVE, CARRY], {
        role: 'harvest',
        working: false,
      }
    );
  }
};
