const Controller = require('controller')

class HarvestController extends Controller {

	constructor(max) {
		super('harvest', max, 1)
	}

	control() {
		super.control();
		this.doForEachCreep(this.harvestOrMove.bind(this))
	}

	harvestOrMove(creep) {
		if (!creep.memory.target) {
			let sources = creep.room.find(FIND_SOURCES);
			let result = creep.harvest(sources[0])
			if (result === 0) {
				creep.memory.target = sources[0].id
			}
			else if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0]);
			}
		}
		else {
			creep.harvest(Game.getObjectById(creep.memory.target))
		}
	}

	newCreep() {
		return [MOVE, WORK, CARRY, WORK, CARRY, CARRY, CARRY, CARRY]
	}
}

module.exports = new HarvestController(3);
