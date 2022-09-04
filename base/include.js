import { Entity } from "./Entity.js";
import { Component, entityArr, appData } from "./index.js";

export function include(obj){
    if(!(obj instanceof THREE.Object3D)){
        throw new Error("You can only include Object3D");
    }
    //adds all the unique fourjs properties to the threejs object.
    obj.components = [];
    obj.addComponent = addComponent;
    obj.getComponentListCopy = getComponentListCopy;
    obj.deleteComponentByIndex = deleteComponentByIndex;
    obj.getComponentByIndex = getComponentByIndex;
    obj.getComponentByType = getComponentByType;
    obj.getMultipleComponentsByType = getMultipleComponentsByType;
    obj.hasComponent = hasComponent;
    obj.setWorldPositionRotation = setWorldPositionRotation;
    entityArr.push(new Entity(obj));
}

function addComponent(component, args) { //Adds new component to object.
    if(typeof component === 'undefined'){
        throw new Error("No component type argument given.");
    }

    const comp = new component(this, args);

    if(!(comp instanceof Component)){ 
        throw new Error("Argument not of type Component.");
    }
    if(this.hasComponent(comp)){ //handling multiple components of the same type if needed.
        if(!comp.supportsMultipleInstances){
            throw new Error(comp.constructor.name + " component does not support multiple instances of itself on a single object.")
        }
        const oldComp = this[comp.constructor.name];

        if(Array.isArray(oldComp)){
            oldComp.push(comp);
        }
        else{
            Object.defineProperty(this, comp.constructor.name, {value: [oldComp, comp], writable: false, configurable: true}); 
        }

    }
    else{
        Object.defineProperty(this, comp.constructor.name, {value: comp, writable: false, configurable: true});
    }
    this.components.push(comp);
}

function hasComponent(comp){
    for(let element of this.components){
        if(element.constructor.name === comp.constructor.name){
            return true;           
        }
    }
    return false;
}

function getComponentListCopy(){ //returns a copy (by value, not by reference) of the 'components' list.
    return this.components.slice();
    
}

function deleteComponentByIndex(index){ //remove a component by its index.

    if(index >= this.components.length ){
        throw new Error("Index outside components array.");
    }

    //removing the component's property from the threejs object.
    const comp = this.components[index];
    const compProp = this[comp.constructor.name];
    if(Array.isArray(compProp)){ //handling multiple components of the same type
        const index = this.compProp.indexOf(comp);
        if (index > -1) {
            this.compProp.splice(index, 1); 
        }
    }
    else{
        Object.defineProperty(this, comp.constructor.name, {value: undefined, writable: false, configurable: true});
    }


    this.components.splice(index, 1); //removing the component from the components array.


}

function getComponentByIndex(index){ //get a component by its index.
    if(index >= this.components.length ){
        throw new Error("Index outside components array.");
    }
    return this.components[index];
}

function getComponentByType(type){ //returns first component found of type, if not found returns undefined.
    for(let element of this.components){
        if(element.constructor.name === type.name){
            return element;           
        }
    }
    return undefined;
}

function getMultipleComponentsByType(type){ //returns list of all components of type found, if none found returns an empty list.
    const comps = [];
    this.components.forEach(element => { 
        if(element.constructor.name === type.name){
            comps.push(element);
        }
    });
    return comps;
}

function setWorldPositionRotation(newPos, newRot){
    if (this.parent === appData.scene){
        this.position.set(newPos.x, newPos.y, newPos.z);
        this.quaternion.set(newRot.x, newRot.y, newRot.z, newRot.w);
        return;
    }
    const parent = this.parent;
    const parentQuat = new THREE.Quaternion(this.parent.quaternion.x, this.parent.quaternion.y, this.parent.quaternion.z, this.parent.quaternion.w);
    const newRotThree = new THREE.Quaternion(newRot.x, newRot.y, newRot.z, newRot.w);

    const res = newRotThree.inverse(parentQuat);

    this.position.set(newPos.x - parent.position.x, newPos.y - parent.position.y, newPos.z - parent.position.z);
    this.quaternion.set(res.x, res.y, res.z, res.w);
}
