import { EventEmitter } from 'events'

export default class Time extends EventEmitter 
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0
        this.delta = 16

        // wait one frame then call this.tick()
        window.requestAnimationFrame(() => this.tick())
    }

    tick() 
    {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.emit('tick')

        window.requestAnimationFrame(() => this.tick())
    }
}