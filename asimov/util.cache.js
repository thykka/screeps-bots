class Cache {
  constructor(room) {
    this.reads = 0;
    this.writes = 0;
    this._cache = {};
  }
  read(room, type, force = false) {
    if(typeof this._cache[room.name] === 'undefined') this._cache[room.name] = {};
    if(force || typeof this._cache[room.name][type] === 'undefined') {
      this.writes++;
      this._cache[room.name][type] = room.find(type);
    }
    this.reads++;
    return this._cache[room.name][type];
  }
};

module.exports = Cache;
