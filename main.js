const HarvestCntroller = require('harvest.controller');

const HARVEST_CONT = new HarvestCntroller(3);

module.exports.loop = function () {

    HARVEST_CONT.control();

    
};