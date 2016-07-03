const Controller = require('controller')

module.exports = class HarvestController extends Controller {

  constructor (max) {
    super('harvest', 3)
  }

  control () {
    super.control();
  }

  newCreep () {
    return [ WORK, MOVE, CARRY ]
  }
}