require('spawn.methods'); // StructureSpawn prototype additions
const SpawnLevels = require('spawn.levels');

module.exports.loop = function loopSpawn(opts) {
  _.forEach(Game.spawns, (spawn => {
    // get extensions from memory or cache
    const extensions = spawn.loadExtensions();

    // Check spawn energy
    const energy = spawn.getRoomEnergy(extensions);
    const minEnergyToSpawn = 300;

    // Spawn a creep if there's none left
    if(energy >= minEnergyToSpawn && _.size(Game.creeps) === 0) {
      spawn.newCreep();
    }

    if(!spawn.spawning) {
      spawn.renewCreeps();

      if(energy >= minEnergyToSpawn) {
        const creepCount = _.size(Game.creeps);
        const currentLevel = spawn.room.controller.level;
        const level = SpawnLevels[currentLevel];

        if(level.ideal && creepCount < level.ideal) {
          spawn.newCreep({ level: currentLevel });
        }

      } else if (Game.time % 1 === 0) {
        spawn.visualizeEnergy(energy, minEnergyToSpawn);
      }
    }
  }));
};
