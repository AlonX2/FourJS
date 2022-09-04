import FOUR from "../base/index.js";

export class comp extends FOUR.Component{

    awake(){
        this.directionToRight = true; 
    }

    start(){
        
    }
    
    fixedUpdate(){
        this.obj.rotation.x += 0.05;
        if(this.obj.position.x > 5){
            this.directionToRight = false;
        }
        if(this.obj.position.x < -5){
            this.directionToRight = true;
        }
        if(this.directionToRight){
            this.obj.position.x += 0.05;
        }
        else{
            this.obj.position.x -= 0.05;

        }
        this.obj.material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
        
    }
    
}
