const { generateId } = require('util');

// TODO:
// - spawn builder
// - harvest energy until enough to spawn another creep
// - spawn static harvester
// - build containers
// - drag haverster to source once spawned
// - start static harvesting

const TaskTypes = {
  IDLE: { // Do nothing
    tag: 'IDLE',
  },
  MOVTO: { // Move beside/on a target
    tag: 'MOVTO',
  },
  SPAWN: { // Spawn (Creep-or-something role-like)
    tag: 'SPAWN',
  },
  HRVST: { // Harvest from a Source
    tag: 'HRVST',
    findTypes: [FIND_SOURCES],
  },
  BUILD: { // Build ConstructionSites
    tag: 'BUILD',
    findTypes: [FIND_MY_CONSTRUCTION_SITES],
  },
  DRAG: { // Drag a creep (can other things be dragged?)
    tag: 'DRAG',
  },
};

class Task {
  constructor(options = {}) {
    const defaults = {
      tag: 'TASK',
      target: null,
      position: null,
      findTypes: [],
      state: 'paused',
    };
    this.id = generateId();
    Object.assign(this, defaults, options);
  }

  assign(worker) {
    this.worker = worker;
    this.state = 'assigned';
  }

  complete() {

  }

  cancel() {

  }

  pause() {

  }

  resume() {

  }
}
