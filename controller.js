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
		let source
		if (creep.memory.gge_source){
			source = Game.getObjectById(creep.memory.gge_source)
		}

		if(!source) {
			if (creep.room.storage) {
				source = creep.room.storage
				creep.say('src storage')
			}
			else {
				let sources = Controller.creeps('harvest')
					.map(c => Game.getObjectById(c))
					.sort((c1, c2) => c1.carry - c2.carry)
				source = sources[0]
				creep.say('src '+source.name)
			}
		}

		creep.memory.gge_source=source.id
		let r=Controller.transferEnergy(source, creep)
		switch (r){
			case 0 :
				delete creep.memory.gge_source
				break;
			case -1 :
			case ERR_NOT_IN_RANGE:
				creep.moveTo(source)
				break
			default :
				creep.say('!gge:'+r)
				console.log('GGE',creep.name,'Cannot gge',r, source)
				delete creep.memory.gge_source
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

		if (maxSource==0) return -1

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
