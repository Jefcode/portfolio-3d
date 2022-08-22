import * as THREE from 'three';

import Experience from "../../Experience";

export default class RoomRaycaster
{
    constructor()
    {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera
        this.roomObj = this.experience.world.room;
        this.room = this.roomObj.room;

        this.setInstance()
    }

    setMouseCoordinates()
    {
        this.mouse = this.roomObj.mouse;
    }

    setInstance()
    {
        this.raycaster = new THREE.Raycaster();

        this.setMouseCoordinates();
    }

    update()
    {
        this.raycaster.setFromCamera(this.mouse, this.camera.orthographic);

        // calculate objects intersecting the picking ray
        const objectToTest = this.roomObj.tvScreen;
        const intersect = this.raycaster.intersectObject( objectToTest );
        
        if(intersect.length)
        {
            console.log(intersect);
        }
    }
}