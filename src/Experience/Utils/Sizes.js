import { EventEmitter } from 'events';
import Experience from '../Experience';

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        this.experienceElement = document.querySelector('.experience');
        let width = window.innerWidth;
        let height = window.innerHeight;

        this.experience = new Experience();
        this.canvas = this.experience.canvas;

        // Setup
        this.width = width;
        this.height = height;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.aspect = this.width / this.height;
        this.frustum = 2;

        // Resize Event
        window.addEventListener('resize', () => {
            let newWidth = this.experienceElement.offsetWidth;
            let newHeight = this.experienceElement.offsetHeight;

            // if (newWidth === width && newHeight === height) {
            // 	return;
            // }

            this.width = newWidth;
            this.height = newHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);
            this.aspect = this.width / this.height;

            this.emit('resize');
        });
    }

    destroy() {
        // Remove Resize Event
        window.removeEventListener('resize', () => {
            (this.width = window.innerWidth),
                (this.height = window.innerHeight),
                (this.pixelRatio = Math.min(window.devicePixelRatio, 2));
            console.log('resize happened');

            this.emit('resize');
        });
    }
}
