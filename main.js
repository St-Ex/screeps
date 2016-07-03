const HarvestController = require('harvest.controller');

const HARVEST_CONT = new HarvestController(3);

module.exports.loop = function () {

  for (var name in Memory.creeps) {
    if (!Game.creeps[ name ]) {
      delete Memory.creeps[ name ]
      console.log('Clearing non-existing creep memory:', name)
    }
  }
  HARVEST_CONT.control();
}

