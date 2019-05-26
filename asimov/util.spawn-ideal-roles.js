const { debugLevel, energyRequirement } = require('settings');
const countCreeps = require('util.count-creeps');
const getTotalEnergy = require('util.total-energy');

/**
 * Spawns the ideal amount of creeps for each role, if
 * @param {Object} [roles] - A hash of roles to spawn from
 */
module.exports = function spawnIdealRoleCreeps(spawner, roles, ideals, finder) {
  const totalEnergy = getTotalEnergy(spawner, finder);
  let spawned = false;
  if(
    totalEnergy >= energyRequirement &&
    !spawner.spawning
  ) {
    const totals = countCreeps(Game.creeps);
    for(const role in roles) {
      if(
        typeof roles[role].spawn === 'function' &&           // When a role has a spawning method, and
        typeof ideals[role] === 'number' && (      // an ideal creep count exists, and
          typeof totals[role] === 'undefined' || // no such creeps were found, or
          totals[role] < ideals[role]         // less than the ideal count of creeps
        )
      ) {
        roles[role].spawn(spawner, '_' + Date.now().toString(32).slice(-2));
        spawned = !spawned ? role : spawned + ', ' + role;
        break; // exit early to spawn just 1 at a time
      }
    }
  }
  return spawned;
};
