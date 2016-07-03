const Controller = require('controller')

module.exports = class HarvestController extends Controller {

  constructor (max) {
    super('harvest', max)
  }

  control () {
    super.control();


    if (this.creepNames.length > 0) {
      this.creepNames.forEach(
        creepName => {
          let creep = Game.creep[creepName]
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
    let sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[ 0 ]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[ 0 ]);
    }
  }

  newCreep () {
    return [ WORK, WORK, MOVE, CARRY ]
  }
}