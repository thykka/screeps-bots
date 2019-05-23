// Make sure the method has not already been overwritten
if (!StructureSpawn.prototype._createCreep) {
  StructureSpawn.prototype._createCreep = StructureSpawn.prototype.createCreep;

  // The original signature: createCreep(body, [name], [memory])
  // Make a new version with the signature createCreep(body, [memory])
  StructureSpawn.prototype.createCreep = function(body, memory = {}) {
    if (!Memory.myCreepNameCounter) Memory.myCreepNameCounter = 0;

    // Now we need to generate a name and make sure it hasnt been taken
    let name;
    let canCreate;
    do {
      name = `c${Memory.creepNameCounter++}`;
      canCreate = this.canCreateCreep(body, name);
    } while (canCreate === ERR_NAME_EXISTS);

    // Now we call the original function passing in our generated name and
    // returning the value
    return this._createCreep(body, name, memory);
  };
}
