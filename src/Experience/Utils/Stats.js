import stats from 'stats.js';

export default class Stats
{
    constructor()
    {
        this.active = window.location.hash === '#debug';

        if(this.active)
        {
            this.stats = new stats();
            this.stats.showPanel(0);
            document.body.appendChild(this.stats.dom);
        }
    }

    start()
    {
        if(this.active)
            this.stats.begin();
    }

    end()
    {
        if(this.active)
            this.stats.end();
    }
}