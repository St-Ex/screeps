const PRIORITIES = {
	[STRUCTURE_SPAWN]:       10,
	[STRUCTURE_CONTROLLER]:  9,
	[STRUCTURE_EXTENSION]:   8,
	[STRUCTURE_TOWER]:       7,
	[STRUCTURE_CONTAINER]:   6,
	[STRUCTURE_STORAGE]:     5,
	[STRUCTURE_RAMPART]:     2,
	[STRUCTURE_WALL]:        1,
	[STRUCTURE_ROAD]:        -2,
}

module.exports = {
	getPriority(type){
		let weight = PRIORITIES[type]
		return (weight?weight:0)
	}
}
