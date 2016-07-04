const Controller = require('controller')
const PRIOS = require('priority.manager')

class CollectController extends Controller {

	constructor(max) {
		super('collect', max, 1)
	}

	control() {
		super.control();

		this.doForEachCreep(
			creep => {
				if (creep.carry.energy == 0) {
					let targets = creep.room.find(FIND_DROPPED_ENERGY)
					if (targets) {
						if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0]);
						}
					}
					else {
						targets = this.creeps('harvest').sort((c1,c2) => c2.carry-c1.carry)
						if (targets[0].transfer(creep,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0]);
						}
					}
				}
				else {
					// Let's give some energy
					let targets = creep.room.find(
						FIND_STRUCTURES, {
							filter: (structure) => {
								return (
										structure.structureType == STRUCTURE_EXTENSION
										|| structure.structureType == STRUCTURE_SPAWN
										|| structure.structureType === STRUCTURE_STORAGE
										|| structure.structureType === STRUCTURE_CONTAINER
									) &&
									structure.energy < structure.energyCapacity;
							}
						}
					)

					targets.sort(
						(t1, t2) => PRIOS.getPriority(t2.structureType) - PRIOS.getPriority(
							t1.structureType
						)
					)

					if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);
					}
				}
			}
		)
	}
}

module.exports = new CollectController(4)
