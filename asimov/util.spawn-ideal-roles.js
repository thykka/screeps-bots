const { energyRequirement } = require('settings');
const countCreeps = require('util.count-creeps');

/**
 * Spawns the ideal amount of creeps for each role, if
 * @param {Object} [roles] - A hash of roles to spawn from
 */
module.exports = function spawnIdealRoleCreeps(spawner, roles, ideals) {
  if(
    spawner.energy >= energyRequirement &&
    !spawner.spawning
  ) {
    const totals = countCreeps(Game.creeps);
    console.log('- ' +
      Object.entries(ideals).reduce((log, [roleName, ideal]) => {
        if(log.length > 0) log += ', ';
        return log + roleName + ': ' + totals[roleName] + '/' + ideal;
      }, '')
    );
    for(const role in roles) {
      if(
        typeof roles[role].spawn === 'function' &&           // When a role has a spawning method, and
        typeof ideals[role] === 'number' && (      // an ideal creep count exists, and
          typeof totals[role] === 'undefined' || // no such creeps were found, or
          totals[role] < ideals[role]         // less than the ideal count of creeps
        )
      ) {
        roles[role].spawn(spawner, '_' + Date.now().toString(32).slice(-2));
        break; // exit early to spawn just 1 at a time
      }
    }
  }
};
