

module.exports = class Controller {

  constructor (role, max) {
    this.maxcreeps = max
    this.role = role
    Memory.CREEPS_RESET[ this.role ] = [];
  }

  static creeps_reset () {
    Memory.CREEPS_SORT = Object.assign({}, Memory.CREEPS_RESET)
  }

  get creepNames () {
    if (!Memory.CREEPS_SORT.init) {
      Memory.CREEPS_SORT.init = true;
      console.log(JSON.stringify(Memory.CREEPS_SORT))
      for (let name in Game.creeps) {
        let creep = Game.creeps[ name ]
        if (!creep.memory.role) {
          // Recycle
          creep.memory.role = 'recycle';
        }

        Memory.CREEPS_SORT[ creep.memory.role ].push(name)
      }

    }

    return Memory.CREEPS_SORT[ this.role ];
  }

  control () {
    if (this.creepNames.length < this.maxcreeps) {
      this.spawn();
    }
  }

  spawn (spawn, memory) {
    let creep = (spawn ? spawn : Game.spawns.hq1)
      .createCreep(this.newCreep(), Object.assign({ role: this.role }, memory));
    this.creepNames.push(creep.name)
  }
}