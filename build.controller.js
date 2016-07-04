const Controller = require('controller')
const PRIOS = require('priority.manager')

class BuildController extends Controller {

	constructor(max) {
		super('build', max)
	}

	control() {
		super.control();

		this.doForEachCreep(
			creep => {
				creep.memory.build = (creep.memory.build && creep.carry.energy !== 0
				|| !creep.memory.build && creep.carry.energy === creep.carryCapacity)

				if (!creep.memory.building) {
					this.goGetEnergy(creep)
				}
				else {
					let target = false
					if (creep.memory.target) {
						target = Game.getObjectById(creep.memory.target)

						if (target.hits === target.hitsMax) {
							target = false;
						}
					}

					if (!target) {
						let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
						if (!targets.length) {
							targets = creep.room.find(
								FIND_MY_STRUCTURES, {filter: structure => structure.hits < structure.hitsMax}
							)
						}

						targets.sort(
							(t1, t2) => PRIOS.getPriority(t2.structureType) - PRIOS.getPriority(
								t1.structureType
							)
						)

						target = targets[0]
					}

					creep.memory.target = target.id
					// Build or repare target
					let method = (
						typeof target === 'ConstructionSite' ? creep.build : creep.repare
					)
					if (method(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0]);
					}
				}
			}
		)
	}

	newCreep() {
		return [WORK, CARRY, MOVE, WORK, MOVE, MOVE, MOVE, MOVE, MOVE]
	}

}

module.exports = new BuildController(3)
