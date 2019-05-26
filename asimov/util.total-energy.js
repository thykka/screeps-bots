module.exports = function getTotalEnergy(spawner, finder) {
  const extensionEnergy = finder.find({
    room: spawner.room,
    type: FIND_MY_STRUCTURES,
    filter: o => o instanceof StructureExtension,
  }).reduce((acc, o) => o.energy + acc, 0);
  return extensionEnergy + spawner.energy;
};
