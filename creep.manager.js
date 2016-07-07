const SRC = require('source.manager')
const trigger_energy = 0.60

const PART_COST = {
  [MOVE]: 50,
  [WORK]: 100,
  [CARRY]: 50,
  [ATTACK]: 80,
  [RANGED_ATTACK]: 150,
  [HEAL]: 250,
  [CLAIM]: 600,
  [TOUGH]: 10
}

class CreepManager {

  constructor () {
    this.creeps = {}
    this.en_creeps = []
  }

  reset () {

    this.creeps = {
      'build': [],
      'harvest': [],
      'collect': [],
      'dispatch': [],
      'recycle': [],
      'upgrade': []
    }
    this.en_creeps = []

    for (let name in Game.creeps) {
      let creep = Game.creeps[ name ]

      if (creep) {
        if (creep.memory.role === 'harvest') {
            SRC.addCreep(creep)
        } else if (!creep.memory.role) {
          // Recycle
          creep.memory.role = 'recycle';
        }
        this.creeps[ creep.memory.role ].push(creep.id)

        if (creep.memory.en) {
          let p = creep.carry[ RESOURCE_ENERGY ] / creep.carryCapacity
          this.en_creeps.push({ id: creep.id, p: p });
        }
      }
    }

    this.en_creeps.sort((c1, c2)=>c1.p - c2.p)
  }

  spawn (spawner, parts, memory) {
    let max = spawner.room.energyCapacityAvailable
    let selectParts = parts.filter(p=> {
      max -= PART_COST[ p ]
      return max >= 0
    })

    if (!spawner.spawning && spawner.canCreateCreep(selectParts) === 0) {
      spawner.createCreep(selectParts, null, memory)
    }
  }

  spawnAsap (spawner, parts, memory) {
    if (!spawner.spawning) {
      var result = spawner.createCreep(parts, null, memory);
      if (result === ERR_NOT_ENOUGH_ENERGY) {
        spawner.createCreep(parts.slice(0, 3), null, memory);
      }
    }
  }

  getCreepInNeed () {
    return this.en_creeps.splice(0, 1)[ 0 ].id
  }
}

module.exports = new CreepManager();
