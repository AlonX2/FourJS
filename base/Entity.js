
export class Entity{
    constructor(obj){
        this.obj = obj;
    }

    evokeUpdateInComponents(){ //called every frame, evokes the Update methods in all the components.
        this.obj.components.forEach(component => {
            if(typeof component.update !== 'undefined' && component.active){
                component.update();
            }
        });
    }
    evokeStartInComponents(){ //called once at the construction of the object, evokes the Start methods in all the components.
        this.obj.components.forEach(component => {
            if(typeof component.start !== 'undefined' && component.active){
                component.start();
            }
        });
    }
    evokeFixedUpdateInComponents(){ //called a fixed amount of times per second defined in index.js. evokes the fixedUpdate in all the components.
        this.obj.components.forEach(component => {
            if(typeof component.fixedUpdate !== 'undefined' && component.active){
                component.fixedUpdate();
            }
        });
    }
}
