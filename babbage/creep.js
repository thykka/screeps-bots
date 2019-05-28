require('creep.methods');
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
