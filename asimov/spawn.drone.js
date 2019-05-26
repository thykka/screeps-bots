const { debugLevel } = require('settings');

const errorCode = code => {
  switch(code) {
  case -1: return 'ERR_NOT_OWNER';
  case -2: return 'ERR_NO_PATH';
  case -3: return 'ERR_NAME_EXISTS';
  case -4: return 'ERR_BUSY';
  case -5: return 'ERR_NOT_FOUND';
  case -6: return 'ERR_NOT_ENOUGH_RESOURCES';
  case -6: return 'ERR_NOT_ENOUGH_ENERGY';
  case -7: return 'ERR_INVALID_TARGET';
  case -8: return 'ERR_FULL';
  case -9: return 'ERR_NOT_IN_RANGE';
  case -10: return 'ERR_INVALID_ARGS';
  case -11: return 'ERR_TIRED';
  case -12: return 'ERR_NO_BODYPART';
  case -6: return 'ERR_NOT_ENOUGH_EXTENSIONS';
  case -14: return 'ERR_RCL_NOT_ENOUGH';
  case -15: return 'ERR_GCL_NOT_ENOUGH';
  }
};

const spawnDrone = function(spawner, role, body, prefix) {
  const name = (role.name[0] + role.name[1]) + (prefix ? '-' + prefix : '');
  const result = spawner.spawnCreep(
    body,
    name, {
      memory: Object.assign( { role: role.name }, role.memory ),
    }
  );
  if(result) {
    console.log('x spawn ' + name + ' failed: ' + errorCode(result));
  } else {
    if(debugLevel > 0) {
      console.log('+ spawning: ' + name);
    }
  }
  return result;
};

module.exports = spawnDrone;
