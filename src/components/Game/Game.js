import React from "react";

import './Game.css'

import Player from '../Player/Player'

class Game extends React.Component {

    state = {
        playerTargetY: 0,
        playerTargetX: 0,
        // playerRotation: 0,

    }

    // gets the player position current position on screen
    getPlayerCurPos = () => {
        const playerEl = document.getElementById('player');
        const playerCurPos = playerEl.getBoundingClientRect();
        // console.log(playerCurPos);
        return playerCurPos;
    }

    componentDidMount () {
        const playersize = this.getPlayerCurPos().width
        // sets player initial position
        const initPosX = window.innerWidth/2 - playersize/2; //at the middle of the x AXIS
        const initPosY = window.innerHeight - 18; //at the bottom of the screen// the subtration of 18 is to take in account the playr height
        this.setState({playerTargetX: initPosX, playerTargetY: initPosY});

    }

    render(){
        return(
            <>
            <Player playerInfo={this.state}/>
            <section className='game'>Game</section>
            </> 
        )
    }
}

export default Game;