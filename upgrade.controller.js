const Controller = require('controller')

module.exports = class UpgradeController extends Controller {

  constructor (max) {
    super('upgrade', max)
  }

  control () {
    super.control();

    if (this.creepNames.length > 0) {
      this.creepNames.forEach(
        creepName => {
          let creep = Game.creep[creepName]
          if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
          }
          if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
          }

          if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
              creep.moveTo(creep.room.controller);
            }
          }
          else {
            var sources = creep.room.find(FIND_MY_SPAWNS);
            if (sources[ 0 ].transferEnergy(creep) == ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[ 0 ]);
            }
          }
        }
      )
    }
  }

  newCreep () {
    return [ WORK, CARRY, MOVE, CARRY ]
  }
}