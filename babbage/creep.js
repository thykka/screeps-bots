Creep.prototype.returnHome = function returnHome() {
  const homeSpawn = this.memory.spwn;
  let target = false;
  if(homeSpawn) {
    target = Game.getObjectById(homeSpawn);
  } else {
    target = _.sample(Game.spawns);
    // this.memory.spwn = target; // Do we wanna reset home spawn?
  }
  if(target) {
    this.moveTo(target, {
      visualizePathStyle: { stroke: '#ffff00' }
    });
  } else {
    this.say(':(');
  }
};

Creep.prototype.getEnergy = function getEnergy() {
  const source = this.pos.findClosestByPath(FIND_SOURCES);
  if(source) {
    const result = this.harvest(source);
    if(result === ERR_NOT_IN_RANGE) {
      this.moveTo(source);
    }
  } else {
    this.say(':/');
  }
};

Creep.prototype.refill = function getEnergy() {

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

module.exports.loop = function loopCreep(opts) {
  const returnThreshold = 300;

  const myCreeps = _.filter(Game.creeps, c => c.my);

  for(const creepName in myCreeps) {
    const creep = myCreeps[creepName];
    let task = creep.memory.task;



    // ---- Choose task ----

    // bringing energy to structure but none left
    if(task !== 'NRG' && creep.carry.energy === 0) {
      task = 'NRG';
    }
    // carry full, transfer energy to buildings
    if(task !== 'RFL' && creep.carry.energy === creep.carryCapacity) {
      task = 'RFL';
    }
    if(creep.ticksToLive < returnThreshold) {
      task = 'HOM'; // ReturnHome
      console.log(creep.name + ' expiring: ' + creep.ticksToLive);
    }



    // ---- Run chosen task ----

    creep.memory.task = task;
    switch(task) {
      case 'HOM':
        creep.returnHome();
        break;
      case 'RFL':
        creep.refill();
        break;
      case 'NRG':
        creep.getEnergy();
        break;
      default:
        creep.wander();
    }
  }
};
