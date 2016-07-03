const HarvestController = require('harvest.controller');

const HARVEST_CONT = new HarvestController(3);

module.exports.loop = function () {

    HARVEST_CONT.control();

    
};