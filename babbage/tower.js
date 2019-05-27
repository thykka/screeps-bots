module.exports.loop = function loopTower(opts) {
  const myRooms = {};
  _.forEach(Game.spawns, (spawn => {
    myRooms[spawn.room.name] = spawn.room;
  }));

  _.forEach(myRooms, (room => {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    const hostiles = room.find(FIND_HOSTILE_CREEPS);
    const hurts = room.find(FIND_MY_CREEPS)
      .filter(c => c.hits < c.maxHits);

    towers.forEach((tower, towerIndex) => {
      if(hostiles.length) {
        tower.attack(hostiles[towerIndex % hostiles.length]);
      } else {
        tower.heal(hurts[towerIndex % hurts.length]);
      }
    });
  }));
};
