const Controller = require('controller')
const SRC = require('source.manager')

class HarvestController extends Controller {

  constructor () {
    super('harvest')
  }

  control () {
    super.control();
    this.doForEachCreep(this.harvestOrMove.bind(this))
  }

  harvestOrMove (creep) {
    if (!creep.memory.target) {
      SRC.findAvailableSource(creep)
    }

    if (creep.carry.energy !== creep.carryCapacity) {
      let target = Game.getObjectById(creep.memory.target)
      switch (creep.harvest(target)){
        case 0 :
        case ERR_NOT_ENOUGH_RESOURCES:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(target)
          break
        default:
          delete creep.memory.target
      }
    }
  }

  newCreep () {
    return [ MOVE, WORK, CARRY, WORK, WORK, CARRY, CARRY ]
  }
}

module.exports = new HarvestController();
