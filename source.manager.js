class SourceManager {

	reset() {
		this.sources = {
			E32S39: {
				'576a9c8e57110ab231d8947b': {max: 2, creeps: 0},
				'576a9c8e57110ab231d8947c': {max: 2, creeps: 0}
			}
		}
	}

	addCreep(creep) {
		if (this.sources[creep.room.name]
			&& this.sources[creep.room.name][creep.memory.target]) {
			let src = this.sources[creep.room.name][creep.memory.target];

			if (src.creeps < src.max) {
				this.sources[creep.room.name][creep.memory.target].creeps++
			}
			else {
				delete creep.memory.target
			}
		}
	}

	findAvailableSource(creep) {
		if (!this.sources[creep.room.name]) {
			let sources = creep.room.find(FIND_SOURCES)
			creep.memory.target = sources[0].id
		}
		else {
			for (let sourceId in this.sources[creep.room.name]) {
				let s = this.sources[creep.room.name][sourceId]
				if (s.creeps < s.max) {
					creep.memory.target = sourceId
					this.addCreep(creep)
					break
				}
			}
		}
		console.log('Affect', creep.name, creep.memory.target)
	}
}

module.exports = new SourceManager()
