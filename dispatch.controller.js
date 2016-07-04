const Controller = require('controller')
const CreepManager = require('creep.manager')

class DispatchController extends Controller {

	constructor() {
		super('dispatch')
	}

	control() {
		super.control();

		this.doForEachCreep(
			creep => {
				if (creep.carry.energy == 0) {
					this.goGetEnergy(creep)
				}
				else {
					if (!creep.memory.target) {
						creep.memory.target = CreepManager.getCreepInNeed().id
					}

					let target = Game.getObjectById(creep.memory.target)

					if (target) {
						if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target);
						}
					}
				}
			}
		)
	}

	newCreep() {
		return [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
	}
}

module.exports = new DispatchController()
