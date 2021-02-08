import React from "react";

import './Game.css'

import Player from '../Player/Player'

class Game extends React.Component {



    render(){
        return(
            <>
            <Player />
            <section className='game'>Game</section>
            </> 
        )
    }
}

export default Game;