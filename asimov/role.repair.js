const RoleRepair = {
  name: 'repair',
  idealCount: 0,
  spawn: (spawner) => {
    spawner.spawnCreep(
      [WORK, MOVE, CARRY],
      'repair1', {
        memory: {
          role: RoleRepair.name,
          working: false
        }
      }
    );
  },
  run: (creep) => {
    if(creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
      creep.say('r: harvest');
    }
    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
      creep.say('r: repair');
    }

    if(creep.memory.repairing) {
      const flag = Object.values(Game.flags)[0];
      console.log('flag: ' + JSON.stringify(flag ? flag.pos : flag));
      const target = flag ? creep.room.find(FIND_MY_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      }) : false;
      console.log('target: ' + JSON.stringify(target));
      if(target) {
        const result = creep.repair(target);
        if(result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        } else { console.log('! repair failed: ' + result + ' Flag: ' + JSON.stringify(target)); }
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

module.exports = RoleRepair;
