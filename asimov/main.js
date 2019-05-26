const { debugLevel } = require('settings');

const Cache = require('util.cache');
const Finder = require('util.finder');
const cleanMemory = require('util.clean-memory');
const spawnIdealRoleCreeps = require('util.spawn-ideal-roles');
const runCreepsWithRoles = require('util.run-roles');
const displayTotals = require('util.display-totals');
const towers = require('towers');

const ROLES = {
  harvest: require('role.harvest'),
  repair:  require('role.repair'),
  upgrade: require('role.upgrade'),
  build:   require('role.build'),
};

function loadIdealAmounts(spawn, roles) {
  spawn.memory.ideal = Object.values(roles).reduce((ideal, role) => {
    if(ideal.length > 0) ideal += ';';
    return ideal + role.name + ':' + role.idealCount;
  }, '');
}
function readIdealAmounts(spawn) {
  if(spawn.memory.ideal) {
    return spawn.memory.ideal.split(';').reduce((ideal, b) => {
      const [name, count] = b.split(':');
      ideal[name] = parseInt(count, 10);
      return ideal;
    }, {});
  }
}


loadIdealAmounts(Game.spawns['Spawn1'], ROLES);

module.exports.loop = function () {
  const cache = new Cache();
  const finder = new Finder(cache);
  const SPAWN = Game.spawns['Spawn1'];
  cleanMemory();

  const ideals = readIdealAmounts(SPAWN);

  towers.run(SPAWN.room, Game.creeps, finder);

  spawnIdealRoleCreeps(SPAWN, ROLES, ideals, finder);

  runCreepsWithRoles(Game.creeps, ROLES, finder);

  if(debugLevel > 0) {
    console.log('% ' + displayTotals(ideals));
  }
  if(debugLevel > 1) {
    const { reads, writes } = finder.cache;
    console.log('_ cache: r' + reads + '/w' + writes + ' (' + ((reads/writes)*100 - 100).toFixed(0) + '% bonus)');
  }
};
