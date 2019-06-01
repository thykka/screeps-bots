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

  if(energyLevel < 1) {
    if(this.canSpawn) this.canSpawn = false;
    console.log(`homeRoom energy: ${ (energyLevel * 100).toFixed(1) }%`);
  } else if(!this.canSpawn) {
    this.canSpawn = true;
    console.log(`homeRoom can spawn: ${ this._spawns }`);
  }
  if(this.canSpawn) {
    this.spawnOpportunity();
  }

  this.getMyCreeps().forEach(creep => {
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
    if(RCL <= 1) {
      const creepCount = this._creeps.length;
      let spawnResult;
      if(creepCount === 0) {
        spawnResult = spawn.newCreep(Roles.worker, Tasks.BasicHarvest);
      }
      if(creepCount === 1) {
        spawnResult = spawn.newCreep(Roles.miner, Tasks.StaticHarvest);
      }
      if(creepCount === 2) {
        // Hey hey, let's not get ahead of ourselves!
      }
      if(spawnResult == 0) this.canSpawn = false;
    }
  }
};


module.exports = Brain;
