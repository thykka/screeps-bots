const Finder = require('util.finder');
const cleanMemory = require('util.clean-memory');
const spawnIdealRoleCreeps = require('util.spawn-ideal-roles');
const runCreepsWithRoles = require('util.run-roles');
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
  const SPAWN = Game.spawns['Spawn1'];
  cleanMemory();
  spawnIdealRoleCreeps(SPAWN, ROLES, readIdealAmounts(SPAWN));
  runCreepsWithRoles(Game.creeps, ROLES, Finder);
  towers.run(SPAWN.room, Finder);
  console.log('> cache stats: w' +Finder.writes + '/r' + Finder.reads + ' (' + (Finder.writes / Finder.reads).toFixed(2) + ')');
};
