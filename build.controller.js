const Controller = require('controller')

module.exports = class BuilderController extends Controller {

  constructor (max) {
    super('build', max)
  }

  control () {
    // Let's spawn build creep where needed
    for (let roomName in Game.rooms) {
      let room = Game.rooms[ roomName ]
      let sites = room.find(FIND_CONSTRUCTION_SITES)

      if (sites) {
        if (sites.length > this.creepNames.size
          && this.maxcreeps > this.creepNames.size) {
          this.spawn(room.find(FIND_MY_SPAWNS)[ 0 ])
        }
      }
    }

    if (this.creepNames.size > 0) {
      this.creepNames.forEach(
        creepName => {
          let creep = Game.creeps[ creepName ]
          if (!creep) return
          if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
          }
          if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
          }

          if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
              if (creep.build(targets[ 0 ]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[ 0 ]);
              }
            } else {
              creep.memory.role = 'recycle'
            }
          }
          else {
            this.goGetEnergy(creep)
          }
        }
      )
    }
  }

  newCreep () {
    return [ WORK, CARRY, MOVE, CARRY ]
  }

}
