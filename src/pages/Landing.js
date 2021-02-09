import React from 'react';
import './Landing.css'

import Game from '../components/Game/Game'
import LeftSection from '../components/LeftSection/LeftSection'
import RightSection from '../components/RightSection/RightSection'


function Landing() {
    return (
        <div className="landing">
            <LeftSection />
            <Game />
            <RightSection />
        </div>
    )
    
}

export default Landing;