const countCreeps = require('util.count-creeps');

module.exports = function displayTotals(ideals) {
  return Object.entries(countCreeps(Game.creeps))
    .sort(([a], [b]) => a > b)
    .reduce((acc, [totalName, total], index, arr)=> {
      return acc + (
        totalName[0] + totalName[1] + ':' +
        total + '/' + ideals[totalName] +
        (index < (arr.length - 1) ? ' ' : '')
      );
    }, '');
};
