const Renew = require('renew');
StructureSpawn.prototype.renewCreeps = Renew.renewCreeps;

StructureSpawn.prototype.getRoomEnergy = function getRoomEnergy(extensions) {
  if(!Array.isArray(extensions)) extensions = this.loadExtensions();
  return !extensions.length ? this.energy :
    this.energy + extensions.reduce((acc, o) => o.energy + acc, 0);
};

StructureSpawn.prototype.newCreep = function newCreep(opts) {
  const defs = {
    body: [WORK, CARRY, MOVE],
    name: (Date.now().toString(32).slice(-2)),
    task: false,
    home: this.room.name,
  };
  const c = Object.assign({}, defs, opts);

  const result = this.spawnCreep(c.body, c.name, {
    memory: {
      home: c.home,
      task: c.task,
      spwn: this.id,
    }
  });

  if(!result) {
    return Game.creeps[c.name];
  }
  console.log(this.name + ' - failed spawning creep ' + c.name + ': ' + result);
};

StructureSpawn.prototype.getAdjacentCreeps = function getAdjacentCreeps() {
  const minX = this.pos.x-1;
  const minY = this.pos.y-1;
  const maxX = this.pos.x+1;
  const maxY = this.pos.y+1;

  return this.room.find(FIND_MY_CREEPS, {
    filter: c => (
      c.pos.x >= minX && c.pos.x <= maxX &&
      c.pos.y >= minY && c.pos.y <= maxY
    )
  });
};

StructureSpawn.prototype.visualizeEnergy = function visualizeEnergy(energy = -1, minEnergy = 1) {
  const percentage = 100 * (energy / minEnergy);
  new RoomVisual(this.room).text(
    `${ energy }/${ minEnergy } ${ percentage.toFixed(0) }%`,
    this.pos.x, this.pos.y + 1.2,
    { font: 0.3, color: '#FF0', }
  );
};

const CreepParts = require('creep.parts');
StructureSpawn.prototype.getPrice = function getPrice(body) {
  return body.reduce((sum, part) => sum + CreepParts[part.toUpperCase()].cost, 0);
};

StructureSpawn.prototype.loadExtensions = function loadExtensions(update = false) {
  let extensions = this.memory.extensions;
  let extensionArr = [];

  if(!update && typeof extensions==='string') {
    if(extensions.indexOf('|') >= 0) {
      extensionArr = extensions.split('|').map(extId => Game.getObjectById(extId));
    } else {
      extensionArr = [ Game.getObjectById(extensions) ];
    }
  } else {
    extensionArr = this.room.find(FIND_MY_STRUCTURES, {
      filter: o => o instanceof StructureExtension
    });
    this.memory.extensions = extensionArr.map(ext => ext.id).join('|');
  }

  return extensionArr.filter(ext => !!ext);
};
