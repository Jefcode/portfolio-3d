import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EventEmitter } from 'events';

export default class Resources extends EventEmitter
{
    constructor(sources) 
    {
        super();

        // Options
        this.sources = sources;

        // Setup
        this.items = {}
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoadingManager();
        this.setLoaders();
        this.startLoading();
    }

    setLoadingManager()
    {
        this.loadingManager = new THREE.LoadingManager(
            // Loaded
            () => 
            {
                this.emit('loaded');
            },

            // Progress
            (itemUrl, itemsLoaded, itemsTotal) => 
            {
                this.itemsLoaded = itemsLoaded;
                this.itemsTotal = itemsTotal;
                this.emit('progress', {itemUrl, itemsLoaded, itemsTotal});
            } 
        );
    }

    setLoaders() 
    {
        this.loaders = {
            gltfLoader:  new GLTFLoader(this.loadingManager),
            textureLoader: new THREE.TextureLoader(this.loadingManager),
            cubeTextureLoader: new THREE.CubeTextureLoader(this.loadingManager),
            dracoLoader: new DRACOLoader(this.loadingManager)
        }

        // setup draco loader
        this.loaders.dracoLoader.setDecoderPath('draco/');
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }

    startLoading() 
    {
        // Load each sources
        for(const source of this.sources) 
        {
            switch (source.type) {
                case 'gltfModel':
                    this.loaders.gltfLoader.load(
                        source.path,
                        (file) =>
                        {
                            this.sourceLoaded(source, file);
                        } 
                    )
                    break;

                case 'texture':
                    this.loaders.textureLoader.load(
                        source.path,
                        (file) => 
                        {
                            file.flipY = false;
                            file.minFilter = THREE.NearestFilter;
                            file.magFilter = THREE.NearestFilter;
                            file.generateMipmaps = false;

                            this.sourceLoaded(source, file);
                        }
                    );
                    break;

                case 'cubeTexture':
                    this.loaders.cubeTextureLoader.load(
                        source.path,
                        (file) =>
                        {
                            this.sourceLoaded(source, file);
                        } 
                    );
                    break;

                case 'videoTexture':
                    // Everything related to HTML Part
                    this.video = {};

                    // related to three.js configuration for video texture
                    this.videoTexture = {};

                    this.video[source.name] = document.createElement('video');
                    this.video[source.name].src = source.path;
                    this.video[source.name].muted = true;
                    this.video[source.name].playsInline = true;
                    this.video[source.name].autoplay = true;
                    this.video[source.name].loop = true;
                    this.video[source.name].play();

                    this.videoTexture[source.name] = new THREE.VideoTexture(this.video[source.name]);

                    this.videoTexture[source.name].flipY = false;
                    this.videoTexture[source.name].minFilter = THREE.NearestFilter;
                    this.videoTexture[source.name].magFilter = THREE.NearestFilter;
                    this.videoTexture[source.name].generateMipmaps = false;
                    this.videoTexture[source.name].encoding = THREE.sRGBEncoding;

                    this.sourceLoaded(source, this.videoTexture[source.name]);

                    break;
            
                default:
                    break;
            }
        }
    }

    sourceLoaded(source, file) 
    {
        this.items[source.name] = file;
    }
}