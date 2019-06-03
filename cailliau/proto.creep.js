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

Creep.prototype.chatty = true;

/**
 * Give or change a creep's task
 * @param {Task} - the task to assign
 */
Creep.prototype.setTask = function setTask(task) {
  // end existing task
  if(this.memory.task) {
    const oldTask = Tasks[this.memory.task];
    if(oldTask) {
      try {
        oldTask.end.bind(oldTask)(this);
      } catch(e) { console.log(this.name + 'ending old task'); }
    }
  }
  this.say(task.type);
  try {
    task.begin.bind(task)(this);
  } catch(e) { console.log(this.name + ' task initialization', e); }
};


Creep.prototype.runTask = function runTask() {
  const task = Tasks[this.memory.task];
  if(!task) { console.log(this.name + ' has no task'); return false; }
  const { run, finish, end } = task;

  let runResult, shouldEnd;
  try {
    runResult = run.bind(task)(this);
  } catch(e) { console.log('Task.run', e); }
  try {
    shouldEnd = finish.bind(task)(this, runResult);
  } catch(e) { console.log('Task.finish', e); }
  if(shouldEnd) {
    try {
      end.bind(task)(this);
    } catch(e) { console.log('Task.end', e); }
  }
};

Creep.prototype.MoveNear = function MoveNear(opts) {
  const { target, color } = opts;
  let x = target.pos.x;
  let y = target.pos.y;

  const moveResult = this.moveTo(x, y, {
    reusePath: 8,
    visualizePathStyle: {
      stroke: color || '#000',
      opacity: 1,
      lineStyle: 'dotted',
      strokeWidth: 0.06125,
    }
  });
  return moveResult;

};
Creep.prototype.Harvest = function Harvest(opts) {
  const { target } = opts;
  const harvestResult = this.harvest(target);
  if(harvestResult == ERR_NOT_IN_RANGE) {
    this.MoveNear({ target, color: '#FF0' });
  }
  return harvestResult;
};

Creep.prototype.Unload = function Unload(opts) {
  const { target } = opts;
  const transferResult = this.transfer(target, RESOURCE_ENERGY);
  if(transferResult == ERR_NOT_IN_RANGE) {
    this.MoveNear({ target, color: '#888' });
  }
  return transferResult;
};

Creep.prototype.Construct = function Construct(opts) {
  const { target } = opts;
  const buildResult = this.build(target);
  if(buildResult == ERR_NOT_IN_RANGE) {
    this.MoveNear({ target, color: '#EA0' });
  }
  return buildResult;
};

Creep.prototype.Pickup = function Pickup(opts) {
  const { target } = opts;
  const pickupResult = this.pickup(target);
  if(pickupResult === ERR_NOT_IN_RANGE) {
    this.MoveNear({ target, color: '#BB0' });
  }
  return pickupResult;
};

Creep.prototype.DragTargetTo = function DragTargetTo(opts) {
  const { target, destination } = opts;

  if(!target.pos.isNearTo(destination)) {
    let moveResult;
    let pullResult = this.pull(target);

    if(pullResult == ERR_NOT_IN_RANGE) {
      moveResult = this.MoveNear({ target, color: '#C04' });
    } else if (pullResult == 0) {
      target.move(this);
      if(!this.pos.isNearTo(destination)) {
        // move towards destination
        moveResult = this.MoveNear({ target: destination, color: '#FFF' });
      } else {
        // Swap places with target
        moveResult = this.move(this.pos.getDirectionTo(target));
      }
    }

    return pullResult || moveResult;

  } // target is near destination
  return 'FINISH';
};
