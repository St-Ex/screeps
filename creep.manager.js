const trigger_energy = 0.60

class CreepManager {

	constructor() {
		this.creeps = {}
		this.en_creeps = []
	}

	reset(init) {

		this.creeps = Object.assign({}, init)
		this.en_creeps = []

		for (let name in Game.creeps) {
			let creep = Game.creeps[name]

			if (creep) {
				if (!creep.memory.role) {
					// Recycle
					creep.memory.role = 'recycle';
				}
				this.creeps[creep.memory.role].add(creep.id)

				if (creep.carry.RESOURCE_ENERGY) {
					let p = creep.carry.RESOURCE_ENERGY / creep.carryCapacity
					if (p < trigger_energy) {
						this.en_creeps.push[{id: creep.id, p: p}];
					}
				}
			}
		}

		this.en_creeps.sort((c1,c2)=>c2.p-c1.p)
	}

	spawn(spawner, parts, memory) {
		if (!spawner.spawning && spawner.canCreateCreep(parts) === 0) {
			spawner.createCreep(parts, null, memory)
		}
	}

	spawnAsap(spawner, parts, memory) {
		if (!spawner.spawning) {
			var result = spawner.createCreep(parts, null, memory);
			if (result === ERR_NOT_ENOUGH_ENERGY) {
				spawner.createCreep(parts.slice(0, 3), null, memory);
			}
		}
	}

	getCreepInNeed(){
		return this.en_creeps.splice(0,1)
	}
}

module.exports = new CreepManager();
