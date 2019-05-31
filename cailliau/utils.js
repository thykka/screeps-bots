const util = {};

util.generateId = function generateId(length = 5) {
  return Math.random().toString(32).slice(0 - length);
};

/**
 * @class Mem
 * Stores and retreives values from global memory
 * Usage:
 *  const creepMem = new Mem(
 *    'mycreeps', // main identifier
 *    'op914', // secondary identifier
 *    _.map(Game.creeps, c=>c.id)
 *  );
 *
 * @param {string} key - Memory[key]
 * @param {string} id - Memory[key][id]
 * @param {*} [value] - The initial value, defaults to {}
 *
 * @returns {Mem}
 */
class Mem {
  constructor(key, id, value = {}) {
    this.key = key;
    this.id = id;
    this.init(value);
  }
  init(value) {
    if(typeof Memory[this.key] === 'undefined') {
      Memory[this.key] = {};
    }
    if(typeof Memory[this.key][this.id] === 'undefined') {
      Memory[this.key][this.id] = value;
    }
  }
  read() {
    return Memory[this.key][this.id];
  }
  write(newData) {
    const oldData = this.read();
    Memory[this.key][this.id] = Object.assign({}, oldData, newData);
  }
}

util.Mem = Mem;


module.exports = util;
