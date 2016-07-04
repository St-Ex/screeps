const Controller = require('controller')

module.exports.loop = function () {

  for (var name in Memory.creeps) {
    if (!Game.creeps[ name ]) {
      delete Memory.creeps[ name ]
    }
  }

  Controller.init()
}

