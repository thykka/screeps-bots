const { generateId } = require('utils');
const Roles = require('roles');

StructureSpawn.prototype.newWorker = function newWorker() {
  const workerRole = Roles.worker;
  this.newCreep(workerRole);
};

StructureSpawn.prototype.newCreep = function newCreep(role, task) {
  const { body, name } = role;
  if(!body | !name) {
    throw Error('missing ' + ['body', 'name'].filter(key => !role[key]));
  }
  const memory = {
    spawn: this.id,
    room: this.room.name,
    task: task.type || false,
    target: false,
  };
  const spawnResult = this.spawnCreep(
    body, `${ name[0] }_${ generateId(3) }`, { memory }
  );
  if(spawnResult != 0) {
    console.log(this, {
      '-1': 'ERR_NOT_OWNER - You are not the owner of this spawn.',
      '-3': 'ERR_NAME_EXISTS - There is a creep with the same name already.',
      '-4': 'ERR_BUSY - The spawn is already in process of spawning another creep.',
      '-6': 'ERR_NOT_ENOUGH_ENERGY - The spawn and its extensions contain not enough energy to create a creep with the given body.',
      '-10': 'ERR_INVALID_ARGS - Body is not properly described or name was not provided.',
      '-14': 'ERR_RCL_NOT_ENOUGH - Your Room Controller level is insufficient to use this spawn.',
    }[spawnResult]);
  } else {
    console.log('Spawning ' + name + ' with ', body);
  }
};

