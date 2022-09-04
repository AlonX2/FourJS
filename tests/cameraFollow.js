import { Component, appData } from "../base/index.js";

export default class CameraFollow extends Component{
    start(){
        this.camera = appData.camera;
    }
    update(){
        appData.camera.position.x = this.obj.position.x;
        appData.camera.position.y = this.obj.position.y + 5;
        appData.camera.position.z = this.obj.position.z + 20;
    }
}