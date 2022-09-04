import {Component} from './Component.js';
import {include} from './include.js';

const entityArr = []; // all entities in the app are saved here.
let startedRunning = false; 
let FixedUpdateTimeStep = 20; //the time interval of fixedUpdate calls.
const appData = {renderer: undefined, scene: undefined, camera: undefined}; //data about the current state of the app.


function init(renderer, scene, camera){ //the function used to init the actual app - starts the frame cycle and calls the awake, start methods in all the components.
    appData.renderer = renderer;
    appData.scene = scene;
    appData.camera = camera;
    
    startedRunning = true;

    entityArr.forEach(entity => {
        entity.evokeStartInComponents();
    });
    
    //fixedUpdate runs in constant time intervals independent of frame rate.
    setInterval(() => {
        entityArr.forEach(entity => {
            entity.evokeFixedUpdateInComponents();
        });
    }, FixedUpdateTimeStep);

    FrameCycleLoop();
}

//the core loop of the application, runs every frame.
function FrameCycleLoop(){

    requestAnimationFrame(FrameCycleLoop);
    entityArr.forEach(entity => {
        entity.evokeUpdateInComponents();
    });

    appData.renderer.render(appData.scene, appData.camera);
}


export default {Component, init, include, startedRunning, appData, FixedUpdateTimeStep};
export {entityArr ,Component, init, include, startedRunning, appData, FixedUpdateTimeStep};
