const Controller = require('controller')

module.exports = class HarvestController extends Controller {

  constructor (max) {
    super('harvest', 3)
  }

  control () {
    super.control();
    this.sources = creep.room.find(FIND_SOURCES);

    if (this.creeps.length > 0) {
      this.creeps.forEach(
        creep => {
          if (creep.carry.energy < creep.carryCapacity) {
            this.harvestOrMove(creep)
          }
          else {
            var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                  structure.energy < structure.energyCapacity;
              }
            });
            if (targets.length > 0) {
              if (creep.transfer(targets[ 0 ], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[ 0 ]);
              }
            }
          }
        }
      )
    }
  }

  harvestOrMove (creep) {
    if (creep.harvest(this.sources[ 0 ]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(this.sources[ 0 ]);
    }
  }

  newCreep () {
    return [ WORK, WORK, MOVE, CARRY ]
  }
}