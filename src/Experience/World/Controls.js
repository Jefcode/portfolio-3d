import * as THREE from 'three';
import Experience from '../Experience.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import ASScroll from '@ashthornton/asscroll';

export default class Controls {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
		this.camera = this.experience.camera;
		this.sizes = this.experience.sizes;
		this.loader = this.experience.world.loader;

		this.roomObj = this.experience.world.room;
		this.room = this.roomObj.room;
		gsap.registerPlugin(ScrollTrigger);

		document.querySelector('.page').style.overflow = 'visible';

		this.setSmoothScroll();
		this.setScrollTrigger();
	}

	setupASScroll() {
		// https://github.com/ashthornton/asscroll
		const asscroll = new ASScroll({
			ease: 0.1,
			disableRaf: true,
		});

		gsap.ticker.add(asscroll.update);

		ScrollTrigger.defaults({
			scroller: asscroll.containerElement,
		});

		ScrollTrigger.scrollerProxy(asscroll.containerElement, {
			scrollTop(value) {
				if (arguments.length) {
					asscroll.currentPos = value;
					return;
				}
				return asscroll.currentPos;
			},
			getBoundingClientRect() {
				return {
					top: 0,
					left: 0,
					width: window.innerWidth,
					height: window.innerHeight,
				};
			},
			fixedMarkers: true,
		});

		asscroll.on('update', ScrollTrigger.update);
		ScrollTrigger.addEventListener('refresh', asscroll.resize);

		requestAnimationFrame(() => {
			asscroll.enable({
				newScrollElements: document.querySelectorAll(
					'.gsap-marker-start, .gsap-marker-end, [asscroll]'
				),
			});
		});
		return asscroll;
	}

	setSmoothScroll() {
		this.setupASScroll();
	}

	desktop() {
		/**
		 * Resets
		 */
		this.room.position.set(0, 0, 0);
		this.room.scale.set(0.07, 0.07, 0.07);

		// First move of the scene
		this.firstMoveTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.first-move',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					// markers: true,
					invalidateOnRefresh: true,
				},
			})
			.fromTo(
				this.room.position,
				{
					x: 0,
				},
				{
					x: () => this.sizes.width * -0.000675,
				}
			);

		// Second move of the scene
		this.secondMoveTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.second-move',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					// markers: true,
					invalidateOnRefresh: true,
				},
			})
			.fromTo(
				this.room.position,
				{
					y: 0,
				},
				{
					x: () => this.sizes.width * -0.0005,
					y: -1,
				},
				'x'
			)
			.fromTo(
				this.room.scale,
				{
					x: 0.07,
					y: 0.07,
					z: 0.07,
				},
				{
					x: 0.2,
					y: 0.2,
					z: 0.2,
				},
				'x'
			)
			.fromTo(
				this.roomObj.bakedMaterial.uniforms.uMixNatural,
				{
					value: 0,
				},
				{
					value: 1,
				},
				'x'
			);

		// Third move of the scene
		this.thirdMoveTimeline = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.third-move',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					// markers: true,
					invalidateOnRefresh: true,
				},
			})
			.to(
				this.room.position,
				{
					x: 0,
					y: -1.5,
				},
				'y'
			)
			.to(
				this.room.scale,
				{
					x: 0.25,
					y: 0.25,
					z: 0.25,
				},
				'y'
			)
			.to(
				this.roomObj.bakedMaterial.uniforms.uMixNatural,
				{
					value: 0,
				},
				'y'
			)
			.to(
				this.roomObj.bakedMaterial.uniforms.uMixNight,
				{
					value: 1,
				},
				'y'
			)
			.to(
				this.roomObj.monitorMaterial.uniforms.uVisibility,
				{
					value: 1,
				},
				'y'
			);
	}

	mobile() {
		/**
		 * Resets
		 */
		this.room.position.set(0, 0, 0);
		this.room.scale.set(0.05, 0.05, 0.05);

		// First move of the scene
		this.firstMoveTimelineMobile = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.first-move',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					// markers: true,
					invalidateOnRefresh: true,
				},
			})
			.fromTo(
				this.room.position,
				{
					x: 0,
					y: 0,
					z: 0,
				},
				{
					x: 0,
					y: 0,
					z: 0,
				},
				'same'
			)
			.fromTo(
				this.room.scale,
				{
					x: 0.05,
					y: 0.05,
					z: 0.05,
				},
				{
					x: 0.07,
					y: 0.07,
					z: 0.07,
				},
				'same'
			);

		// Second move of the scene
		this.secondMoveTimelineMobile = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.second-move',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					// markers: true,
					invalidateOnRefresh: true,
				},
			})
			.fromTo(
				this.roomObj.bakedMaterial.uniforms.uMixNatural,
				{
					value: 0,
				},
				{
					value: 1,
				},
				'z'
			)
			.to(
				this.room.position,
				{
					x: () => this.sizes.width * -0.002,
				},
				'z'
			)
			.to(
				this.room.scale,
				{
					x: 0.15,
					y: 0.15,
					z: 0.15,
				},
				'z'
			);

		// Third move of the scene
		this.thirdMoveTimelineMobile = gsap
			.timeline({
				scrollTrigger: {
					trigger: '.third-move',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.6,
					// markers: true,
					invalidateOnRefresh: true,
				},
			})
			.to(
				this.room.position,
				{
					x: 0.6,
					y: -1.5,
				},
				'a'
			)
			.to(
				this.room.scale,
				{
					x: 0.25,
					y: 0.25,
					z: 0.25,
				},
				'a'
			)
			.to(
				this.roomObj.bakedMaterial.uniforms.uMixNatural,
				{
					value: 0,
				},
				'a'
			)
			.to(
				this.roomObj.bakedMaterial.uniforms.uMixNight,
				{
					value: 1,
				},
				'a'
			)
			.to(
				this.roomObj.monitorMaterial.uniforms.uVisibility,
				{
					value: 1,
				},
				'a'
			);
	}

	setScrollTrigger() {
		ScrollTrigger.matchMedia({
			// Desktop
			'(min-width: 969px)': () => {
				this.desktop();
			},

			// Mobile
			'(max-width: 968px)': () => {
				this.mobile();
			},

			all: () => {
				/**
				 * Section animation on scroll
				 */
				this.sections = document.querySelectorAll('.section');
				this.sections.forEach((section) => {
					if (section.classList.contains('right')) {
						gsap.to(section, {
							borderTopLeftRadius: 0,
							scrollTrigger: {
								trigger: section,
								start: 'top bottom',
								end: 'top top',
								scrub: 0.6,
							},
						});
						gsap.to(section, {
							borderBottomLeftRadius: 700,
							scrollTrigger: {
								trigger: section,
								start: 'bottom bottom',
								end: 'bottom top',
								scrub: 0.6,
							},
						});
					} else if (section.classList.contains('left')) {
						gsap.to(section, {
							borderTopRightRadius: 0,
							scrollTrigger: {
								trigger: section,
								start: 'top bottom',
								end: 'top top',
								scrub: 0.6,
							},
						});
						gsap.to(section, {
							borderBottomRightRadius: 700,
							scrollTrigger: {
								trigger: section,
								start: 'bottom bottom',
								end: 'bottom top',
								scrub: 0.6,
							},
						});
					}
				});
			},
		});
	}

	resize() {}

	update() {}
}
