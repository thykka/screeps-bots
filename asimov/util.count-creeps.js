/**
 * Counts creeps, grouped by a memory value
 * @param {object} [options] -
 * @param {string} [options.group] - Which key to group by for in creep's memory ('role)
 * @param {object} [options.creeps] - Hash of creeps to search within (Game.screeps)
 * @returns {object} - Hash of totals found
 */
module.exports = function countCreeps(creeps, group = 'role') {
  // TODO: Filter out creeps the player can't control
  return Object.values(creeps).reduce((totals, creep) => {
    if(totals[creep.memory[group]] === undefined) totals[creep.memory[group]] = 0;
    totals[creep.memory[group]]++;
    return totals;
  }, {});
};
