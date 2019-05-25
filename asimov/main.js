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

const SPAWN = Game.spawns['Spawn1'];

module.exports.loop = function () {
  cleanMemory();
  spawnIdealRoleCreeps(SPAWN, ROLES, readIdealAmounts(SPAWN));
  runCreepsWithRoles(Game.creeps, ROLES);
  towers.run(SPAWN.room);
};
