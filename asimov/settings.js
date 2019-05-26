const bodyLevels = {
  0: {
    harvest: [WORK, CARRY, MOVE],
    build: [WORK, CARRY, MOVE],
    upgrade: [WORK, CARRY, MOVE],
    repair: [WORK, CARRY, MOVE],
  },
  1: {
    harvest: [WORK, WORK, CARRY, MOVE],
    build: [WORK, CARRY, CARRY, MOVE],
    upgrade: [WORK, CARRY, CARRY, MOVE],
    repair: [WORK, CARRY, CARRY, MOVE],
  },
  2: {
    harvest: [WORK, WORK, CARRY, MOVE, MOVE],
    build: [WORK, CARRY, CARRY, MOVE, MOVE],
    upgrade: [WORK, CARRY, CARRY, MOVE, MOVE],
    repair: [WORK, CARRY, CARRY, MOVE, MOVE],
  },
};
const energyLevels = {
  0: 300,
  1: 375, // untested
  2: 450,
};

module.exports = {
  debugLevel: 1,
  body: bodyLevels[1],
  energyRequirement: energyLevels[1],
  bodyLevels,
  energyLevels,
};
