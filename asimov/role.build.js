const RoleBuild = {
  name: 'build',
  idealCount: 1,
  spawn: (spawner) => {
    spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      'Build1', {
        memory: {
          role: RoleBuild.name,
          working: false
        }
      }
    );
  },
  run: (creep) => {
    if(creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('b: harvest');
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('b: build');
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
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
  }
};

module.exports = RoleBuild;
