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
      } else {
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
      console.log(this.name + ' - returning error: ' + result);
    }
  },
};

module.exports = Renew;
