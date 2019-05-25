const spawnDrone = require('spawn.drone');
const harvestBehavior = require('behavior.harvest');

const findRepairTarget = function(creep, creepIndex = 0) {
  let targets = creep.room.find(FIND_MY_STRUCTURES)
    .filter(o => o.hits < o.hitsMax)
    .sort((a, b) => a.hits - b.hits);

  if(targets.length === 0) {
    targets = creep.room.find(FIND_STRUCTURES)
      .filter(o => ((
        o instanceof StructureWall ||
        o instanceof StructureRampart ||
        o instanceof StructureTower ||
        o instanceof StructureRoad
      ) && o.hits < o.hitsMax ))
      .sort((a, b) => a.hits - b.hits);
  }

  const selectedTarget = targets.length > 1 ?
    targets[creepIndex % (targets.length)] :
    targets[0];

  // Save target ID to memory
  console.log('- ' + creep.name + ': new target: ' + selectedTarget.structureType);
  creep.memory.target = selectedTarget.id;
  return selectedTarget;
};

const RoleRepair = {
  name: 'repair',
  idealCount: 3,
  memory: {
    repairing: false,
    target: false,
  },
  spawn: (spawner, prefix) => spawnDrone(spawner, RoleRepair, [WORK, CARRY, CARRY, MOVE], prefix),
  run: (creep, creepIndex) => {
    // Switch to getting energy
    if(creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }

    // Switch to repairing
    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
      findRepairTarget(creep, creepIndex);
    }

    if(creep.memory.repairing) {
      // Try getting a new target if there's currently none
      if(!creep.memory.target) findRepairTarget(creep, creepIndex);

      // Fetch the actual target
      let target = Game.getObjectById(creep.memory.target);

      // Check if target is still valid
      if(!target || target.hits === target.hitsMax) {
        // Refresh target
        findRepairTarget(creep, creepIndex);
        target = Game.getObjectById(creep.memory.target);
      }

      if(target) {
        const result = creep.repair(target);
        if(result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        } else if(result !== 0) {
          console.log('- ' + creep.name + ' failed: ' + result + ', ' + JSON.stringify(Object.values(target)));
        }
      } else { // no targets whatsoever
        console.log('- ' + creep.name + ': no repair target');
      }
    }
    else { // creep not repairing => harvest more energy
      harvestBehavior(creep);
    }
  }
};

module.exports = RoleRepair;
