const { debugLevel, bodyLevels } = require('settings');
const spawnDrone = require('spawn.drone');
const harvestBehavior = require('behavior.harvest');
const RoleRepair = {
  name: 'repair',
  idealCount: 4,
  memory: {
    repairing: false,
    target: false,
  },
  spawn: (spawner, prefix, level = 0) => spawnDrone(spawner, RoleRepair, bodyLevels[level][RoleRepair.name], prefix),
  run: (creep, creepIndex, finder) => {
    // Switch to getting energy
    if(creep.memory.repairing && creep.carry.energy == 0) {
      creep.memory.repairing = false;
    }

    // Switch to repairing
    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repairing = true;
      findRepairTarget(creep, creepIndex, finder);
    }

    if(creep.memory.repairing) {
      // Try getting a new target if there's currently none
      if(!creep.memory.target) findRepairTarget(creep, creepIndex, finder);

      // Fetch the actual target
      let target = Game.getObjectById(creep.memory.target);

      // Check if target is still valid
      if(!target || target.hits === target.hitsMax) {
        // Refresh target
        findRepairTarget(creep, creepIndex, finder);
        target = Game.getObjectById(creep.memory.target);
      }

      if(target) {
        const result = creep.repair(target);
        if(result == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        } else if(result !== 0) {
          console.log('# ' + creep.name + ' failed: ' + result + ', ' + JSON.stringify(Object.values(target)));
        }
      } else { // no targets whatsoever
        if(debugLevel > 1) {
          console.log('# ' + creep.name + ': no repair target');
        }
      }
    }
    else { // creep not repairing => harvest more energy
      harvestBehavior(creep, creepIndex, false, finder);
    }
  }
};

function findRepairTarget(creep, creepIndex = 0, finder) {
  let targets = finder.find({
    creep,
    type: FIND_MY_STRUCTURES,
    filter: o => o.hits < o.hitsMax
  }).sort((a, b) => a.hits - b.hits);

  if(targets.length === 0) {
    targets = finder.find({
      creep,
      type: FIND_STRUCTURES,
      filter: o => ((
        o instanceof StructureWall ||
        o instanceof StructureRampart ||
        o instanceof StructureTower ||
        o instanceof StructureRoad ||
        o instanceof StructureRampart ||
        o instanceof StructureContainer ||
        o instanceof StructureTerminal
      ) && o.hits < o.hitsMax )
    }).sort((a, b) => a.hits - b.hits);
  }


  const selectedTarget = targets.length > 1 ?
    targets[creepIndex % targets.length] :
    targets[0];

  if(selectedTarget) {
    // Save target ID to memory
    creep.memory.target = selectedTarget.id ? selectedTarget.id : false;

    if(debugLevel > 1) {
      console.log(
        '# ' + creep.name + ': new target: ' + selectedTarget.structureType +
        ' (' + (creepIndex % targets.length) + '/' + (targets.length - 1) + ')'
      );
    }
  } else { creep.memory.target = false; }

  return selectedTarget;
}

module.exports = RoleRepair;
