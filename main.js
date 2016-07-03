const HarvestController = require('harvest.controller');

const HARVEST_CONT = new HarvestController(3);

module.exports.loop = function () {
    Memory.creeps.forEach(name =>{
    if(!Game.creeps[name]) {
        delete Memory.creeps[name]
        }
    })

    HARVEST_CONT.control();
};