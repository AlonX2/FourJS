import FOUR from '../base/index.js';
import Physics from '../base_components/Physics.js';
import PhysicsManager from '../base_components/PhysicsManager.js';
import { Body } from '../base_components/Physics.js';
import {harmonic} from './harmonicMovement.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );

//Setting up lighting
const light1 = new THREE.SpotLight()
light1.position.set(2.5, 20, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(-2.5, 20, 5)
light2.angle = Math.PI / 4
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = 1024
light2.shadow.mapSize.height = 1024
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)

const light3 = new THREE.SpotLight()
light3.position.set(1, 5, 5)
light3.angle = Math.PI / 4
light3.penumbra = 0.5
light3.castShadow = true
light3.shadow.mapSize.width = 1024
light3.shadow.mapSize.height = 1024
light3.shadow.camera.near = 0.5
light3.shadow.camera.far = 20
scene.add(light3)

FOUR.include(camera);
camera.position.z = 20;

renderer.shadowMap.enabled = true;

document.body.appendChild( renderer.domElement );

const randColor = () =>  {
    return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

//creates a single box of a random color, with a physics component and a mass of 0.4
const makeBoxOfDimension = (parent = scene, width = 1, height = 1, length = 1) => {
    const boxGeometry = new THREE.BoxGeometry( width, height, length);
    const boxMaterial = new THREE.MeshBasicMaterial( { color: randColor() } );
    const box = new THREE.Mesh( boxGeometry, boxMaterial );
    parent.add( box );
    box.position.x = (Math.random() - 0.5) * -25;
    box.position.z = (Math.random() - 0) * -50;
    box.position.y = (Math.random() - 0) * 100;

    FOUR.include(box);
    box.addComponent(Physics);
    box.Physics.attributes.mass = 0.4;
    return box;
}

const createInstances = (num = 100, parent) => {
    for (let index = 0; index < num; index++) {
        makeBoxOfDimension(parent);
    }
}

//creates the physics manager
const manager = new THREE.Object3D();
FOUR.include(manager);
manager.addComponent(PhysicsManager);

//creating the platform
const platform = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhongMaterial({ color: 0x2c1fc0 }));
scene.add( platform );
platform.position.y = -5;

//handling the platform FourJS attributes
FOUR.include(platform);
platform.addComponent(Physics);
platform.Physics.attributes.type = Body.STATIC;
platform.Physics.attributes.mass = 1500;
manager.PhysicsManager.attributes.scope.bindingObj = platform;

platform.castShadow = true;
platform.receiveShadow = true;

createInstances(300);

//starting the simulation
FOUR.init(renderer, scene, camera);

