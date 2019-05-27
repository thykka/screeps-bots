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

module.exports.loop = function loopCreep(opts) {
  const returnThreshold = 1000;

  _.forEach(_.filter(Game.creeps, creep => creep.my), (creep => {

    if(creep.ticksToLive < returnThreshold) { // creep about to expire
      console.log(creep.name + ' expiring: ' + creep.ticksToLive);
      creep.returnHome();
    }

  }));
};
