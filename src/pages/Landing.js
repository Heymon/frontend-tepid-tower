import React from 'react';
import './Landing.css'

import Game from '../components/Game/Game'
import Player from '../components/Player/Player'


function Landing() {
    return (
        <div className="landing">
            <section>
                <h1>Title Rght</h1>
            </section>
            <Game />
            <section>
                <h1>Options Left</h1>
            </section>
        </div>
    )
    
}

export default Landing;