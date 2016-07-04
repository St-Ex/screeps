const Controller = require('controller')

class UpgradeController extends Controller {

  constructor () {
    super('upgrade', true)
  }

  control () {
    super.control();

    this.doForEachCreep(
      creep => {
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
          this.goGetEnergy(creep)
        }
      }
    )
  }

  newCreep () {
    return [ WORK, CARRY, MOVE, CARRY ]
  }
}

module.exports = new UpgradeController()
