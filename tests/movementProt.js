import FOUR from "../base/index.js";
import Physics from "../base_components/Physics.js";

export class movement extends FOUR.Component{

    awake(){
        
    }

    start(){
        
        
        const characterSpeed = 0.25;
        document.body.addEventListener("keydown", (evt) => {//when this happens
            let e = evt.key;
            switch (e)
            {
                case 'w': //w
                    this.obj.Physics.body.velocity.x -= characterSpeed;
                    break;
                case 's': //s
                    this.obj.Physics.body.velocity.x += characterSpeed;
                    break;
                case 'ArrowUp': //up arrow
                    this.obj.position.x -= characterSpeed;
                    break;
                case 'ArrowDown': //down arrow
                    this.obj.position.x += characterSpeed;
                    break;
            } 

        });
    }
    
    update(){
        
    }
    
}
