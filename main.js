const Controller = require('controller')
const Harv = require('harvest.controller')
const Coll = require('collect.controller')
const Up = require('upgrade.controller')
const R = require('recycle.controller')
const Disp = require('dispatch.controller')
const Bld = require('build.controller')

function checkMinimal () {
  let missing = false;
  if (!Harv.creepIds.length) return Harv
  if (!Coll.creepIds.length) return Coll
  if (!Up.creepIds.length) return Up
}

const growSequence = [
  { cont: Harv, req: 2 },
  { cont: Bld, req: 1 },
  { cont: Coll, req: 3 },
  { cont: Bld, req: 2 },
  { cont: Harv, req: 3 },
  { cont: Coll, req: 4 },
  { cont: Disp, req: 2 },
  { cont: Bld, req: 3 },
  { cont: Up, req: 2 },
]

function findNextToSpawn () {
  growSequence.find(g=>g.cont.creepIds < g.req).spawn()
}

module.exports.loop = function () {

  for (var name in Memory.creeps) {
    if (!Game.creeps[ name ]) {
      delete Memory.creeps[ name ]
    }
  }

  Controller.startOfLoop()
  
  // Minimal check
  let missing = checkMinimal();
  if (missing) {
    CreepManager.spawnAsap(
      Game.spawns.hq1,
      missing.newCreep(),
      Object.assign({ role: missing.role, en: missing.needEnergy })
    )
  } else {
    // Let's grow stronger
    let grow = findNextToSpawn()
    grow.spawn()
  }


  Coll.control()
  Harv.control()
  Disp.control()
  Up.control()
  Bld.control()
  R.control()
}

