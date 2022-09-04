import * as CANNON from '../js/cannon/cannon-es.js'
import { Component, appData, startedRunning } from '../base/index.js';
import { threeToCannon, ShapeType } from '../js/three-to-cannon-ts/index.js';
import PhysicsManager from './PhysicsManager.js';
import { Material } from '../js/cannon/cannon-es.js';
import { Body } from '../js/cannon/cannon-es.js';

// a way of converting from three geometry type to cannon shape type.
const getCannonType = (threeGeometry) => {
    switch (typeof threeGeometry){
        case 'Three.CubeGeometry':
            return ShapeType.BOX;
        case 'Three.SphereGeometry':
            return ShapeType.SPHERE;
        case 'Three.CylinderGeometry':
            return ShapeType.CYLINDER;
        default:
            return ShapeType.HULL;
    }
}

// when applied to a FourObject it applies physics to it. it falls on the ground (gravity), calculates collision and more.
// !! Only objects with geometry can add Physics component !!
export default class Physics extends Component{
    static manager = undefined;
    awake(){
        // checks if geometry is defined in this object.
        if (typeof this.obj.geometry === 'undefined'){
            throw new Error('Only objects with geometry can add Physics component');
        }
        //there should only be one physics component on an object.
        this.supportsMultipleInstances = false;
        
        const options = {mass: 1, material: new Material({restitution: 0.1, friction: 0.4})};
        this.body = new CANNON.Body(options); // creating a body in CANNON. when activating this component it's added to the world.
        this.body.sleepSpeedLimit = 0.1; // when body is traveling at lesser speeds than that, it falls asleep and hults moving.

        this.attributes = Component.getSubsetObject(this.body, ['mass', 'type']); // the attributes of the Physics component is a subset of the CANNON body's attributes.
        // still contains refrences to the same attributes, so when changed through it, it still changes the original body's attributes.

        this.initializeCannonPR();

        //adding a listener to these events of the component. binding the functions to this component.
        this.deactivated.add(this.onDeactivated, this); 
        this.activated.add(this.onActivated, this);

        // adding listeners for changes in pos/rot directly through Threejs.
        this.obj.position.addEventListener('changed', (function (e) {this.updateCannonPosition(e); }).bind(this));
        this.obj.quaternion.addEventListener('changed', (function (e) {this.updateCannonRotation(e); }).bind(this));
    }

    start(){
        if (typeof Physics.manager === 'undefined'){
            //Initiating PhysicsManager
            Physics.manager = PhysicsManager.instance;
        }

        let result = null;
        if(this.obj.children.length !== 0){
            const children = this.obj.children;
            this.obj.children = [];
            result = threeToCannon(this.obj, getCannonType(this.obj.geometry));
            this.obj.children = children;
        }else{
            result = threeToCannon(this.obj, getCannonType(this.obj.geometry));
        }
        // Result object includes a CANNON.Shape instance, and (optional)
        // an offset or quaternion for that shape.
        this.body.addShape(result.shape);

        this.initializeCannonPR();

        Physics.manager.addObjectToWorld(this);
        setInterval(this.lazyUpdate.bind(this), 3000);
    }

    lazyUpdate(){ // called every 3s and checks if in scope of the physics manager.
        if (!Physics.manager.attributes.scope.inScope(this.obj.position)){
            this.body.sleep();
        }
    }

    onDeactivated(){
        Physics.manager.removeObjectFromWorld(this);
        clearInterval(this.lazyUpdate);
    }

    onActivated(){
        Physics.manager.addObjectToWorld(this); 
        setInterval(this.lazyUpdate.bind(this), 3000);
    }

    initializeCannonPR(){ //(PR = position, rotation) - copies and initializes the position and rotation of an object3D in THREE to its corresponding body in CANNON.
        const pos = new THREE.Vector3();
        const rot = new THREE.Quaternion();
        this.obj.getWorldPosition(pos);
        this.obj.getWorldQuaternion(rot);
        this.body.position.set(
            pos.x,
            pos.y,
            pos.z
        )
        this.body.quaternion.set(
            rot.x,
            rot.y,
            rot.z,
            rot.w
        )
        this._prevPos = pos;
        this._prevRot = rot;
    }

    #closeEnough(val1, val2){ //determines if two values are close enough (without being 100% equal).
        return (Math.abs(val1 - val2) <= 0.001);
    }
    
    updateCannonPosition(e){ // listenes on include.js for updates for three object POSITION changes, changes it's own body position accordingly.
        const pos = new THREE.Vector3();
        this.obj.getWorldPosition(pos);

        if (!this.#closeEnough(this._prevPos[e.prop], pos[e.prop])){
            if (this.body.sleepState === 2){
                this.body.wakeUp();
            }
        }
        this._prevPos[e.prop] = pos[e.prop];
        this.body.position[e.prop] = pos[e.prop];
        
    }
    updateCannonRotation(e){ // listenes on include.js for updates for three object ROTATION (QUATERNION) changes, changes it's own body rotation (quatertnion) accordingly.
        const rot = new THREE.Quaternion();
        this.obj.getWorldQuaternion(rot);
        
        if (!this.#closeEnough(this._prevRot[e.prop], rot[e.prop])){
            if (this.body.sleepState === 2){
                this.body.wakeUp();
            }
            
        }
        this._prevRot[e.prop] = rot[e.prop];
        this.body.quaternion[e.prop] = rot[e.prop];
    }
}
export {Body};