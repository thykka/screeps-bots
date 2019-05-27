module.exports.loop = function loopSpawn(opts) {
  const cache = opts.cache || {};
  _.forEach(Game.spawns, (spawn => {

    console.log('Hello, ' + spawn.name + '!');

  }));
  return {
    cache
  };
};
