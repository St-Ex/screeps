const SOURCES = {
  E32S39: {
    '576a9c8e57110ab231d8947b': { max: 3, crreps: 0 },
    '576a9c8e57110ab231d8947c': { max: 2, creeps: 0 }
  }
}

class SourceManager {

  reset () {
    this.sources = SOURCES;
  }

  addCreep (source) {
    if (this.sources[ creep.room.id ]
      && this.sources[ creep.room.id ][ creep.memory.target ]) {
      this.sources[ creep.room.id ][ creep.memory.target ].creeps++
    }
  }

  findAvailableSource (creep) {
    if (!this.sources[ creep.room.id ]) {
      let sources = creep.room.find(FIND_SOURCES)
      return creep.memory.target = sources[ 0 ].id
    } else {
      for (sourceId in SOURCES[ creep.room.id ]) {
        let s = SOURCES[ creep.room.id ][ sourceId ]
        if (s.creeps < s.max) {
          creep.memory.target = sourceId
          this.addCreep(sourceId)
        }
      }
    }
  }

  getMax (roomId, sourceId) {
    if (!SOURCES[ roomId ]) return 0
    if (!SOURCES[ roomId ][ sourceId ]) return 0
    return SOURCES[ roomId ][ sourceId ].max
  }
}

module.export = new SourceManager()