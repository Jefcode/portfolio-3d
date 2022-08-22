import * as THREE from 'three';
import Experience from "../Experience";

export default class Floor
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.debug = this.experience.debug;
        this.resources = this.experience.resources;

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Floor');
        }

        this.setInstance();
    }

    setInstance()
    {
        this.instance = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({ 
                color: '#262b29'
            })
        )

        this.instance.rotation.x = - Math.PI * 0.5
        this.instance.position.y = -0.4;
        this.scene.add(this.instance);

        // Debug
        if(this.debugFolder)
        {
            this.debugFolder.addColor(this.instance.material, 'color')
        }
    }
}