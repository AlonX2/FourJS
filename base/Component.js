import { startedRunning } from "./index.js";

//all components extetend this class. components are custom scripts that have builtin methods that get called at certain times.
export class Component{ 
    #_active
    constructor(obj){ 
        
        if (typeof obj === 'undefined'){
            throw new Error('Cannot add component to undefined');
        }
        
        //user should add their listening functions to these signals.
        this.activated = new signals.Signal(); //activated signal, when dispatched it lets all its listeners know this component has been activated.
        this.deactivated = new signals.Signal(); //deactivated signal, when dispatched it lets all its listeners know this component has been deactivated.

        this.active = true; 
        this.attributes = {};
        this.obj = obj; 
        this.supportsMultipleInstances = true; //can this component have multiple instances of itself on a single object.
        if(typeof this.awake !== 'undefined'){
            this.awake();
        }
    }
    set active(val){ 
        if(val && !this.active && startedRunning){ //dispatching 'activated' and invoking awake and start if activating an inactive object and the app is running.
            this.activated.dispatch();
        }
        else if(!val && this.active && startedRunning){ //dispatches 'deactivated' if deactivating an active object.
            this.deactivated.dispatch();
        }
        this.#_active = val;

    }

    get active(){
        return this.#_active;
    }

    //returns an object that has a selected subset of properties from another object (all the properties refrence to the original). 
    static getSubsetObject(original, subset){ 
        const additions = {}; //the additional attributes on top of the subset object.
        if(Array.isArray(subset)){
            subset = new Set(subset);
        }
        const handler = {
            get: function (target, prop, receiver){
                if(!subset.has(prop)){
                    return additions[prop];
                }
                receiver = target;
                return Reflect.get(target, prop, receiver);
            },
            set: function (target, prop, value, receiver){
                if(!subset.has(prop)){
                    if(typeof target[prop] !== 'undefined'){//shouldent be in production versions.
                        console.warn("The attribute name '" + prop +"' is identical to a property name in the original subset object but does not reference to it, this might cause confusion.");
                    }
                    additions[prop] = value;
                    return true;
                }
                receiver = target;
                return Reflect.set(target, prop, value, receiver);

            },
            ownKeys: function (){
                return Array.from(subset).concat(additions.getOwnPropertyNames());
            }
        };
        return new Proxy(original, handler);
    }

    
}
