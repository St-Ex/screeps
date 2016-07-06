const Controller = require('controller')
const PRIOS = require('priority.manager')

const TRIGGER_PICK = 50
const TRIGGER_CAPA = 0.7
class CollectController extends Controller {

  constructor () {
    super('collect')
  }

  control () {
    super.control();

    this.doForEachCreep(
      creep => {

        creep.memory.collect = creep.carry[RESOURCE_ENERGY] == 0
          || (creep.memory.collect && creep.carry[RESOURCE_ENERGY]/creep.carryCapacity < TRIGGER_CAPA)

        if (creep.memory.collect) {
          let targets = Controller.creeps('harvest')
            .map(c => Game.getObjectById(c))
            .sort((c1, c2) => c2.carry[ RESOURCE_ENERGY ] / c2.carryCapacity - c1.carry[ RESOURCE_ENERGY ] / c1.carryCapacity)
          if (targets.length) {
            if (Controller.transferEnergy(targets[ 0 ], creep) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[ 0 ]);
            }
          } else {
            let targets = creep.room.find(FIND_DROPPED_ENERGY, {
              filter: (d=>d.amount >= TRIGGER_PICK)
            })
            if (targets) {
              if (creep.pickup(targets[ 0 ]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[ 0 ]);
              }
            }
          }
        }
        else {
          // Let's give some energy
          let targets = creep.room.find(
            FIND_STRUCTURES, {
              filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_EXTENSION
                    || structure.structureType == STRUCTURE_SPAWN
                    || structure.structureType === STRUCTURE_STORAGE
                    || structure.structureType === STRUCTURE_CONTAINER
                  ) &&
                  structure.energy < structure.energyCapacity;
              }
            }
          )
          targets.sort(
            (t1, t2) => PRIOS.getPriority(t2.structureType) - PRIOS.getPriority(t1.structureType)
          )
          if (targets.length) {
            if (Controller.transferEnergy(creep, targets[ 0 ]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[ 0 ]);
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

module.exports = new CollectController()
