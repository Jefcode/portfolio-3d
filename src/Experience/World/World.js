import * as THREE from 'three';

import Experience from '../Experience.js';
import Controls from './Controls.js';
import Floor from './Floor.js';
import Preloader from './Preloader.js';
import Room from './Room.js';
import RoomRaycaster from './shaders/RoomRaycaster.js';

export default class World {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		this.preloader = new Preloader();

		this.resources.on('loaded', () => {
			// Floor
			this.floor = new Floor();
			this.room = new Room();

			this.preloader.on('loaderdone', () => {
				this.controls = new Controls();
			});
		});
	}

	resize() {
		if (this.controls) {
			this.controls.resize();
		}
	}

	update() {
		if (this.room) this.room.update();

		if (this.roomRaycaster) {
			this.roomRaycaster.update();
		}
	}
}
