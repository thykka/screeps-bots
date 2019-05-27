module.exports.loop = function loopCreep(opts) {
  const returnThreshold = 300;

  const myCreeps = _.filter(Game.creeps, c => c.my);

  for(const creepName in myCreeps) {
    const creep = myCreeps[creepName];
    const spawn = Game.getObjectById(creep.memory.spwn);

    // Load state
    let task = creep.memory.task;
    let target = Game.getObjectById(creep.memory.trgt);

    // ---- Choose task ----

    // bringing energy to structure but none left
    if(task !== 'NRG' && creep.carry.energy === 0) {
      task = 'NRG';
      target = creep.findEnergy();
    }
    // carry full, transfer energy to buildings
    if(task !== 'RFL' && creep.carry.energy === creep.carryCapacity) {
      task = 'RFL';
      target = creep.findRefill();
    }
    if(creep.ticksToLive < returnThreshold) {
      task = 'HOM'; // ReturnHome
      console.log(creep.name + ' expiring: ' + creep.ticksToLive);
    }

    // ---- Run chosen task ----
    switch(task) {
      case 'HOM':
        creep.returnHome(spawn);
        break;
      case 'RFL':
        if(!target) target = creep.findRefill();
        creep.refill(target);
        break;
      case 'NRG':
        if(!target) target = creep.findEnergy();
        creep.getEnergy(target);
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
    if(target !== creep.memory.target) creep.memory.trgt = target ? target.id : false;

    // UI
    if(Game.time % 4 === 0) { creep.say(task); }
  }
};

Creep.prototype.returnHome = function returnHome(target) {
  if(!target) {
    target = _.sample(Game.spawns);
  }
  this.moveTo(target, {
    visualizePathStyle: { stroke: '#000000' }
  });
};

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
  const result = this.transfer(target, RESOURCE_ENERGY);
  if(result === ERR_NOT_IN_RANGE) {
    this.moveTo(target, {
      visualizePathStyle: { stroke: '#00cccc' }
    });
  } else if(result === ERR_FULL) {
    this.memory.task = false;
  } else if(result) {
    console.log('refill failed: ' + result);
  }
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
  return false;
};
Creep.prototype.increaseLevel = function increaseLevel(target) {

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
