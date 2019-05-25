const HarvestBehavior = function(creep, byPath = false) {
  let sources = byPath ?
    creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE) :
    creep.room.find(FIND_SOURCES_ACTIVE);

  if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffff00'}});
  }
};

module.exports = HarvestBehavior;
