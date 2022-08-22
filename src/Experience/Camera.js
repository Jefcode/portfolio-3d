import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setPerspectiveCamera();
        this.setOrthographicCamera();
        // this.setOrbitControls();
    }

    setPerspectiveCamera() {
        this.perspective = new THREE.PerspectiveCamera(
            10,
            this.sizes.width / this.sizes.height,
            0.01,
            100
        );
        this.perspective.position.set(0, 4, 10);
        this.perspective.lookAt(new THREE.Vector3())
        this.scene.add(this.perspective);
    }

    setOrthographicCamera()
    {
        this.orthographic = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustum) / 2,
            (this.sizes.aspect * this.sizes.frustum) / 2,
            this.sizes.frustum / 2,
            -this.sizes.frustum / 2,
            -10,
            10
        );

        this.orthographic.position.y = 2;
        this.orthographic.position.z = 5;
        this.orthographic.rotation.reorder('YXZ');
        this.orthographic.rotation.x = -Math.PI / 10;
        this.scene.add(this.orthographic);

        // // Camera Helper
        // this.helper = new THREE.CameraHelper(this.orthographic)
        // this.scene.add(this.helper);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.orthographic, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        this.perspective.aspect = this.sizes.width / this.sizes.height
        this.perspective.updateProjectionMatrix();

        // Orthographic
        // Updating Orthographic Camera on resize
        this.orthographic.left = (-this.sizes.aspect * this.sizes.frustum) / 2;
        this.orthographic.right = (this.sizes.aspect * this.sizes.frustum) / 2;
        this.orthographic.top = this.sizes.frustum / 2;
        this.orthographic.bottom = -this.sizes.frustum / 2;
        this.orthographic.updateProjectionMatrix();
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }

        /**
         * Uncomment if you want the helper of orthographic camera get updated as 
         * the real one changes size
         */
        // this.helper.matrixWorldNeedsUpdate = true;
        // this.helper.update();
        // this.helper.position.copy(this.orthographic.position);
        // this.helper.rotation.copy(this.orthographic.rotation);
    }
}