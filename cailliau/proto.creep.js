const Tasks = require('tasks');

const Errors = {
  '-1': 'not owner',
  '-2': 'no path',
  '-3': 'name exists',
  '-4': 'busy',
  '-5': 'not found',
  '-6': 'not enough (energy/extenstions/resources)',
  '-7': 'invalid target',
  '-8': 'full',
  '-9': 'not in range',
  '-10': 'invalid args',
  '-11': 'tired',
  '-12': 'no bodypart',
  '-14': 'rcl not enough',
  '-15': 'gcl not enough',
};

/**
 * Give or change a creep's task
 * @param {Task} - the task to assign
 */
Creep.prototype.setTask = function setTask(task) {
  task.begin(this);
};

Creep.prototype.getTaskActions = function getTaskActions() {
  const task = Tasks[this.memory.task];
  if(task) {
    return {
      run: task.getRunAction(this),
      finish: task.getFinishAction(this),
      end: task.getEndAction(this),
    };
  }
  return false;
};

Creep.prototype.runTask = function runTask() {
  const { run, finish, end } = this.getTaskActions();
  if(typeof run !== 'function') { throw new Error('Task gave no run ation'); }

  let runResult, finishTask;
  runResult = run(); // usually the exit code of a native Screeps method

  if(typeof finish === 'function') {
    finishTask = finish(runResult);
  }
  if(finishTask) {
    if(typeof end === 'function') {
      end(finishTask);
    } else {
      this.clearTask();
    }
  }
};

Creep.prototype.clearTask = function clearTask() {
  this.memory.task = false;
};

Creep.prototype.MoveNear = function MoveNear(opts) {
  /* TODO: optimize later
  const path = this.findPathTo(x, y, {
    maxOps: 1000
  });
  */
  const { target } = opts;
  let x = target.pos.x;
  let y = target.pos.y;

  return () => {
    const moveResult = this.moveTo(x, y, {
      reusePath: 8,
      visualizePathStyle: {
        stroke: '#ED0',
        opacity: 1,
        lineStyle: 'solid',
        strokeWidth: 0.06125,
      }
    });
    if(moveResult) console.log(this, Errors[moveResult]);
    return moveResult;
  };
};
Creep.prototype.Harvest = function Harvest(opts) {
  //  Worker should start a MoveNear(Creep, Source) task, then Harvest(Source) task
  const { target } = opts;
  const moveFn = this.MoveNear({ target });
  return () => {
    const harvestResult = this.harvest(target);
    if(harvestResult == ERR_NOT_IN_RANGE) {
      moveFn();
    }
    if(harvestResult) console.log(this, Errors[harvestResult]);
    return harvestResult;
  };
};

Creep.prototype.Unload = function Unload(opts) {
  //  Worker should start a MoveNear(Creep, Spawn) task, then Empty(Spawn) task
  const { target } = opts;
  const moveFn = this.MoveNear({ target });
  return () => {
    const transferResult = this.transfer(target, RESOURCE_ENERGY);
    if(transferResult == ERR_NOT_IN_RANGE) {
      moveFn();
    } else if(transferResult == ERR_NOT_ENOUGH_RESOURCES) {
      // stop unloading
    } else if(transferResult == ERR_FULL) {
      // find another target
    } else if(transferResult) {
      console.log(this, Errors[transferResult]);
    }
    return transferResult;
  };
};

Creep.prototype.PlainHarvest = function PlainHarvest(Creep, Source, Targets) {
  //  if Creep is Full and Harvesting > Creep.Unload(Creep, Targets.closest)
  //  if Creep is Empty and not Harvesting > Creep.Harvest(Creep, Source)

  // if(this.carry.energy === 0) {

  // } else if(this.carry.energy >= )
};
