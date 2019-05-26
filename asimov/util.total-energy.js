module.exports = function getTotalEnergy(spawner, finder, includeMax = false) {
  const extensions = finder.find({
    room: spawner.room,
    type: FIND_MY_STRUCTURES,
    filter: o => o instanceof StructureExtension,
  });
  const max = includeMax ?
    spawner.energyCapacity + extensions.reduce((acc, o) => o.energyCapacity + acc, 0) :
    null;
  return {
    energy: spawner.energy + extensions.reduce((acc, o) => o.energy + acc, 0),
    max
  };
};
