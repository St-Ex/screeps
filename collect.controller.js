const Controller = require('controller')
const PRIOS = require('priority.manager')

const TRIGGER_PICK = 50
const TRIGGER_ABS_HARV = 10
const TRIGGER_CAPA = 0.7
class CollectController extends Controller {

	constructor() {
		super('collect')
	}

	control() {
		super.control();

		this.doForEachCreep(
			creep => {

				creep.memory.collect = creep.carry[RESOURCE_ENERGY] == 0 || (creep.memory.collect && creep.carry[RESOURCE_ENERGY]/creep.carryCapacity < TRIGGER_CAPA)

				if (creep.memory.collect) {
					let targets = Controller.creeps('harvest')
						.map(c => Game.getObjectById(c))
						.filter(c => c.carry[RESOURCE_ENERGY] >= TRIGGER_ABS_HARV)
						.sort((c1, c2) => c2.carry[RESOURCE_ENERGY] / c2.carryCapacity - c1.carry[RESOURCE_ENERGY]/c1.carryCapacity)
					if (targets.length) {
						if (Controller.transferEnergy(targets[0], creep) == ERR_NOT_IN_RANGE) {
							creep.moveTo(targets[0]);
						}
					}
					else {
						let targets = creep.room.find(FIND_DROPPED_ENERGY, {filter: (d=>d.amount >= TRIGGER_PICK)})
						if (targets.length) {
							if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
								creep.moveTo(targets[0]);
							}
						}
						else {
							creep.memory.collect = false
						}
					}
				}

				if (creep.memory.target) {
					let target = Game.getObjectById(creep.memory.target);
					if(target && Controller.roomForEnergy(target)){
						let r = Controller.transferEnergy(creep, target);
						switch (r) {
							case ERR_NOT_IN_RANGE :
								creep.moveTo(target)
								break;
							case 0 :
								delete creep.memory.target
								break;
							default :
								console.log('Collect',creep.name,'Fail give energy',r)
								delete creep.memory.target
						}
					}else{
						delete creep.memory.target
					}
				}else {
					this.findTargetStructure(creep)
				}
			}
		)
	}

	findTargetStructure(creep) {
		let targets = creep.room.find(
			FIND_MY_STRUCTURES, {
				filter: (s) => (
					s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN
				) && Controller.roomForEnergy(s)

			}
		)
		targets.sort(
			(t1, t2) => PRIOS.getPriority(t2.structureType) - PRIOS.getPriority(t1.structureType)
		)

		if (targets.length) {
			creep.memory.target = targets[0].id
		}
		else if (creep.room.storage && Controller.roomForEnergy(creep.room.storage)) {
			creep.memory.target = creep.room.storage.id
		}
		else {
			console.log('Collect', creep.name, 'No target available')
		}
	}

	newCreep() {
		return [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
	}
}

module.exports = new CollectController()
