require('proto.spawn');
require('proto.creep');
require('proto.room');
const Brain = require('brain');
const brain = new Brain();

global.Tasks = require('tasks');


module.exports.loop = function mainLoop() {
  brain.loop();
};
