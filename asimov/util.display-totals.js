const countCreeps = require('util.count-creeps');

module.exports = function displayTotals() {
  return Object.entries(
    countCreeps(Game.creeps)
  ).reduce((acc, [totalName, total], index, arr)=> {
    return acc + (
      totalName[0] + totalName[totalName.length-1] + ': ' + total +
      (index < (arr.length - 1) ? ' ' : '')
    );
  }, '');
};
