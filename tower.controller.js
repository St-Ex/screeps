class TowerController {

	control(){
		for (let roomName in Game.rooms){
			let room=Game.rooms[roomName]
			let towers= room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_TOWER }
			})

			if(towers.length){
				towers.forEach(
					tower =>{

						let target
						if (room.memory.target) {
							target = Game.getObjectById(room.memory.target)
						}

						if (!target){
							delete room.memory.target
							let targets =room.find(FIND_HOSTILE_CREEPS)
							if (targets.length){
								target = targets[0]
								room.memory.target = target.id
							}
						}

						if (target){
							tower.attack(target)
						}else{
							let repairs = creep.room.find(FIND_STRUCTURES, {filter: s => s.hits < s.hitsMax})
							tower.repair(repairs[0])
						}
					}
				)
			}
		}
	}
}

module.exports = new TowerController();
