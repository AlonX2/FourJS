import * as FOUR from "../base/index.js";
// import { Vec3 } from "../js/cannon/cannon-es.js";

export default class quat extends FOUR.Component{
    // awake(){
    // }
    start(){

        this.rotate = false;
        document.body.addEventListener("keydown", (evt) => {//when this happens
            let e = evt.key;
            if (e === 'r'){
                this.obj.rotation.y += 0.1;
            }
            else if (e === 't'){
                this.obj.rotation.z += 0.1;
            }

        });
    }

    fixedUpdate(){
        // if(this.rotate){
        //     this.obj.rotation.y += 0.1;
        // }
    }

}