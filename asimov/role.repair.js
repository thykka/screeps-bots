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
    // It should find the nearest flag, move to it, dismantle it, repeat
    /*
    const target = creep.pos.findClosestByRange(FIND_STRUCTURES,
      {filter: {structureType: STRUCTURE_WALL}});
      */
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
};

module.exports = RoleRepair;
