export default class HarvestController {
    
    constructor(max) {
        this.maxcreeps=max;
    }
    
    control(){
        console.log(Game.creeps);
    }
}