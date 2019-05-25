const countCreeps = require('util.count-creeps');

/**
 * Spawns the ideal amount of creeps for each role, if
 * @param {Object} [roles] - A hash of roles to spawn from
 */
module.exports = function spawnIdealRoleCreeps(spawner, roles) {
  if(
    spawner.energy >= 300 &&
    !spawner.spawning
  ) {
    const totals = countCreeps(Game.creeps);
    console.log('- creeps ' + JSON.stringify(totals).replace(/[\":]/g,' '));
    for(const role in roles) {
      if(
        typeof roles[role].spawn === 'function' &&           // When a role has a spawning method, and
        typeof roles[role].idealCount === 'number' && (      // an ideal creep count exists, and
          typeof totals[role] === 'undefined' || // no such creeps were found, or
          totals[role] < roles[role].idealCount         // less than the ideal count of creeps
        )
      ) {
        roles[role].spawn(spawner, '_' + Date.now().toString(32).slice(-2));
        break; // exit early to spawn just 1 at a time
      }
    }
  }
};
