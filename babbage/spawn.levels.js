const CreepParts = require('creep.parts');

const SpawnLevels = _.map([
  {
    ideal: 1,
    body: [WORK, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 1,
    body: [WORK, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 5,
    body: [WORK, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 10,
    body: [WORK, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 15,
    body: [WORK, CARRY, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 20,
    body: [WORK, CARRY, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 25,
    body: [WORK, CARRY, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 30,
    body: [WORK, CARRY, CARRY, MOVE],
    spawnCount: 1,
    extensionCount: 0,
  }, {
    ideal: 35,
    body: [WORK, CARRY, CARRY, MOVE],
    spawnCount: 2,
    extensionCount: 0,
  }, {
    ideal: 40,
    body: [WORK, CARRY, CARRY, MOVE],
    spawnCount: 3,
    extensionCount: 0,
  }
], (level, rcl) => {
  // process each level
  const extras = {
    renewTicks: Math.floor(600 / level.body.length),
    creepCost: 0,
  };
  extras.requiredEnergy = Math.ceil(
    extras.creepCost / 2.5 / level.body.length
  );
  return Object.assign({}, level, extras);
});

module.exports = SpawnLevels;
