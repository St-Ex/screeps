const CREEPS_RESET = {}
var CREEPS = {};

module.exports = class Controller {


  constructor (role, max) {
    this.maxcreeps = max
    this.role = role
    CREEPS_RESET[ this.role ] = [];
  }
  
  static creeps_reset () {
    console.log(JSON.stringify(CREEPS_RESET))
    CREEPS = Object.assign({}, CREEPS_RESET)
  }

  get creeps () {
    if (!CREEPS.init) {
      CREEPS.init = true;

      for (let creepName in Game.creeps) {
        let creep = Game.creeps[ creepName ]
        if (creep.memory.role) {
          CREEPS[ creep.memory.role ].push(creep)
        } else {
          // Recycle
          creep.memory.role = 'recycle';
        }
      }

    }

    return CREEPS[ this.code ];
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