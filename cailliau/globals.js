
/**
 * Surround sources with containers for static mining
 */
Room.prototype.setupSources = function setupSources() {
  const roomSources = this.findSources();
  const errors = [];
  _.forEach(roomSources, (source, sourceIndex) => {
    _.forEach(source.findContainerPositions(), (pos, posIndex) => {
      errors.push(
        this.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER, 'C' + sourceIndex + '' + posIndex)
      );
    });
  });
};
/**
 * Wrapper for Room.find(FIND_SOURCES)
 * @returns {array|null} - results of Room.find, might be null if none found
 */
Room.prototype.findSources = function findSources() {
  return this.find(FIND_SOURCES);
};

/**
 * Looks for places to put a static miner container onto, in the following figure:
 *
 * ..C..
 * .....
 * C.S.C
 * .....
 * ..C..
 *
 * ...where "S" represents the source position, and "C" the positions that
 * are checked for construction site placement.
 * @returns {array} - Array of suitable construction site positions
 */
Source.prototype.findContainerPositions = function findContainerPositions() {
  return [
    new RoomPosition(this.pos.x - 2, this.pos.y, this.room.name),
    new RoomPosition(this.pos.x + 2, this.pos.y, this.room.name),
    new RoomPosition(this.pos.x, this.pos.y - 2, this.room.name),
    new RoomPosition(this.pos.x, this.pos.y + 2, this.room.name)
  ].filter(pos => (
    pos.lookFor(LOOK_TERRAIN) != 'wall' &&
    pos.lookFor(LOOK_CONSTRUCTION_SITES).length === 0 &&
    pos.lookFor(LOOK_STRUCTURES)
  ));
};
