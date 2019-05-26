const harvestBehavior = function(creep, byPath = false) {

  let source = false;

  sources = creep.room.find(FIND_DROPPED_RESOURCES, {
    filter: (o) => o.resourceType === RESOURCE_POWER || o instanceof Energy
  });

  if(sources.length === 0) {
    source = byPath ?
      creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE) :
      creep.room.find(FIND_SOURCES)[0];
  }

  if(!source && !sources.length) {
    console.log('- ' + creep.name + ': no harvest target');
  }

  if(sources.length > 0 && creep.pickup(sources[0]) == ERR_NOT_IN_RANGE){
    creep.moveTo(sources[0].pos, { visualizePathStyle: {stroke: '#ffff00' }});
    console.log('- ' + creep.name + ' pickup dropped #1/' + sources.length);
  }
  if(sources.length === 0 && creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
  }
};

module.exports = harvestBehavior;
