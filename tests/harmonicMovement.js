import FOUR from "../base/index.js";
import { Vec3 } from "../js/cannon/cannon-es.js";

export class harmonic extends FOUR.Component{
    awake(){
        this.attributes.pivot = 15;
        this.attributes.startHeight = 5;
    }
    start(){
        this.k = 5; 
        this.obj.position.y = this.attributes.startHeight;
        this.body = this.obj.Physics.body;
    }
    
    fixedUpdate(){

        const deltaX = this.attributes.pivot - this.obj.position.y; // F=k*dx
        const force = new Vec3(0, this.k * deltaX, 0);
        this.obj.Physics.body.applyForce(force);
    }

    
}
