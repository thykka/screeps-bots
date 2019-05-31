console.log('--> loaded cailliau ' + Game.time);

const utils = require('utils');

module.exports.loop = function mainLoop() {
  const outposts = loadOutposts();
};

global.loadOutposts = function loadOutposts() {
  const currentIds = loadOutpostIds();
  const outposts = _.map(currentIds, (id => new Outpost(id)));

  return outposts;
};

global.loadOutpostIds = function loadOutpostIds() {
  // Scan all spawns for the key 'OP' in their memory
  const uniqueIds = _.reduce(Game.spawns, (result, spawn) => {
    const id = spawn.memory.OP || false;
    if(id) result[id] = id;
    return result;
  }, {});
  return uniqueIds;
};

class Outpost {
  constructor(id) {
    if(typeof id === 'string') { // load an existing outpost
      this.id = id;
    } else {
      this.id = utils.generateId();
    }
    this.mem = new utils.Mem('outposts', this.id);
  }
}
