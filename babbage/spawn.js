StructureSpawn.prototype.getRoomEnergy = function getRoomEnergy(extensions) {
  return this.energy + extensions.reduce((acc, o) => o.energy + acc, 0);
};

module.exports.loop = function loopSpawn(opts) {
  _.forEach(Game.spawns, (spawn => {

    const roomExtensions = this.room.find(FIND_MY_STRUCTURES, {
      filter: o => o instanceof StructureExtension
    });

    console.log(
      spawn.name + ': ' +
      spawn.getRoomEnergy(roomExtensions)
    );
  }));
};
