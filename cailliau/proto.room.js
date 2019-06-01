
Room.prototype.getEnergyReady = function getEnergyReady() {
  return (this.energyAvailable / this.energyCapacityAvailable) || -1;
};
