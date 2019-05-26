const Towers = {
  run: function run(room, creeps, finder) {
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
    } else {
      for (let name in creeps) {
        // get the creep object
        var creep = creeps[name];
        if (creep.hits < creep.hitsMax) {
          towers.forEach(tower => tower.heal(creep));
        }
      }

      for(var i in towers){
        let tower = towers[i];
        if(tower.energy > ((tower.energyCapacity / 10) * 9)){

          //Find the closest damaged Structure
          const closestDamagedStructure = tower.pos.findClosestByRange(
            FIND_STRUCTURES, {
              filter: (s) => s.hits < s.hitsMax && (
                s.structureType != STRUCTURE_WALL ||
                s.structureType != STRUCTURE_RAMPART
              )
            }
          );
          if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
          }
        }
      }
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
