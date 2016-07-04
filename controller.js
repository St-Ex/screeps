const CreepManager = require('creep.manager')

const CREEPS_RESET = {}

module.exports = class Controller {

	constructor(role, max, min) {
		this.maxcreeps = max
		this.mincreeps = min
		this.role = role
		CREEPS_RESET[this.role] = new Set();
	}

	static startOfLoop() {
		CreepManager.reset(CREEPS_RESET)
	}

	/**
	 * Gets creeps ID per role
	 * @returns {*}
	 */
	get creepIds() {
		return this.creeps(this.role);
	}

	creeps(role) {
		return CreepManager.creeps[role];
	}

	control() {
		if (this.creepIds.size < this.mincreeps) {
			CreepManager.spawnAsap(
				Game.spawns.hq1,
				this.newCreep(),
				Object.assign({role: this.role})
			)
		}
		else if (this.creepIds.size < this.maxcreeps) {
			this.spawn();
		}
	}

	doForEachCreep(cb) {
		this.creepIds.forEach(
			id => {
				let creep = Game.getObjectById(id)
				if (creep) cb(creep)
			}
		)
	}

	spawn(spawn, memory) {
		CreepManager.spawn(
			spawn ? spawn : Game.spawns.hq1,
			this.newCreep(),
			Object.assign({role: this.role}, memory)
		)
	}

	goGetEnergy(creep) {
		var sources = creep.room.find(
			FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return (
							structure.structureType === STRUCTURE_CONTAINER
							|| structure.structureType === STRUCTURE_STORAGE
						)
						&& structure.energy > 0;
				}
			}
		);
		if (sources.length > 0) {
			if (sources[0].transferEnergy(creep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0]);
			}
		}
		else if (creep.body.find(p => p.type === WORK)) {
			let sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0]);
			}
		}
	}
}
