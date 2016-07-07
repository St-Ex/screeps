class SourceManager {

	reset() {
		this.sources = {
			E32S39: {
				'576a9c8e57110ab231d8947b': {max: 2, harvest: [], collect: 0},
				'576a9c8e57110ab231d8947c': {max: 2, harvest: [], collect: 0}
			}
		}
	}

	addCreep(creep) {
		if (creep.memory.role === 'harvest'){
			if (this.sources[creep.room.name]
				&& this.sources[creep.room.name][creep.memory.target]) {
				let src = this.sources[creep.room.name][creep.memory.target];
				if (src.harvest.length < src.max) {
					this.sources[creep.room.name][creep.memory.target].harvest.push(creep.id)
				}
				else {
					delete creep.memory.target
				}
			}
		} else if (creep.memory.role === 'collect') {
			if (this.sources[creep.room.name]
				&& this.sources[creep.room.name][creep.memory.source]) {
				this.sources[creep.room.name][creep.memory.source].collect++
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
				if (s.harvest.length < s.max) {
					creep.memory.target = sourceId
					this.addCreep(creep)
					break
				}
			}
		}
		console.log('AffectHarvest', creep.name, creep.memory.target)
	}

	affectCollect(creep){
		if (this.sources[creep.room.name]) {
			let min=-1
			let source
			for (let sourceId in this.sources[creep.room.name]) {
				let s = this.sources[creep.room.name][sourceId]
				if (s.harvest.length>0) {
					if (min === -1 || min > s.collect){
						min = s.collect
						source = sourceId
					}
				}
			}
			creep.memory.source = source
			console.log('AffectCollect', creep.name, creep.memory.source)
		}
	}

	getSources(creep){
		return this.sources[creep.room.name]
	}
}

module.exports = new SourceManager()
