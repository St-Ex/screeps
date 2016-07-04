const CreepManager = require('creep.manager')

const CREEPS_RESET = {}
const TRIGGER_PICK = 25

module.exports = class Controller {

  constructor (role, max, min, needEnergy) {
    this.maxcreeps = max
    this.mincreeps = min
    this.role = role
    this.needEnergy = needEnergy
    CREEPS_RESET[ this.role ] = new Set();
  }

  static startOfLoop () {
    CreepManager.reset(CREEPS_RESET)
  }

  /**
   * Gets creeps ID per role
   * @returns {*}
   */
  get creepIds () {
    return this.creeps(this.role);
  }

  creeps (role) {
    return CreepManager.creeps[ role ];
  }

  control () {
    if (this.creepIds.size < this.mincreeps) {
      CreepManager.spawnAsap(
        Game.spawns.hq1,
        this.newCreep(),
        Object.assign({ role: this.role, en: this.needEnergy })
      )
    }
    else if (this.creepIds.size < this.maxcreeps) {
      this.spawn();
    }
  }

  doForEachCreep (cb) {
    this.creepIds.forEach(
      id => {
        let creep = Game.getObjectById(id)
        if (creep) cb(creep)
      }
    )
  }

  spawn (spawn, memory) {
    CreepManager.spawn(
      spawn ? spawn : Game.spawns.hq1,
      this.newCreep(),
      Object.assign({ role: this.role, en: this.needEnergy }, memory)
    )
  }

  goGetEnergy (creep) {
    let sources = creep.room.find(
      FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
              structure.structureType === STRUCTURE_CONTAINER
              || structure.structureType === STRUCTURE_STORAGE
            )
            && structure.energy > 0;
        }
      }
    );
    if (sources.length) {
      if (sources[ 0 ].transferEnergy(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[ 0 ]);
      }
    }
    else {
      let targets = creep.room.find(FIND_DROPPED_ENERGY, {
        filter: (d=>d.amount >= TRIGGER_PICK)
      })
      if (targets) {
        if (creep.pickup(targets[ 0 ]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[ 0 ]);
        }
      }
      else {
        targets = this.creeps('harvest')
          .map(c => Game.getObjectById(c))
          .sort((c1, c2) => c2.carry - c1.carry)
        if (targets[ 0 ].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[ 0 ]);
        }
      }
    }
  }
}
