const CreepManager = require('creep.manager')
const SRC = require('source.manager')
const TRIGGER_PICK = 25

module.exports = class Controller {

	constructor(role, needEnergy) {
		this.role = role
		this.needEnergy = needEnergy
	}

	static startOfLoop() {
    SRC.reset()
		CreepManager.reset()
	}

	/**
	 * Gets creeps ID per role
	 * @returns {*}
	 */
	get creepIds() {
		return Controller.creeps(this.role);
	}

	static creeps(role) {
		return CreepManager.creeps[role];
	}

	control() {

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
			Object.assign({role: this.role, en: this.needEnergy}, memory)
		)
	}

	goGetEnergy(creep) {
		delete creep.memory.gge

		if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY]) {
			creep.memory.gge = 'struct'
			if (Controller.transferEnergy(creep.room.storage, creep) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.storage);
			}
			return
		}

		let sources = creep.room.find(FIND_DROPPED_ENERGY, {filter: (d=>d.amount >= TRIGGER_PICK)})
		if (sources.length) {
			creep.memory.gge = 'drop'
			if (creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0]);
			}
			return
		}

		sources = Controller.creeps('harvest')
			.map(c => Game.getObjectById(c))
			.sort((c1, c2) => c2.carry - c1.carry)
		creep.memory.gge = 'harv'
		if (Controller.transferEnergy(sources[0], creep) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0]);
		}
	}

	/**
	 *
	 * @param source
	 * @param target
	 * @returns {*}
	 */
	static transferEnergy(source, target) {
		let maxSource = (
			source.carryCapacity
				? source.carry[RESOURCE_ENERGY]
				: source.store[RESOURCE_ENERGY]
		)

		return source.transfer(
			target,
			RESOURCE_ENERGY,
			Math.min(maxSource, Controller.roomForEnergy(target))
		)
	}

	static roomForEnergy(target){
		return target.carryCapacity
			? target.carryCapacity - target.carry[RESOURCE_ENERGY]
			: (
			target.storeCapacity
				? target.storeCapacity - target.store[RESOURCE_ENERGY]
				: target.energyCapacity - target.energy
		)
	}
}
