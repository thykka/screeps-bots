const { debugLevel } = require('settings');

const harvestBehavior = function(creep, creepIndex, byPath = false, finder) {

  let source = false;
  let sources = [];

  if(!byPath) { // Try finding dropped energy
    sources = finder.find({
      creep,
      type: FIND_DROPPED_RESOURCES,
      filter: (o) => o.resourceType === RESOURCE_POWER || o instanceof Energy
    });
  }
  if(sources.length > 0) {
    source = sources[creepIndex] ? sources[creepIndex] : false;
    if(creep.pickup(source) == ERR_NOT_IN_RANGE){
      creep.moveTo(source.pos, { visualizePathStyle: {stroke: '#ffff00' }});
      if(debugLevel > 1) {
        console.log('# ' + creep.name + ' pickup dropped #1/' + sources.length);
      }
    }
  }
  if(!source) { // No dropped energy, find sources instead
    if(byPath) {
      sources = _.sortBy(finder.find({ creep, type: FIND_SOURCES }), s => creep.pos.getRangeTo(s));
      source = sources[0];
    } else {
      sources = _.sortBy(finder.find({ creep, type: FIND_SOURCES_ACTIVE }), s => creep.pos.getRangeTo(s));
      source = sources[0];
    }

    if(!source && debugLevel > 0) {
      console.log('# ' + creep.name + ': no harvest target');
    }

    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, {visualizePathStyle: {stroke: '#ffff00'}});
    }
  }
};

module.exports = harvestBehavior;
