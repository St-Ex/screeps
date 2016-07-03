const Controller = require('controller')

module.exports = class RecycleController extends Controller {

  constructor () {
    super('recycle', 0)
  }

  control () {
    super.control();
    this.creepNames.forEach(
      creepName => {
        let creep = Game.creep[creepName]
        var spawns = creep.room.find(FIND_MY_SPAWNS);
        if (spawns[ 0 ].recycleCreep(creep) == ERR_NOT_IN_RANGE) {
          creep.moveTo(spawns[ 0 ]);
        }
      }
    )
  }
}