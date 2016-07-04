const CREEPS_RESET = {}
var CREEPS = {}

module.exports = class Controller {

  constructor (role, max) {
    this.maxcreeps = max
    this.role = role
    CREEPS_RESET[ this.role ] = new Set();
  }

  static creeps_reset () {
    CREEPS = Object.assign({}, CREEPS_RESET)
  }

  get creepNames () {
    if (!CREEPS.init) {
      CREEPS.init = true;
      for (let name in Game.creeps) {
        let creep = Game.creeps[ name ]
        if (!creep.memory.role) {
          // Recycle
          creep.memory.role = 'recycle';
        }
        CREEPS[ creep.memory.role ].add(name)
      }

    }

    return CREEPS[ this.role ];
  }

  control () {
    if (this.creepNames.size < this.maxcreeps) {
      this.spawn();
    }
  }

  spawn (spawn, memory) {
    let creep = (spawn ? spawn : Game.spawns.hq1)
      .createCreep(this.newCreep(), Object.assign({ role: this.role }, memory));
  }
}
