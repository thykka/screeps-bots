const _ = require('lodash');

const ROLES = {
  harvest: require('role.harvest'),
  build: require('role.build'),
  upgrade: require('role.upgrade'),
};

const cleanMemory = require('util.clean-memory');

/**
 * Counts creeps, grouped by a memory value
 * @param {object} [options] -
 * @param {string} [options.group] - Which key to group by for in creep's memory ('role)
 * @param {object} [options.creeps] - Hash of creeps to search within (Game.screeps)
 * @returns {object} - Hash of totals found
 */
function countCreeps(creeps, group = 'role') {
  // TODO: Filter out creeps the player can't control
  return Object.values(creeps).reduce((totals, creep) => {
    if(totals[creep.memory[group]] === undefined) totals[creep.memory[group]] = 0;
    totals[creep.memory[group]]++;
    return totals;
  }, {});
}

/**
 * Spawns the ideal amount of creeps for each role, if
 * @param {Object} [roles] - A hash of roles to spawn from
 */
function spawnIdealRoleCreeps(spawner, roles = ROLES) {
  if(
    spawner.energy >= 300 &&
    !spawner.spawning
  ) {
    const totals = countCreeps(Game.creeps);
    console.log('Role fulfillment ' + JSON.stringify(totals).replace(/[\"\{\}]/g,''));
    for(const role in roles) {
      if(
        typeof roles[role].spawn === 'function' &&           // When a role has a spawning method, and
        typeof roles[role].idealCount === 'number' && (      // an ideal creep count exists, and
          typeof totals[role] === 'undefined' || // no such creeps were found, or
          totals[role] < roles[role].idealCount         // less than the ideal count of creeps
        )
      ) {
        spawner.say('+ Spawning ' + role + ' +');
        roles[role].spawn(spawner);
        break; // exit early to spawn just 1 at a time
      }
    }
  }
}

function runCreepsWithRoles(creeps, roles = ROLES) {
  _.forEach(creeps, (creep) => {
    const role = roles[creep.memory.role];
    if(role && typeof role.run === 'function') role.run(creep);
  });
}

module.exports.loop = function () {
  cleanMemory.run();

  spawnIdealRoleCreeps(Game.spawns['Spawner1']);
  runCreepsWithRoles(Game.creeps);
};
