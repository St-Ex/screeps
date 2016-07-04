const Controller = require('controller')

class RecycleController extends Controller {

	constructor() {
		super('recycle')
	}

	control() {
		this.doForEachCreep(
			creep => {
				var spawns = creep.room.find(FIND_MY_SPAWNS);
				if (spawns[0].recycleCreep(creep) == ERR_NOT_IN_RANGE) {
					creep.moveTo(spawns[0]);
				}
			}
		)
	}

}

module.exports = new RecycleController();
