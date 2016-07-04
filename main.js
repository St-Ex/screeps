const Controller = require('controller')
const HarvestController = require('harvest.controller')
const CollectController = require('collect.controller')
const UpgradeController = require('upgrade.controller')
const RecycleController = require('recycle.controller')
const BuildController = require('build.controller')

module.exports.loop = function () {

  for (var name in Memory.creeps) {
    if (!Game.creeps[ name ]) {
      delete Memory.creeps[ name ]
    }
  }

  Controller.startOfLoop()

  CollectController.control()
  HarvestController.control()
  UpgradeController.control()
  BuildController.control()
  RecycleController.control()
}

