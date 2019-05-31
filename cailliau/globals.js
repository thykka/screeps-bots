
Room.prototype.setupSources = function setupSources() {
  const roomSources = this.findSources();
  _.forEach(roomSources, (source, sourceIndex) => {
    _.forEach(source.findContainerPositions(), (pos, posIndex) => {
      this.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER, 'C' + sourceIndex + '' + posIndex);
    });
  });
};
Room.prototype.findSources = function findSources() {
  return this.find(FIND_SOURCES);
};

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
