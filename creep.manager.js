class CreepManager {

	constructor() {
		this.creeps = {}
	}

	reset(init) {

		this.creeps = Object.assign({}, init)

		for (let name in Game.creeps) {
			let creep = Game.creeps[name]

			if (creep) {
				if (!creep.memory.role) {
					// Recycle
					creep.memory.role = 'recycle';
				}
				this.creeps[creep.memory.role].add(creep.id)
			}
		}
	}

	spawn(spawner, parts, memory) {
		if (!spawner.spawning && spawner.canCreateCreep(parts)===0) {
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
}

module.exports = new CreepManager();
