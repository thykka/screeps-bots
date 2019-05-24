const RoleDig = {
  name: 'dig',
  idealCount: 0,
  spawn: (spawner) => {
    spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      'dig1', {
        memory: {
          role: RoleDig.name,
          working: false
        }
      }
    );
  },
  run: (creep) => {
    // It should find the nearest flag, move to it, dismantle it, repeat
    /*
    const target = creep.pos.findClosestByRange(FIND_STRUCTURES,
      {filter: {structureType: STRUCTURE_WALL}});
      */
    const target = Object.values(Game.flags)[0];
    if(target) {
      const notCloseToFlag = creep.dismantle(target) == ERR_NOT_IN_RANGE;
      if(notCloseToFlag) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      } else { console.log('! dig failed: ' + notCloseToFlag); }
    }
    /*
    if(creep.memory.digging && creep.carry.energy == 0) {
      creep.memory.digging = false;
      creep.say('b: harvest');
    }
    if(!creep.memory.digging && creep.carry.energy == creep.carryCapacity) {
      creep.memory.digging = true;
      creep.say('b: digg');
    }

    if(creep.memory.digging) {
      var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.digg(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff8800'}});
        }
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0088'}});
      }
    }
    */
  }
};

module.exports = RoleDig;
