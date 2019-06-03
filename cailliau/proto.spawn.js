const { generateId } = require('utils');
const Roles = require('roles');

StructureSpawn.prototype.newWorker = function newWorker(task = false) {
  const workerRole = Roles.worker;
  if(task) {
    return this.newCreep(workerRole, task);
  }
  return this.newCreep(workerRole);
};

StructureSpawn.prototype.renewCloseby = function renewCloseby() {
  const closeByCreeps = this.pos.findInRange(FIND_MY_CREEPS, 1, {
    filter: c => c.ticksToLive < 1500 - Math.floor(600 / c.body.length)
  });
  let target = false;
  if(closeByCreeps.length === 1) {
    target = closeByCreeps[0];
  } else if(closeByCreeps.length > 1) {
    target = closeByCreeps.sort(
      (a, b) => a.ticksToLive - b.ticksToLive
    )[0];
  }
  if(target) {
    const renewResult = this.renewCreep(target);
    if(renewResult === ERR_BUSY) {

    } else if(renewResult) console.log('renew fail: ' + renewResult);
  }
};

StructureSpawn.prototype.newCreep = function newCreep(role, task) {
  const { body, name } = role;
  if(!body | !name) {
    throw Error('missing ' + ['body', 'name'].filter(key => !role[key]));
  }
  const memory = {
    spawn: this.id,
    room: this.room.name
  };
  if(task) {
    // presence of _task means it should be initialized with {Task}.begin(creep)
    memory._task = task.type;
  }
  const newName = `${ name[0] }_${ generateId(3) }`;
  const spawnResult = this.spawnCreep(
    body, newName, { memory: Object.assign({}, memory, role.memory) }
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
    return Game.creeps[newName];
  }
};

