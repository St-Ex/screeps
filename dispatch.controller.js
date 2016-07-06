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
        creep.memory.dispatch = creep.carry[RESOURCE_ENERGY] === creep.carryCapacity
          || (!creep.memory.dispatch && creep.carry[RESOURCE_ENERGY]/creep.carryCapacity > TRIGGER_CAPA)

        if (!creep.memory.dispatch) {
          this.goGetEnergy(creep)
        }
        else {
          if(creep.memory.target){
            let target = Game.getObjectById(creep.memory.target)

            if (target && target.carry[RESOURCE_ENERGY] === target.carryCapacity) {
              creep.memory.target = false;
            }
          }

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
