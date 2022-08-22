import gsap from 'gsap';
import { EventEmitter } from 'events';
import Experience from "../Experience";

export default class Preloader extends EventEmitter
{
    constructor()
    {
        super();

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.sizes = this.experience.sizes;

        // DOM Elements neded
        this.preloader = document.querySelector('.preloader')
        this.preloaderContent = document.querySelector('.preloader-content')
        this.progressBarElement = document.querySelector('.progress-bar');
        this.percentageElement = document.getElementById('percentage');
        
        this.heroTitleContainer = document.querySelector('.hero-title-container');
        this.heroDescriptionContainer = document.querySelector('.hero-description-container');
        this.heroScrollIcon = document.querySelector('.hero-scroll-icon');

        this.resources.on('progress', (data) => 
        {
            // Data holds => itemUrl, itemsLoaded, itemsTotal
            this.manageLoader(data); 
        });

        this.resources.on('loaded', () => 
        {
            this.manageAnimation();
        })
    }

    manageLoader(data)
    {
        const ratio = data.itemsLoaded / data.itemsTotal;
        this.percentageElement.innerText = Math.round((Math.round(ratio * 100) / 100) * 100);
        this.progressBarElement.style.transform = `scaleX(${ratio})`;
    }

    onScroll(event) {
        if(event.deltaY > 0)
        {
            this.removeEventListeners();
            this.hideScrollIcon();
            console.log('scroll');
        }
    }

    onTouch(event)
    {
        this.initY = event.touches[0].clientY
    }

    onTouchMove(event) 
    {
        let currentY = event.touches[0].clientY;
        let difference = this.initY - currentY;

        if(difference > 0)
        {
            this.removeEventListeners();
            this.hideScrollIcon();
        }

        this.initY = null;
    }

    removeEventListeners() 
    {
        document.removeEventListener('wheel', this.scrollDownOnce)
        document.removeEventListener('touchstart', this.touchStart);
        document.removeEventListener('touchmove', this.touchMove);
    }

    scrollEvent() 
    {
        this.scrollDownOnce = (event) => this.onScroll(event);
        this.touchStart = (event) => this.onTouch(event);
        this.touchMove = (event) => this.onTouchMove(event);
        document.addEventListener('wheel', this.scrollDownOnce)
        document.addEventListener('touchstart', this.touchStart);
        document.addEventListener('touchmove', this.touchMove);
    }

    hideScrollIcon() 
    {
        gsap.to(this.heroScrollIcon, {
            opacity: 0,
            duration: 0.5,
        })
    }

    manageAnimation()
    {
        // Animation
        setTimeout(() => 
        {
            // Bringing room and floor
            this.roomObj = this.experience.world.room;
            this.room = this.roomObj.room;
            this.floor = this.experience.world.floor.instance;
            
            this.timeline = gsap.timeline()
            .to(this.preloaderContent, {
                    opacity: '0',
            })
            .to(this.preloader, {
                opacity: '0',
            })
            .set(this.preloader, {
                display: 'none',
            })
            .from(this.room.position, {
                y: -2, 
                duration: 1,
                ease: 'power4.out'
            })
            .set(this.floor.position, {
                y: -3
            })
            .from(this.heroTitleContainer, {
                marginRight: '-10px',
                opacity: '0'
            })
            .from(this.heroDescriptionContainer, {
                marginLeft: '-10px',
                opacity: 0,
            }, '-=0.3')
            .from(this.heroScrollIcon, {
                opacity: 0,
                onComplete: () => 
                {
                    this.emit('loaderdone');
                    // this.scrollEvent();
                }
            })

        }, 1000)
    }
}