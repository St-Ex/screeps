const Controller = require('controller')
const PRIOS = require('priority.manager')

class BuildController extends Controller {

  constructor () {
    super('build', true)
  }

  control () {
    super.control();

    this.doForEachCreep(
      creep => {
        creep.memory.build = (
          creep.memory.build && creep.carry.energy !== 0
          || !creep.memory.build && creep.carry.energy === creep.carryCapacity
        )

        if (!creep.memory.build) {
          this.goGetEnergy(creep)
        }
        else {
          let target
          if (creep.memory.target) {
            target = Game.getObjectById(creep.memory.target)

            if (target && target.hits === target.hitsMax) {
              target = false;
            }
          }

          if (!target) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            creep.memory.repair = false
            if (!targets.length) {
              targets = creep.room.find(
                FIND_MY_STRUCTURES, { filter: structure => structure.hits < structure.hitsMax }
              )
              creep.memory.repair = true
            }

            targets.sort(
              (t1, t2) => PRIOS.getPriority(t2.structureType) - PRIOS.getPriority(
                t1.structureType
              )
            )

            target = targets[ 0 ]
          }

          creep.memory.target = target.id

          let result
          // Build or repare target
          if (creep.memory.repair) {
            result = creep.repair(target)
          }
          else {
            result = creep.build(target)
          }

          if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          } else if (result == ERR_INVALID_TARGET) {
            delete creep.memory.target
          }
        }
      }
    )
  }

  newCreep () {
    return [ WORK, CARRY, MOVE, WORK, CARRY, CARRY, WORK ]
  }

}

module.exports = new BuildController()
