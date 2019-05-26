const { debugLevel, energyRequirement } = require('settings');
const countCreeps = require('util.count-creeps');

function getTotalEnergy(spawner, finder) {
  const extensionEnergy = finder.find({
    room: spawner.room,
    type: FIND_MY_STRUCTURES,
    filter: o => o instanceof StructureExtension,
  }).reduce((acc, o) => o.energy + acc, 0);
  /*
  const extensionEnergy = spawner.room.find(FIND_MY_STRUCTURES, {
    filter: o => o instanceof StructureExtension
  }).reduce((acc, o) => {
    return o.energy + acc;
  }, 0);
  */
  return extensionEnergy + spawner.energy;
}

function displayTotals(totals) {
  console.log(
    Object.entries(totals).reduce((acc, [totalName, total], index, arr)=> {
      return acc + (
        totalName[0] + totalName[totalName.length-1] + ': ' + total +
        index < (arr.length - 1) ? ' ' : ''
      );
    }, '% ')
  );
}

/**
 * Spawns the ideal amount of creeps for each role, if
 * @param {Object} [roles] - A hash of roles to spawn from
 */
module.exports = function spawnIdealRoleCreeps(spawner, roles, ideals, finder) {
  const totalEnergy = getTotalEnergy(spawner, finder);
  if(
    totalEnergy >= energyRequirement &&
    !spawner.spawning
  ) {
    const totals = countCreeps(Game.creeps);
    if(debugLevel > 0) displayTotals(totals);
    for(const role in roles) {
      if(
        typeof roles[role].spawn === 'function' &&           // When a role has a spawning method, and
        typeof ideals[role] === 'number' && (      // an ideal creep count exists, and
          typeof totals[role] === 'undefined' || // no such creeps were found, or
          totals[role] < ideals[role]         // less than the ideal count of creeps
        )
      ) {
        roles[role].spawn(spawner, '_' + Date.now().toString(32).slice(-2));
        if(debugLevel > 0) console.log('+ spawned ' + role);
        break; // exit early to spawn just 1 at a time
      }
    }
  } else if(debugLevel > 1) {
    if(spawner.spawning) {
      console.log('  spawning...');
    } else {
      console.log('  waiting to spawn, power: ' + totalEnergy);
    }
  }
};
