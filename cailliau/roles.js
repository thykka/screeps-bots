const Roles = {
  worker: {
    name: 'worker',
    body: [WORK, CARRY, MOVE],
  },
  miner: {
    name: 'miner',
    body: [WORK, WORK, WORK],
  }
};

module.exports = Roles;
