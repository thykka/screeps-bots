const Renew = require('renew');

module.exports.loop = function loopCreep(opts) {
  const myCreeps = _.filter(Game.creeps, c => c.my);

  _.forEach(myCreeps, (creep, creepIndex) => {

    const spawn = Game.getObjectById(creep.memory.spwn);

    // Load state
    let task = creep.memory.task;
    let target = Game.getObjectById(creep.memory.trgt);

    // ---- Choose task ----

    if(task === 'HOM' && creep.ticksToLive >= Renew.resumeThreshold) {
      if(creep.carry.energy > (creep.carryCapacity / 2)) {
        task = 'RFL';
      } else {
        task = 'NRG';
      }
    }
    if(task !== 'NRG' && creep.carry.energy === 0) {
      // no energy in carry.. find more
      task = 'NRG';
      target = creep.findEnergy();
    }
    if(task !== 'RFL' && creep.carry.energy === creep.carryCapacity) {
      // carry full of energy.. unload to spawner or upgrade room
      target = creep.findRefill();
      if(target) {
        task = 'RFL';
      } else {
        task = 'UPG';
      }
    }
    if(creep.ticksToLive < Renew.returnThreshold) {
      task = 'HOM'; // ReturnHome
      if(Game.time % 4 === 0) console.log(creep.name + ' - expiring in ' + creep.ticksToLive);
    }

    // ---- Run chosen task ----
    switch(task) {
      case 'HOM':
        creep.returnHome(spawn);
        break;
      case 'NRG':
        if(!target) target = creep.findEnergy();
        creep.getEnergy(target);
        break;
      case 'RFL':
        if(!target) target = creep.findRefill();
        if(!creep.refill(target)) {
          task = 'UPG';
          target = false;
        }
        break;
      case 'UPG':
        if(!target) target = creep.findIncreaseLevelTarget();
        creep.increaseLevel(target);
        break;
      default:
        creep.wander();
    }

    // Save state
    if(task !== creep.memory.task) creep.memory.task = task;
    if(target !== creep.memory.trgt) creep.memory.trgt = target ? target.id : false;

    // UI
    if((Game.time + creepIndex) % _.size(myCreeps) === 0) { creep.say(task); }
  });
};

Creep.prototype.returnHome = Renew.returnHome;

Creep.prototype.findRefill = function findRefill() {
  const result = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: o => (
      o.energy < o.energyCapacity && (
        o.structureType === STRUCTURE_SPAWN ||
        o.structureType === STRUCTURE_EXTENSION ||
        o.structureType === STRUCTURE_TOWER
      )
    )
  });
  return result;
};
Creep.prototype.refill = function refill(target) {
  let success = true;
  const result = this.transfer(target, RESOURCE_ENERGY);
  if(result === ERR_NOT_IN_RANGE) {
    this.moveTo(target, {
      visualizePathStyle: { stroke: '#00cccc' }
    });
  } else if(result) {
    success = false;
    if(result !== ERR_FULL) {
      console.log(this.name + ' - refill error: ' + result);
    }
  }
  return success;
};

Creep.prototype.findEnergy = function findEnergy() {
  const result = this.pos.findClosestByPath(FIND_SOURCES);
  return result;
};
Creep.prototype.getEnergy = function getEnergy(source) {
  const result = this.harvest(source);
  if(result === ERR_NOT_IN_RANGE) {
    this.moveTo(source, {
      visualizePathStyle: { stroke: '#888800' }
    });
  }
};

Creep.prototype.findIncreaseLevelTarget = function findIncreaseLevelTarget() {
  return this.room.controller;
};
Creep.prototype.increaseLevel = function increaseLevel(target) {
  const result = this.upgradeController(target);
  if(result === ERR_NOT_IN_RANGE) {
    this.moveTo(target, {visualizePathStyle: {stroke: '#0000ff'}});
    return true;
  } else if(result) {
    console.log(this.name + ' - upgrade error: ' + result);
    return false;
  }
  return true;
};

Creep.prototype.wander = function wander() {
  const rndX = Math.floor(Math.random() * 3) - 1;
  const rndY = Math.floor(Math.random() * 3) - 1;

  let x = this.pos.x + rndX;
  let y = this.pos.y + rndY;

  // limit to room bounds
  if(x < 1) { x = 1; } else if(x > 48) { x = 48; }
  if(y < 1) { y = 1; } else if(y > 48) { y = 48; }

  this.moveTo( x, y, { visualizePathStyle: { stroke: '#000000' } });
  this.say('-');
};
