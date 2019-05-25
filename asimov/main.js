const cleanMemory = require('util.clean-memory');
const spawnIdealRoleCreeps = require('util.spawn-ideal-roles');
const runCreepsWithRoles = require('util.run-roles');

const ROLES = {
  harvest: require('role.harvest'),
  repair:  require('role.repair'),
  upgrade: require('role.upgrade'),
  build:   require('role.build'),
};

function loadIdealAmounts(spawn, roles) {
  Object.values(roles).reduce((ideal, role) => {
    return (ideal.length === 0 ? '' : ';') + role.name + ':' + role.idealCount;
  }, '');
  spawn.memory.ideal = ideal;
}
function readIdealAmounts(spawn) {
  if(spawn.memory.ideal) {
    return spawn.memory.ideal.split(';').reduce((a, b) => {
      a[b.name] = b.idealCount;
      return a;
    }, {});
  }
}

loadIdealAmounts(Game.spawns['Spawn1'], ROLES);

module.exports.loop = function () {
  cleanMemory();
  spawnIdealRoleCreeps(Game.spawns['Spawn1'], ROLES);
  runCreepsWithRoles(Game.creeps, ROLES);

  console.log(JSON.stringify(readIdealAmounts(Game.spawns['Spawn1'])));
};
