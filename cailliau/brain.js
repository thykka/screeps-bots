const Roles = require('roles');
const Tasks = require('tasks');

function Brain(options) {
  const defaults = {
    homeRoom: Game.rooms.sim || null,
    canSpawn: false,
  };
  Object.assign(this, defaults, options);
  if(!this._rooms) this._rooms = this.getMyRooms();
  if(!this._spawns) this._spawns = this.getMySpawns();
  if(!this._creeps) this._creeps = this.getMyCreeps();
  return this;
};

Brain.prototype.loop = function brainLoop() {
  const energyLevel = this.homeRoom.getEnergyReady();
  this._creeps = this.getMyCreeps();
  this._miners = this._creeps.filter(c => c.memory.task === 'StaticHarvest');

  if(energyLevel < 1) {
    if(this.canSpawn) this.canSpawn = false;
    // console.log(`homeRoom energy: ${ (energyLevel * 100).toFixed(1) }%`);
  } else if(!this.canSpawn) {
    this.canSpawn = true;
  }
  if(this.canSpawn) {
    this.spawnOpportunity();
  }


  const spawn = this._spawns[0];
  if(
    this._miners.length > 0 &&
    this._miners.find(miner => miner.memory.mode === 'Await') &&
    !this._creeps.find(c => c.memory.task === 'Drag')
  ) {
    const worker = this._creeps.find(c => c.memory.task === 'BasicHarvest' || c.memory.task === 'PickupEnergy');
    if(worker) {
      // Move static miner to position
      worker.setTask(Tasks.Drag);
    }
  }

  // if(this._creeps.length >= 2) {
  //   spawn.renewCloseby();
  // }

  this._creeps.forEach(creep => {
    if(creep.memory._task) {
      creep.memory.task = creep.memory._task;
      creep.setTask(Tasks[creep.memory.task]);
      delete creep.memory._task;
    }
    if(!creep.memory.task) {
      creep.setTask(Tasks.PickupEnergy);
    }

    creep.runTask();
  });
};

Brain.prototype.getMyRooms = function getMyRooms() {
  return _.filter(Game.rooms, room => room.controller && room.controller._my);
};

Brain.prototype.getMySpawns = function getMySpawns() {
  return _.flatten(_.map(this._rooms, room => room.find(FIND_MY_SPAWNS)));
};

Brain.prototype.getMyCreeps = function getMyCreeps() {
  return _.flatten(_.map(this._rooms, room => room.find(FIND_MY_CREEPS)));
};

Brain.prototype.spawnOpportunity = function spawnOpportunity() {
  const spawn = this._spawns[0];
  if(!spawn.spawning) {
    const RCL = this.homeRoom.controller.level;
    const creepCount = this._creeps.length;
    let spawnResult;

    if(RCL <= 1) {
      const starters = this._creeps.filter(c => c.memory.task === 'BasicHarvest');
      if(this._creeps.length === 0) {
        spawnResult = spawn.newCreep(Roles.worker, Tasks.BasicHarvest);
      } else if(this._creeps.length === 1) {
        spawnResult = spawn.newCreep(Roles.miner, Tasks.StaticHarvest);
      } else if(this._creeps.length < 3) {
        spawnResult = spawn.newCreep(Roles.worker, Tasks.PickupEnergy);
      }
    } else if (RCL > 1) {
      if(this._miners.length === 0) {
        spawnResult = spawn.newCreep(Roles.miner, Tasks.StaticHarvest);
      } else if(creepCount < (RCL * 4)) {
        spawnResult = spawn.newCreep(Roles.worker, Tasks.PickupEnergy);
      }
    }
    if(spawnResult == 0) this.canSpawn = false;
  }
};


module.exports = Brain;
