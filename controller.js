module.exports = class Controller {

  constructor (role, max) {
    this.maxcreeps = max
    this.role = role
  }

  get creeps () {
    this._creeps = [];
    for (let creep in Game.creeps) {
      if (creep.memory && creep.memory.role === this.role) {
        this._creeps.push(creep)
      }
    }
    return this._creeps;
  }

  control () {
    if (this.creeps.length < this.maxcreeps) {
      Game.spawns.hq1.createCreep(this.newCreep(), { role: this.role });
    }
  }
}