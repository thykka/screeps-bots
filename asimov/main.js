const { debugLevel } = require('settings');

const Cache = require('util.cache');
const Finder = require('util.finder');
const cleanMemory = require('util.clean-memory');
const spawnIdealRoleCreeps = require('util.spawn-ideal-roles');
const runCreepsWithRoles = require('util.run-roles');
const towers = require('towers');


const displayTotals =  debugLevel > 0 ? require('util.display-totals') : null;

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

const SPAWN = Game.spawns['Spawn1'];

if(!SPAWN.memory.ideal) loadIdealAmounts(SPAWN, ROLES);

module.exports.loop = function () {
  const cache = new Cache();
  const finder = new Finder(cache);
  const dead = cleanMemory();

  const ideals = readIdealAmounts(SPAWN);

  towers.run(SPAWN.room, Game.creeps, finder);

  const newCreeps = spawnIdealRoleCreeps(SPAWN, ROLES, ideals, finder);

  runCreepsWithRoles(Game.creeps, ROLES, finder);

  /*--- Logging ---*/
  if(debugLevel > 0) {
    if(dead) {
      console.log('x ' + 'RIP ' + dead);
    }
    if(newCreeps) {
      console.log('+ Welcome aboard, ' + newCreeps);
    }
    if(dead || newCreeps) {
      console.log('= ' + displayTotals(ideals));
    }
  }
  if(debugLevel > 1) {
    if(!newCreeps) {
      if(SPAWN.spawning) {
        console.log('| spawning ' + SPAWN.spawning.name + '...');
      } else {
        console.log('| waiting');
      }
    }

    const { reads, writes } = finder.cache;
    console.log('_ cache: r' + reads + '/w' + writes + ' (' + ((reads/writes)*100 - 100).toFixed(0) + '% bonus)');
  }
};
