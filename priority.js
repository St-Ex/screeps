const PRIORITIES = {
	STRUCTURE_SPAWN:       10,
	STRUCTURE_EXTENSION:   8,
	STRUCTURE_TOWER:       7,
	STRUCTURE_ROAD:        -2,
	STRUCTURE_WALL:        1,
	STRUCTURE_RAMPART:     2,
	STRUCTURE_CONTROLLER:  9,
	STRUCTURE_STORAGE:     5,
	STRUCTURE_CONTAINER:   6
}

module.exports = {
	getPriority(type){
		let weight = PRIORITIES[type]
		return (weight?weight:0)
	}
}
