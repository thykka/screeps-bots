Creep.prototype.returnHome = function returnHome() {
  const homeSpawn = this.memory.spwn;
  if(homeSpawn) {
    const target = Game.getObjectById(homeSpawn);
    this.moveTo(target, {
      visualizePathStyle: { stroke: '#ffff00' }
    });
  } else {

  }
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

    if(creep.ticksToLive < returnThreshold) { // creep about to expire
      console.log(creep.name + ' expiring: ' + creep.ticksToLive);
      creep.returnHome();
      break;
    }

    creep.wander();
  }
};
