const util = {};

util.generateId = function generateId(length = 5) {
  return Math.random().toString(32).slice(0 - length);
};

module.exports = util;
