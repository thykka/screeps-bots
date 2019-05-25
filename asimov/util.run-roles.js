const _ = require('lodash');

/**
 * Determines the role of each creep and attempts to run the corresponding role loop
 * @param {object} creeps - A hash of creeps to process
 * @param {object} roles - A hash of roles to process
 */
function runCreepsWithRoles(creeps, roles) {
  _.forEach(creeps, (creep, creepIndex) => {
    const role = roles[creep.memory.role];
    try {
      if(role && typeof role.run === 'function') role.run(creep, creepIndex);
    } catch(e) {
      console.log(e, creep.name);
    }
  });
}

module.exports = runCreepsWithRoles;
