import * as CANNON from '../js/cannon/cannon-es.js'
import { Component, appData } from '../base/index.js';


export default class PhysicsManager extends Component{ //Singelton. an object that manages the world and all the fourObjects in it.

    static instance = undefined;
    
    //adds a specific body to the physics world (thus simulating it's physics every frame).
    addObjectToWorld(physComp){ 
        this.world.addBody(physComp.body);
        this.physicsComps.push(physComp);
    }

    //removes a specific body from the physics world.
    removeObjectFromWorld(physComp){
        this.world.removeBody(physComp.body);

        const index = this.physicsComps.indexOf(physComp);
        if (index > -1) {
            this.physicsComps.splice(index, 1); // 2nd parameter means remove one item only
        }
        
    }

    awake(){
        if (typeof PhysicsManager.instance === 'undefined'){
            PhysicsManager.instance = this;

            //Initiating world.
            this.world = new CANNON.World();
            this.world.gravity.set(0, -9.82, 0);
            this.world.allowSleep = true;
            this.physicsComps = [];
            this.clock = new THREE.Clock();

            this.attributes = Component.getSubsetObject(this.world, ['gravity']); // sets the attributes as a subset object (proxy that supports only specific properties) of world.
            this.attributes.scope = { // binding object is the object that the scope is bound to, range is the range within the bounded object that physics are being calculated, (awakened bodies)
                bindingObj : appData.camera,
                range : {x : 1000, y : 1000, z : 1000},
                inScope : function (pos) {
                    if (Math.abs(pos.x - this.bindingObj.position.x) <= this.range.x && Math.abs(pos.y - this.bindingObj.position.y) <= this.range.y && Math.abs(pos.z - this.bindingObj.position.z) <= this.range.z){
                        return true;
                    }
                    return false;
                }
            };
        }
        else{
            throw new Error('Cannot instantiate more than one PhysicsManager.');
        }
    }

    update(){
        let delta = Math.min(this.clock.getDelta(), 0.1);
        this.world.step(delta); //simulates physics to all bodies.

        this.physicsComps.forEach(physComp => {physComp.obj.setWorldPositionRotation(physComp.body.position, physComp.body.quaternion);});//copies the cannon position and rotation into threejs for all bodies.
    }
}