import * as THREE from 'three';
import Debug from './Utils/Debug.js';
import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Camera from './Camera.js'
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js';
import Stats from './Utils/Stats.js';
import Preloader from './World/Preloader.js';
import Controls from './World/Controls.js';

let instance = null

export default class Experience 
{
    constructor(canvas) 
    {
        // Singleton
        if(instance) {
            return instance
        }
        instance = this

        // Global access
        window.experience = this;

        // Options 
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        this.stats = new Stats();
        // this.preloader = new Preloader();

        // this.preloader.on('loaderdone', () => 
        // {
        //     this.controls = new Controls();
        // })

        // Sizes resize event
        this.sizes.on('resize', () => this.resize());

        // Time tick event
        this.time.on('tick', () => this.update());
    }

    resize() 
    {
        // Update Camera
        this.camera.resize()

        this.world.resize();

        // Update Renderer
        this.renderer.resize();
    }

    update() 
    {
        this.stats.start();

        this.camera.update();

        this.world.update();

        this.renderer.update();

        this.stats.end();
    }

    destroy()
    {
        this.sizes.off('resize');
        this.time.off('tick');

        // Traverse the whole scene
        this.scene.traverse((child) => 
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose();

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key];

                    // Check if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose();
                    }
                }
            }
        })

        // Dispose OrbitControls
        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if(this.debug.active)
        {
            this.debug.ui.destroy();
        }

        // remove native event listeners
        this.sizes.destroy();
    }
}