import React from "react";

class Player extends React.Component{
    render() {
        return(
            <div id="player" style={{
                position: "absolute",
                width: "fit-content",
                margin: 0,
                // transform: `translateX(550px) translateY(840px)`,
                transform: `translateY(${this.props.playerInfo.playerTargetY}px) translateX(${this.props.playerInfo.playerTargetX}px)` ,
                }}>
                    Player
                </div>
        )
    }
}

export default Player;