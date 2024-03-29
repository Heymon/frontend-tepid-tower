import React from "react";
import character from"../../assets/16bitcharacter.jpg"

import './Player.css';

class Player extends React.Component{
    render() {
        return(
            <div id="player" style={{
                // transform: `translateX(550px) translateY(840px)`,
                transform: `translateY(${this.props.playerInfo.playerTargetY}px) translateX(${this.props.playerInfo.playerTargetX}px)` ,
                transition: `${this.props.playerInfo.speed}s linear`
                }}>
                    <img src={character} />
                </div>
        )
    }
}

export default Player;