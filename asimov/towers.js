const Towers = {
  run: function run(room, finder) {
    const towers = finder.find({
      room,
      type: FIND_MY_STRUCTURES,
      filter: o => o.structureType === STRUCTURE_TOWER
    });
    /*
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });
    */
    const hostiles = finder.find({
      room,
      type: FIND_HOSTILE_CREEPS
    });

    // const hostiles = room.find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
      Towers.attack(towers, hostiles);
      const username = hostiles[0].owner.username;
      Game.notify(`User ${username} spotted with ${ hostiles.length } hostiles`);
    }
  },
  attack: function attack(towers, hostiles) {
    const weakestFirst = hostiles.sort((a, b) => a.hits - b.hits);
    towers.forEach((tower, index) => {
      tower.attack(
        weakestFirst[index % weakestFirst.length]
      );
    });
  }
};

module.exports = Towers;
