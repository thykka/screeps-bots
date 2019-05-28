const RenewErrors = {
  '0': 'OK', //The operation has been scheduled successfully.
  '-1': 'ERR_NOT_OWNER', //You are not the owner of the spawn, or the creep.
  '-4': 'ERR_BUSY', //The spawn is spawning another creep.
  '-6': 'ERR_NOT_ENOUGH_ENERGY', //The spawn does not have enough energy.
  '-7': 'ERR_INVALID_TARGET', //The specified target object is not a creep.
  '-8': 'ERR_FULL', //The target creep's time to live timer is full.
  '-9': 'ERR_NOT_IN_RANGE', //The target creep is too far away.
  '-10' : 'ERR_RCL_NOT_ENOUGH', //Your Room Controller level is insufficient to use this spawn.
};

const Renew = {
  renewThreshold: 300,
  resumeThreshold: 1300,
  renewCreeps: function renewCreeps() {
    const adjacent = _.sortBy(this.getAdjacentCreeps(), ['ticksToLive']);
    if(adjacent.length && adjacent[0]) {
      const creep = adjacent[0];
      const result = this.renewCreep(creep);
      if(!result) {
        creep.say('+');
      } else if(result !== ERR_FULL) {
        console.log(this.name + ' - renew error: ' + result);
      }
    }
  },
  returnHome: function returnHome(target) {
    if(!target) {
      target = _.sample(Game.spawns);
    }
    const result = this.moveTo(target, {
      visualizePathStyle: { stroke: '#000000' }
    });
    if(!result) {
      this.say('!');
    } else {
      console.log(this.name + ' - returning error: ' + RenewErrors[result]);
    }
  },
};

module.exports = Renew;
