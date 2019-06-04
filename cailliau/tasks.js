const Tasks = {};

/**
 * Base class for tasks.
 */
class Task {
  /**
   * @param {*} [options] -
   */
  constructor(options = {}) {
    this.type = '???';
    this.target = false;
    Object.assign(this, options);
  }

  /**
   * Assigns this task to a given creep.
   * @param {Creep} creep - The creep performing this task
   */
  begin(creep) {
    creep.memory.task = this.type;
  }

  /**
   * Returns a function which, when run, performs the task
   * @param {Creep} creep - The creep performing this task
   * @returns {function|false} - The task action
   */
  run(creep) {
    return false;
  }

  /**
   * Returns a function which, when run, performs an action
   * that checks whether the task has completed.
   * @param {Creep} creep - The creep performing this task
   * @returns {function|false} - The task finish check action
   */
  finish(creep) {
    return true;
  }


  /**
   * Returns a function which, when run, performs an action
   * that performs any post-task actions, such as memory cleanup
   * @param {Creep} creep - The creep performing this task
   * @returns {function|false} - The task finish check action
   */
  end(creep) {
    delete creep.memory.task;
    delete creep.memory.mode;
    delete creep.memory.target;
    delete creep.memory.destination;
  }
}




class HarvestTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'Harvest';
  }
  run(creep) {
    let target = Game.getObjectById(creep.memory.target);
    if(!target) {
      target = this.findTarget(creep);
      if(!target) return false;
    }
    return creep.Harvest({ target });
  }
  findTarget(creep) {
    let target = false;
    const targets = creep.room.find(FIND_SOURCES_ACTIVE);
    if(targets.length > 0) target = targets[0];
    creep.memory.target = target ? target.id : false;
    return target;
  }
}
Tasks.Harvest = new HarvestTask();




class UnloadTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'Unload';
  }

  run(creep) {
    let target = Game.getObjectById(creep.memory.target);
    if(!target) target = this.findTarget(creep);
    if(!target) return;

    if(target instanceof ConstructionSite) {
      return creep.Construct({ target });
    }
    return creep.Unload({ target });
  }

  findTarget(creep) {
    let target = this.findSpawnTarget(creep);
    if(!target) target = this.findConstructionTarget(creep);
    if(!target) target = this.findStructureTarget(creep);
    creep.memory.target = target ? target.id : false;
    return target;
  }

  findSpawnTarget(creep) {
    let target = false;
    if(creep.memory.spawn) target = Game.getObjectById(creep.memory.spawn);
    if(target.energy == target.energyCapacity) {
      return false;
    }
    return target;
  }

  findConstructionTarget(creep) {
    const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if(targets.length > 0) {
      return targets.sort((a, b) => b.progress - a.progress)[0];
    }
    return false;
  }

  findStructureTarget(creep) {
    let target = false;
    const targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: s => (
        s.structureType === STRUCTURE_CONTROLLER ||
        (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity)
      )
    });
    // Extensions first, then controller
    if(targets.length > 0) target = targets.sort((a, b) => a.energy && b.energy ? a.energy - b.energy : -1)[0];
    return target;
  }
}
Tasks.Unload = new UnloadTask();




class BasicHarvestTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'BasicHarvest';
  }

  begin(creep) {
    creep.memory.task = this.type;
    creep.memory.mode = 'Harvest';
    let target = this.findHarvestTarget(creep);
    creep.memory.target = target ? target.id : false;
  }

  run(creep) {
    const mode = creep.memory.mode;
    if(mode === 'Unload') {
      return Tasks.Unload.run(creep);
    } else if (mode === 'Harvest') {
      return Tasks.Harvest.run(creep);
    }
  }

  finish(creep, result) {
    const mode = creep.memory.mode;
    const creepFull = creep.carry.energy / creep.carryCapacity;
    let target = false;
    if(
      mode !== 'Unload' &&
      creepFull >= 1
    ) {
      creep.memory.mode = 'Unload';
      target = this.findUnloadTarget(creep);
    } else if(
      mode !== 'Harvest' &&
      creep.carry.energy == 0
    ) {
      creep.memory.mode = 'Harvest';
      target = this.findHarvestTarget(creep);
    }
    if(target) creep.memory.target = target.id;
  }

  findHarvestTarget(creep) {
    return Tasks.Harvest.findTarget(creep);
  }

  findUnloadTarget(creep) {
    return Tasks.Unload.findTarget(creep);
  }
}
Tasks.BasicHarvest = new BasicHarvestTask();

class DragTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'Drag';
  }

  begin(creep) {
    creep.memory.task = this.type;
    const target = this.findAwaitingTarget(creep);
    if(target) this.findDragDestination(creep, target);
  }

  findAwaitingTarget(creep) {
    let target = false;
    const targets = creep.room.find(FIND_MY_CREEPS, {
      filter: c => (c.memory.mode == 'Await')
    });
    if(targets.length > 0) target = targets[0];
    creep.memory.target = target ? target.id : false;
    return target;
  }

  findDragDestination(creep, target) {
    let destination = false;
    if(target.memory.target) {
      destination = Game.getObjectById(target.memory.target);
    }
    creep.memory.destination = destination ? destination.id : false;
    return destination;
  }

  run(creep) {
    let target = Game.getObjectById(creep.memory.target);
    if(!target) target = this.findAwaitingTarget(creep);

    let destination = Game.getObjectById(creep.memory.destination);
    if(!destination && target) destination = this.findDragDestination(target);

    return creep.DragTargetTo({
      target, destination
    });
  }

  finish(creep, result) {
    if(result === ERR_TIRED) {

    } else if(
      result === 'FINISH'
    ) {
      // All done!
      return true;
    }
  }
}
Tasks.Drag = new DragTask();

// TODO: finish static harvest classes
class StaticHarvestTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'StaticHarvest';
  }

  begin(creep) {
    creep.memory.task = this.type;
    const target = this.findHarvestTarget(creep);
    creep.memory.target = target ? target.id : false;
  }

  findHarvestTarget(creep) {
    return Tasks.Harvest.findTarget(creep);
  }

  run(creep) {
    let target = Game.getObjectById(creep.memory.target);
    if(!target) {
      target = this.findHarvestTarget(creep);
      creep.memory.target = target ? target.id : false;
    }
    if(creep.pos.isNearTo(target)) {
      if(creep.memory.mode == 'Await') {
        delete creep.memory.mode;
      }
      const dropped = creep.pos.lookFor(LOOK_RESOURCES);
      if(dropped.length > 0) {
        new RoomVisual(creep.room.name).text(
          `${dropped[0].amount}`, creep.pos.x, creep.pos.y + 0.5
        );
      }
      return creep.Harvest({ target });
    } else {
      creep.memory.mode = 'Await';
      return 'WAIT';
    }
  }

  finish(creep, result) {
    // maybe get pulled to spawn for refrsh?
    return false;
  }

}
Tasks.StaticHarvest = new StaticHarvestTask();



class PickupEnergyTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'PickupEnergy';
  }

  begin(creep) {
    creep.memory.task = this.type;
    creep.memory.mode = 'Pickup';
    let target = this.findPickupTarget(creep);
    creep.memory.target = target ? target.id : false;
  }

  findPickupTarget(creep) {
    let result = false;
    const results = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: r => r.resourceType === RESOURCE_ENERGY
    }).sort((a, b) => {
      return a.amount - b.amount;
    });
    if(results.length > 0) {
      result = results[0];
    } else {
      // No dropped resources
    }
    creep.memory.target = result ? result.id : false;
    return result;
  }

  findUnloadTarget(creep) {
    const target = Tasks.Unload.findTarget(creep);
    if(target) creep.memory.target = target ? target.id : false;
    return target;
  }

  run(creep) {
    const mode = creep.memory.mode;
    if(mode === 'Unload') {
      return Tasks.Unload.run(creep);
    } else if(mode === 'Pickup') {
      let target = Game.getObjectById(creep.memory.target);
      if(!target) target = this.findPickupTarget(creep);
      return creep.Pickup({ target });
    } else {
      throw new Error('Wat u doin..' + mode);
    }
  }

  finish(creep, result) {
    const mode = creep.memory.mode;
    let newTarget = false;
    if(mode === 'Pickup') {
      const creepFull = creep.carry.energy / creep.carryCapacity;
      if(creepFull >= 1) {
        creep.memory.mode = 'Unload';
        newTarget = this.findUnloadTarget(creep);
      }
    } else if (mode === 'Unload') {
      if(result === ERR_FULL) {
        newTarget = this.findUnloadTarget(creep);
      }
      if(creep.carry.energy == 0) {
        creep.memory.mode = 'Pickup';
        newTarget = this.findPickupTarget(creep);
      }
    }
    if(newTarget) creep.memory.target = newTarget ? newTarget.id : false;
  }
}
Tasks.PickupEnergy = new PickupEnergyTask();


global.Tasks = Tasks;
module.exports = Tasks;
