const debugLevel = 1;

const bodyLevels = {
  1: {
    harvest: [WORK, CARRY, MOVE],
    build: [WORK, CARRY, MOVE],
    upgrade: [WORK, CARRY, MOVE],
    repair: [WORK, CARRY, MOVE],
  },
  2: {
    harvest: [WORK, CARRY, MOVE],
    build: [WORK, CARRY, MOVE],
    upgrade: [WORK, CARRY, MOVE],
    repair: [WORK, CARRY, MOVE],
  },
  3: {
    harvest: [WORK, WORK, CARRY, MOVE],
    build: [WORK, CARRY, CARRY, MOVE],
    upgrade: [WORK, CARRY, CARRY, MOVE],
    repair: [WORK, CARRY, CARRY, MOVE],
  },
};
bodyLevels[0] = bodyLevels[1];
bodyLevels[4] = bodyLevels[3];
const energyLevels = {
  1: 300,
  2: 375,
  3: 450,
};
energyLevels[0] = energyLevels[1];
energyLevels[4] = energyLevels[3];

module.exports = {
  debugLevel,
  bodyLevels,
  energyLevels,
};
