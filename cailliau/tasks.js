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
    this.target = this.findTarget(creep);
    this.storeTaskData(creep);
  }
  /**
   * Placeholder method for finding the task's target
   * @param {Creep} creep - The creep performing this task
   */
  findTarget(creep) {
    return false;
  }
  /**
   * Stores task data into creep's memory
   * @param {Creep} creep - The creep performing this task
   */
  storeTaskData(creep) {
    creep.memory.task = this.type;
    if(this.target) {
      creep.memory.target = this.target.id;
    }
  }
  /**
   * Returns a function which, when run, performs the task
   * @param {Creep} creep - The creep performing this task
   * @returns {function|false} - The task action
   */
  getRunAction(creep) {
    return false;
  }

  /**
   * Returns a function which, when run, performs an action
   * that checks whether the task has completed.
   * @param {Creep} creep - The creep performing this task
   * @returns {function|false} - The task finish check action
   */
  getFinishAction(creep) {
    return false;
  }


  /**
   * Returns a function which, when run, performs an action
   * that performs any post-task actions, such as memory cleanup
   * @param {Creep} creep - The creep performing this task
   * @returns {function|false} - The task finish check action
   */
  getEndAction(creep) {
    return () => this.end(creep);
  }
  /**
   *
   */
  end(creep) {
    console.log('Task ended: ' + this.type);
    // TODO: make task end.
    this.clearTaskData(creep);
  }
  /**
   * Resets any task-related keys from creep's memory.
   * @param {Creep} creep - The creep performing this task
   */
  clearTaskData(creep) {
    delete creep.memory.task;
    delete creep.memory.target;
  }
}




class HarvestTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'Harvest';
  }
  findTarget(creep) {
    return creep.room.find(FIND_SOURCES_ACTIVE)[0];
  }
  getRunAction(creep) {
    let target = Game.getObjectById(creep.memory.target);
    if(!target) {
      target = this.findTarget(creep);
      if(!target) return false;
      creep.memory.target = target.id;
    }
    return creep.Harvest({ target });
  }
}
Tasks.Harvest = new HarvestTask();




class UnloadTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'Unload';
  }
  findTarget(creep) {
    let target = false;
    if(creep.memory.spawn) target = Game.getObjectById(creep.memory.spawn);
    return target;
  }
  getRunAction(creep) {
    let target = Game.getObjectById(creep.memory.target);
    if(!target) {
      target = this.findTarget(creep);
      if(!target) return false;
      creep.memory.target = target.id;
    }
    return creep.Unload({ target });
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
    creep.memory.target = target.id;
  }

  findHarvestTarget(creep) {
    return Tasks.Harvest.findTarget(creep);
  }

  findUnloadTarget(creep) {
    return Tasks.Unload.findTarget(creep);
  }

  getRunAction(creep) {
    return () => {
      const mode = creep.memory.mode;
      if(mode === 'Unload') {
        return Tasks.Unload.getRunAction(creep)();
      } else if (mode === 'Harvest') {
        return Tasks.Harvest.getRunAction(creep)();
      }
    };
  }

  getFinishAction(creep) {
    return (result) => {
      const creepFull = creep.carry.energy / creep.carryCapacity;
      if(
        this.mode !== 'Unload' &&
        creepFull >= 1
      ) {
        creep.memory.mode = 'Unload';
        creep.memory.target = this.findUnloadTarget(creep).id;
      } else if(
        this.mode !== 'Harvest' &&
        creep.carry.energy == 0
      ) {
        creep.memory.mode = 'Harvest';
        creep.memory.target = this.findHarvestTarget(creep).id;
      }
    };
  }
}
Tasks.BasicHarvest = new BasicHarvestTask();

class StaticHarvestTask extends Task {
  constructor(options = {}) {
    super(options);
    this.type = 'StaticHarvest';
  }

  begin(creep) {
    creep.memory.task = this.type;
    creep.memory.mode = 'Await';
  }

  // TODO: finish class
}
Tasks.StaticHarvest = new StaticHarvestTask();


global.Tasks = Tasks;
module.exports = Tasks;
