const Roles = {
  starter: {
    name: 'starter',
    body: [WORK, CARRY, MOVE, MOVE],
  },
  worker: {
    name: 'worker',
    body: [WORK, CARRY, MOVE, MOVE],
  },
  miner: {
    name: 'miner',
    body: [WORK, WORK, WORK],
    memory: {
      mode: 'Await'
    }
  }
};

module.exports = Roles;
