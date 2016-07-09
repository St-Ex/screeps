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

        if (creep.memory.dispatch && creep.carry.energy == 0) {
          creep.memory.dispatch = false;
        }
        if (!creep.memory.dispatch && creep.carry[ RESOURCE_ENERGY ] / creep.carryCapacity > TRIGGER_CAPA) {
          creep.memory.upgrading = true;
        }

        if (!creep.memory.dispatch) {
          this.goGetEnergy(creep)
        }
        else {
          let target
          if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target)

            if (!target || target.carry[ RESOURCE_ENERGY ] === target.carryCapacity) {
              delete creep.memory.target
            }
          }

          if (!target) {
            target = Game.getObjectById(CreepManager.getCreepInNeed())
            console.log('AffectDispatch', creep.name, target)
          }

          if (target) {
            creep.memory.target = target.id
            let r = creep.transfer(target, RESOURCE_ENERGY)
            switch (r) {
              case  ERR_NOT_IN_RANGE :
                creep.moveTo(target)
                break
              case 0 :
                delete creep.memory.target
                break;
              default:
                console.log('Dispatch Error', creep.name, r)
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
