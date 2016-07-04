const HarvestController = require('harvest.controller');
const UpgradeController = require('upgrade.controller');
const RecycleController = require('recycle.controller');
const BuildController = require('build.controller');

const HARVEST_CONT = new HarvestController(3);
const UPGRADE_CONT = new UpgradeController(1);
const RECYCLE_CONT = new RecycleController();
const BUILD_CONT = new BuildController(3);

module.exports.loop = function () {

  for (var name in Memory.creep) {
    if (!Game.creeps[ name ]) {
      delete Memory.creeps[ name ]
    }
  }

  HarvestController.creeps_reset()

  UPGRADE_CONT.control()
  HARVEST_CONT.control()
  BUILD_CONT.control()
  RECYCLE_CONT.control()
}

