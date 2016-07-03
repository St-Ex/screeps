const CREEPS_RESET = { recreate: false }

module.exports = class Controller {

  static creeps_reset () {
    Controller.CREEPS = Object.assign({}, CREEPS_RESET)
  }

  constructor (role, max) {
    this.maxcreeps = max
    this.role = role
    CREEPS_RESET[ this.role ] = [];
    if (!Controller.CREEPS) Controller.creeps_reset()
  }

  get creeps () {
    if (Controller.CREEPS.recreate) {
      Controller.creeps_reset()

      for (let creepName in Game.creeps) {
        let creep = Game.creeps[ creepName ]
        if (creep.memory.role) {
          Controller.CREEPS[ creep.memory.role ].push(creep)
        } else {
          // Recycle
          creep.memory.role = 'recycle';
        }
      }

    }
    return Controller.CREEPS[ this.code ];
  }

  control () {
    if (this.creeps.length < this.maxcreeps) {
      this.spawn();
    }
  }

  spawn (spawn, memory) {
    return (spawn ? spawn : Game.spawns.hq1)
      .createCreep(this.newCreep(), Object.assign({ role: this.role }, memory));
  }
}