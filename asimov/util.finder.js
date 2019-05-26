
const thisRoom = Game.spawns.Spawn1.room;
const Cache = {
  [thisRoom.name]: {

  },
  read: function readCache (room, type, force = false) {
    if(typeof this[room.name] === 'undefined') this[room.name] = {};
    if(force || typeof this[room.name][type] === 'undefined') {
      this[room.name][type] = room.find(type);
    }
    return this[room.name][type];
  }
};

/*
const types = {
  1: FIND_EXIT_TOP,
  3: FIND_EXIT_RIGHT,
  5: FIND_EXIT_BOTTOM,
  7: FIND_EXIT_LEFT,
  10: FIND_EXIT,
  101: FIND_CREEPS,
  102: FIND_MY_CREEPS,
  103: FIND_HOSTILE_CREEPS,
  104: FIND_SOURCES_ACTIVE,
  105: FIND_SOURCES,
  106: FIND_DROPPED_RESOURCES,
  106: FIND_DROPPED_ENERGY,
  107: FIND_STRUCTURES,
  108: FIND_MY_STRUCTURES,
  109: FIND_HOSTILE_STRUCTURES,
  110: FIND_FLAGS,
  111: FIND_CONSTRUCTION_SITES,
  112: FIND_MY_SPAWNS,
  113: FIND_HOSTILE_SPAWNS,
  114: FIND_MY_CONSTRUCTION_SITES,
  115: FIND_HOSTILE_CONSTRUCTION_SITES,
  116: FIND_MINERALS,
  117: FIND_NUKES,
};
*/

/**
 * Finds room resources while caching results
 * @param {object} options -
 * @param {Creep} [options.creep] - If defined, finds sources by creep's current room.
 * @param {RoomObject} [options.room] - If defined, finds sources by given room.
 * @param {number} [options.type] - Which type of objects to search for (FIND_* constants)
 * @param {function} [options.filter] - Optional filter function (note: filter results are not cached)
 */
const Finder = function Finder({
  creep = null,
  room = null,
  type = FIND_SOURCES,
  filter = null
}) {
  let sources = [];

  if(creep && !room) {
    sources = Cache.read(creep.room, type);
  }
  if(!creep && room) {
    sources = Cache.read(room, type);
  }

  if(sources.length > 0) {
    let filteredSources = (typeof filter === 'function') ?
      sources.filter(filter) :
      sources;

    return filteredSources;
  }

  return [];
};

module.exports = Finder;
