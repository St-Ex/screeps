const Controller = require('controller')
const CreepManager = require('creep.manager')

const TRIGGER_CAPA = 0.7

class DispatchController extends Controller {

  constructor () {
    super('dispatch')
  }

  control () {
    super.control();

    this.doForEachCreep(
      creep => {
        creep.memory.collect = creep.carry[RESOURCE_ENERGY] == 0
          || (creep.memory.collect && creep.carry[RESOURCE_ENERGY]/creep.carryCapacity < TRIGGER_CAPA)

        if (creep.memory.collect) {
          this.goGetEnergy(creep)
        }
        else {
          if (!creep.memory.target) {
            creep.memory.target = CreepManager.getCreepInNeed()
          }

          let target = Game.getObjectById(creep.memory.target)

          if (target) {
            switch (creep.transfer(target, RESOURCE_ENERGY)) {
              case  ERR_NOT_IN_RANGE :
                creep.moveTo(target)
                break
              case 0 :
              default:
                delete creep.memory.target
            }
          }
        }
      }
    )
  }

  newCreep () {
    return [ MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY ]
  }
}

module.exports = new DispatchController()
