import * as THREE from 'three';
import Experience from '../Experience';
import gsap from 'gsap';
import roomVertexShader from './shaders/room/vertex.glsl';
import roomFragmentShader from './shaders/room/fragment.glsl';
import tvVertexShader from './shaders/tv/vertex.glsl';
import tvFragmentShader from './shaders/tv/fragment.glsl';
import monitorVertexShader from './shaders/monitor/vertex.glsl';
import monitorFragmentShader from './shaders/monitor/fragment.glsl';

export default class Room {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.sizes = this.experience.sizes;

		this.roomObj = this.experience.resources.items.room;
		this.room = this.roomObj.scene;

		// Lerp
		this.lerp = {
			current: 0,
			target: 0,
			ease: 0.1,
		};

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('room');
		}

		/**
		 * Textures
		 */
		this.bakedTextureNight = this.resources.items.bakedTextureNight;
		this.bakedTextureDay = this.resources.items.bakedTextureDay;
		this.bakedTextureNatural = this.resources.items.bakedTextureNatural;
		this.iphoneTexture = this.resources.items.iphoneTexture;
		this.projectDefaultTexture = this.resources.items.projectDefault;
		this.videoTexture = this.resources.items.video;

		this.setMaterials();
		this.setModel();
		this.mouseMove();
		this.animateChair();
		this.manageProject();
	}

	setMaterials() {
		this.bakedMaterial = new THREE.ShaderMaterial({
			vertexShader: roomVertexShader,
			fragmentShader: roomFragmentShader,
			uniforms: {
				uTextureDay: { value: this.bakedTextureDay },
				uTextureNight: { value: this.bakedTextureNight },
				uTextureNatural: { value: this.bakedTextureNatural },
				uMixNatural: { value: 0 },
				uMixNight: { value: 0 },
			},
		});

		// debug
		if (this.debugFolder) {
			this.debugFolder
				.add(this.bakedMaterial.uniforms.uMixNight, 'value')
				.min(0)
				.max(1)
				.step(0.001)
				.name('uMixNight');
			this.debugFolder
				.add(this.bakedMaterial.uniforms.uMixNatural, 'value')
				.min(0)
				.max(1)
				.step(0.001)
				.name('uMixNatural');
		}

		this.tvMaterial = new THREE.ShaderMaterial({
			vertexShader: tvVertexShader,
			fragmentShader: tvFragmentShader,
			uniforms: {
				uTexture: { value: this.projectDefaultTexture },
			},
		});

		this.monitorMaterial = new THREE.ShaderMaterial({
			vertexShader: monitorVertexShader,
			fragmentShader: monitorFragmentShader,
			transparent: true,
			uniforms: {
				uTexture: { value: this.videoTexture },
				uVisibility: { value: 0 },
			},
		});

		// Debug
		if (this.debugFolder) {
			this.debugFolder
				.add(this.monitorMaterial.uniforms.uVisibility, 'value')
				.min(0)
				.max(1)
				.step(0.001)
				.name('uVisibility');
		}

		this.caseMaterial = new THREE.MeshBasicMaterial({
			color: '#3DD6FF',
			transparent: true,
			opacity: 0.5,
		});
		this.fanCircleMaterial = new THREE.MeshBasicMaterial({ color: '#3DD6FF' });

		this.iphoneMaterial = new THREE.MeshBasicMaterial({
			map: this.iphoneTexture,
		});
	}

	setModel() {
		// Assign Our Own materials
		this.mergedRoom = this.room.children.find(
			(child) => child.name === 'MergedRoom'
		);
		this.chair = this.room.children.find((child) => child.name === 'Chair');
		this.monitorScreen = this.room.children.find(
			(child) => child.name === 'monitorScreen'
		);
		this.tvScreen = this.room.children.find(
			(child) => child.name === 'tvScreen'
		);
		this.caseCover = this.room.children.find(
			(child) => child.name === 'caseCover'
		);
		this.iphone = this.room.children.find((child) => child.name === 'iPhone');
		this.fanCircle = this.room.children.find(
			(child) => child.name === 'fanCircle'
		);

		this.mergedRoom.material = this.bakedMaterial;
		this.chair.material = this.bakedMaterial;
		this.tvScreen.material = this.tvMaterial;
		this.caseCover.material = this.caseMaterial;
		this.fanCircle.material = this.fanCircleMaterial;
		this.iphone.material = this.iphoneMaterial;
		this.monitorScreen.material = this.monitorMaterial;

		this.scene.add(this.room);

		// set a differenct size for room if the device size is less then 968px
		if (this.sizes.width < 968) {
			this.room.scale.set(0.05, 0.05, 0.05);
		} else {
			this.room.scale.set(0.07, 0.07, 0.07);
		}

		// Debug
		if (this.debugFolder) {
			this.debugFolder
				.add(this.chair.rotation, 'y')
				.min(-5)
				.max(5)
				.step(0.001)
				.name('chairRotationY');
		}
	}

	mouseMove() {
		const ratio = 0.25;

		// This variable is going to be used in RoomRaycaster.js
		this.mouse = new THREE.Vector2();

		document.addEventListener('mousemove', (event) => {
			// Taking care of the rotation of the room
			this.rotation = (event.clientX / this.sizes.width) * ratio - ratio / 2;
			this.lerp.target = this.rotation;

			// Setting the Coordinates of the mouse in normalized value
			this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
			this.mouse.y = -((event.clientY / this.sizes.height) * 2 - 1);
		});
	}

	animateChair() {
		// Set the original rotation of chair
		const chairOriginalRotationY = -1;
		this.chair.rotation.y = chairOriginalRotationY;

		this.timeline = gsap.timeline({
			repeat: -1,
			repeatDelay: 1,
		});
		this.timeline
			.to(this.chair.rotation, {
				y: 0,
				duration: 6,
				ease: 'power1.inOut',
			})
			.to(this.chair.rotation, {
				y: chairOriginalRotationY,
				duration: 6,
				delay: 1,
				ease: 'power1.inOut',
			});
	}

	manageProject() {
		this.projectLinks = document.querySelectorAll('.project');

		this.projectLinks.forEach((projectLink) => {
			const projectName = projectLink.dataset.project;
			this[`${projectName}Texture`] = this.resources.items[projectName];

			projectLink.addEventListener('mouseenter', () => {
				this.tvMaterial.uniforms.uTexture.value = this[`${projectName}Texture`];
			});

			// // Uncomment this if you want the texture to go back to initial one after mouse leave
			// projectLink.addEventListener('mouseleave', () =>
			// {
			//     this.tvMaterial.uniforms.uTexture.value = this.projectDefaultTexture;
			// })
		});
	}

	update() {
		// Lerping
		this.lerp.current = gsap.utils.interpolate(
			this.lerp.current,
			this.lerp.target,
			this.lerp.ease
		);

		// Update the rotation of the room
		this.room.rotation.y = this.lerp.current;
	}
}
