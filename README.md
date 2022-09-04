# what is FourJS?
FourJS is a library that adds a physics engine (CannonJS) and component functionality to ThreeJS and streamlines the workflow with the framework.

# short docs
Note: These docs assume basic familiarity with ThreeJS and javascript.
Note: FourJS is a work in progress.

## using premade components:

#### What is a component?
A component is a class that is connected to a ThreeJS object and executes code every frame (and whan the object is activated/deactivated).  
For example, a component could be a movement system that handles player input and moves an object accordingly.  
The beauty of a component system is its' scalability. once you write a component once, you can add it to how many objects you want.  
In addition, it provites abstraction, as an object can have multiple components where every component is in charge of a spacific niche in the behavior of the object.

component related methods and attributes:

#### `Four.include(Object)`
FourJS sits on top of ThreeJS. That means that you can choose when to extend a ThreeJS obejct with FourJS functionality.  
in order to extend a ThreeJS object with FourJS functionality you use the `Four.include(object)` method.  
This method adds (in runtime) all the quality of life methods that FourJS provides, such as the component system, to the object.  
Note: all the following methods only work if you previously called `Four.include` with the ThreeJS object in question.  

#### `Four.init(renderer, camera, scene)`
This method starts the "frame cycle", the frame loop that calls each component every frame. Usualy called once all the objects were set up with the correct components.  
You pass all the objects that are needed in order to render things to the screen (these objects should be created prior to calling this function using the ThreeJS methods).  
You can think of this method like a "play button" - it starts the actual core frame loop of the program.

  
#### `Object.addComponent(componentName, args)`
This method is called from the object with the class name of the component you're instrested in adding (Not an instance of it). You can also pass additional arguments the are passed to the component constructor.  
For example: `box.addComponent(Physics)` would add the `Physics` component to the `box` object.  
Once this method is called the component can run code whenever it wants (though usualy it is every frame/on program start).  
After you added a component to an object you can access its' properties with `Object.CompName`.

#### `Object.componentName.attributes`
Usualy most of a compnents' "settings" are under this attributes object.

#### `object.componentName.active`
A proparty that dictates whether a component can run code. If a component is not active it is as if it doesn't exist. You shuold generaly prefer to deactivate a component over deleting it.  
When a component is deactivated it can execute code to prep its' deacivation.

#### `Object.getComponentListCopy()`
returns a copy (by value) of the component list of an objects' component list.

#### `Object.deleteComponentByIndex(index)`
removes a component from an object by its' index in the component list.

#### `Object.hasComponent(comp)`
Gets a component class name and returns True or False depending on whether the object has a component of that type.

#### `Object.getComponentByType(type)`
gets a component class name and returns the first component found of that type.

#### `Object.getMultipleComponentsByType(type)`
gets a component class name and returns a list of all components found of that type. If none are found returns an empty list.

#### `Object.getComponentByIndex(index)`
returns a component by its' index in the component list.

## Creating components:

#### basic structure of a component:
A component should be a class that extends the Four.Component class.
Every component has a few "keyword" functions it can use in order to execute code in cirtain times.  
These functions are:

#### `Awake()`
These method runs immediately after the component is added to an object (thus, usualy before the frame cycle has bagun), you can look at it as a constuctor.  
It should be used to create proparties and prepare the structure of the component for frame cycle.

#### `start()`
This method runs once when the frame cycle has begun.  
Use it to initialize the component and do all oparations that are needed to be done before any frames are rendered.

#### `update()`
This method runs every frame. Usualy the "main" method of the component. Use can use it to change the object or collect information or anything else that is needed to be done on a frame-by-frame basis.

#### `fixedUpdate()`
This method is called once every constant amound of time (you can access and change this amound of time with `Four.FixedUpdateTimeStep`).  
You should use this method for calculations and oparations that should not be framerate dependent (for example moving an object, since if that would be framerate dependent the object would move faster for people who have faster machines, and thus higher framerates).  
If you wanna implament a spacial case of this method for a specific component with a custom timestep, we suggest using `setInterval(this.lazyUpdate.bind(this), timestep)`. that would create a `lazyUpdate` method with a custom timestep for that specific component.    

some builtin proparties and methods we provide are:

#### `this.attributes'
An array proparty that should be used for all the "settings" of the component. For example if the component moves an object, an attribute could be movement speed.

#### `this.supportsMultipleInstances`
should the user be allowed to add multiple insatnces of this component to a single object.

#### `this.activated`
An event fired when the object is activated. You can subscribe to it with `this.activated.add(this.customOnActivatedMethod, this)`.

#### `this.deactivated`
An event fired when the object is deactivated. You can subscribe to it with `this.activated.add(this.customOnDeactivatedMethod, this)`.      

In addition, we provite a quality of life methods such as:

#### `Component.getSubsetObject(original, subset)`
A QOL method that can be used when you want to add to the atttributes array a subset of a diffrent settings object. The subset argument is an array/set that spacifies the proparties the subset obejct will have.  
It returns a proxy that redirects to the original settings object for the "allowed" proparties from the original.

## Using the bultin Physics component:
#### The PhysicsManager:
In order for the Physics system to work, you first need to create an object with the PhysicsManager component. We suggest not thinking much of it and implamenting it as such (note that this workflow might change in the future):
```
const manager = new THREE.Object3D();
FOUR.include(manager);
manager.addComponent(PhysicsManager);
```
The PhysicsManager is important since it handles the Physics calls every frame. In addition, it provites a attribute that can help you make your program more efficient:

#### `physicsMangerObject.PhysicsManger.attributes.scope.bindingObj`
This is an attribute you can use if you want you physics to only be calculated in a cirtain scope. For example if an object gets far from the camera, you might not want its' physics to be calculated anymore. Thus, you can set the bindingObj as the camera, and if an object gets to a certain range away from it, its' physics will no longer be calculated.  
You can set the range of the bindingObj with `physicsMangerObject.PhysicsManger.attributes.scope.range`.

#### The Physics component:
You can add Physics to an object with `Object.addComponent(Physics)`.  
currently, you have these attributes in the physics component:

#### `Object.Physics.attributes.mass`
sets the mass of the object.

#### `Object.Physics.attributes.type`
The type of physics calculations; Dynamic/Kinematic/Static.  
You can read more about the diffrent types in the cannonJS docs here: https://pmndrs.github.io/cannon-es/docs/modules.html  
Example of setting a type:
```
import { Body } from '../base_components/Physics.js';
object.Physics.attributes.type = Body.STATIC;
```













