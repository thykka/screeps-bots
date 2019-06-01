const Errors = {
  '-1': 'NOT_OWNER',
  '-2': 'NO_PATH',
  '-3': 'NAME_EXISTS',
  '-4': 'BUSY',
  '-5': 'NOT_FOUND',
  '-6': 'NOT_ENOUGH_(ENERGY/EXTENSTIONS/RESOURCES)',
  '-7': 'INVALID_TARGET',
  '-8': 'FULL',
  '-9': 'NOT_IN_RANGE',
  '-10': 'INVALID_ARGS',
  '-11': 'TIRED',
  '-12': 'NO_BODYPART',
  '-14': 'RCL_NOT_ENOUGH',
  '-15': 'GCL_NOT_ENOUGH',
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
    }
    if(transferResult) console.log(this, Errors[transferResult]);
    return transferResult;
  };
};

Creep.prototype.PlainHarvest = function PlainHarvest(Creep, Source, Targets) {
  //  if Creep is Full and Harvesting > Creep.Unload(Creep, Targets.closest)
  //  if Creep is Empty and not Harvesting > Creep.Harvest(Creep, Source)

  // if(this.carry.energy === 0) {

  // } else if(this.carry.energy >= )
};
