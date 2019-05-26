const harvestBehavior = function(creep, byPath = false) {

  let source = false;

  source = creep.room.find(FIND_DROPPED_RESOURCES, {
    filter: (o) => o.resourceType === RESOURCE_POWER || o instanceof Energy
  });

  if(source.length && creep.pickup(source[0]) == ERR_NOT_IN_RANGE){
    creep.moveTo(source[0].pos, { visualizePathStyle: {stroke: '#ffff00' }});
    console.log('- ' + creep.name + ' pickup dropped #1/' + source.length);
    return;
  }

  if(!source) {
    source = byPath ?
      creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE) :
      creep.room.find(FIND_SOURCES)[0];
  }

  if(!source) {
    console.log('- ' + creep.name + ': no harvest target');
  }

  if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
  }
};

module.exports = harvestBehavior;
