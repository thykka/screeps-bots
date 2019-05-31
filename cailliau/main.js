console.log('--> loaded cailliau ' + Game.time);

require('globals');

const Store = require('store');

module.exports.loop = function mainLoop() {
  const s = Store.load();
  _.each(s.outposts, outpost => {
    console.log('outpost tasks', outpost.tasks);
  });
};

