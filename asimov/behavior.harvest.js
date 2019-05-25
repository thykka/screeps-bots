const harvestBehavior = function(creep, byPath = false) {

  let source = false;

  /* Pick up dropped energy. TODO: not working, check how to pick up
  if(!byPath) {
    source = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: o => {return o instanceof Energy; }
    })[0];
  }
  */

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
