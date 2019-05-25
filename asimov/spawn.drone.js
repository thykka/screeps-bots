const spawnDrone = function(spawner, role, body, prefix) {
  const name = role.name + prefix;
  return spawner.spawnCreep(
    body,
    name, {
      memory: Object.assign( { role: role.name }, role.memory ),
    }
  );
};

module.exports = spawnDrone;
