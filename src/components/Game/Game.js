import React from "react";

import './Game.css'

import Player from '../Player/Player'

class Game extends React.Component {

    state = {
        playerTargetY: 0,
        playerTargetX: 0,
        // playerRotation: 0,

        speed: 0

    }

    // gets the player position current position on screen
    getPlayerCurPos = () => {
        const playerEl = document.getElementById('player');
        const playerCurPos = playerEl.getBoundingClientRect();
        // console.log(playerCurPos);
        return playerCurPos;
    }

    componentDidMount () {
        const playerMeasurement = this.getPlayerCurPos();
        // sets player initial position
        const initPosX = window.innerWidth/2 - playerMeasurement.width/2; //at the middle of the x AXIS
        const initPosY = window.innerHeight - playerMeasurement.height; //at the bottom of the screen// the subtration of 18 is to take in account the playr height
        this.setState({playerTargetX: initPosX, playerTargetY: initPosY});
        this.handleKeyboardMovement();

    }

    // they way movement works is by setting the target at either far right or far left on key down
    //then on key up set the target to the players current position making them stop
    lateralMove = (movementTarget) => {
        this.setState({playerTargetX: movementTarget, speed: 1.5})
    }

    stopMovement = (pos, speed=1.5) => {
        this.setState({playerTargetX: pos.x, speed});
    }

    handleKeyboardMovement = () => {

        document.addEventListener('keydown', (e) => {
            // console.log(e.code);
            if(e.code === "ArrowRight") {
                    //get the right border of the playable area in screen location
                    const rightBorder = (window.innerWidth/2) + (320/2);// half of the screen plus halfof the playable area
                    console.log(rightBorder)
                    const curPos = this.getPlayerCurPos();
                    // this is not working to well //couldnt figure out why; solution if they touch wall they die
                    if( curPos.x + curPos.width >= rightBorder){//if the player reachs the border 
                        console.log("should stop")
                        console.log("touch wall die") //start some event here to say game over
                        this.stopMovement({x: rightBorder - curPos.width, y: this.state.playerTargetY}, 0);//stop them there and raise the flag on the rightborder
                        
                        
                    } else {
                        this.lateralMove(window.innerWidth);// start to move right
                    }
            } else if(e.code === "ArrowLeft") {
                    const leftBorder = (window.innerWidth/2) - (320/2);
                    console.log(leftBorder);
                    const curPos = this.getPlayerCurPos();
                    if (curPos.x <= leftBorder) {
                        console.log("should stop")
                        console.log("touch wall die")// start some event here to say gameover
                        this.stopMovement({x: leftBorder, y: this.state.playerTargetY}, 0);//stop them there and raise the flag on the leftborder
                        
                    } else {  
                        this.lateralMove(0);// start to move left
                    }

            }
        });

        document.addEventListener('keyup', (e) => {
            // console.log(e.code);
            if(e.code === "ArrowRight") {
                
                const rightBorder = (window.innerWidth/2) + (320/2);
                const curPos = this.getPlayerCurPos();
                if( curPos.x + curPos.width >= rightBorder){
                    console.log("game over")// game over here too just in case
                    return this.stopMovement({x: rightBorder - curPos.width, y: this.state.playerTargetY}, 0);

                } else {
                    return this.stopMovement(this.getPlayerCurPos());
                }
               
            } else if(e.code === "ArrowLeft") {
                const leftBorder = (window.innerWidth/2) - (320/2);
                const curPos = this.getPlayerCurPos();
                if (curPos.x <= leftBorder) {
                    console.log("game over") //game over here just in case
                        return this.stopMovement({x: leftBorder, y: this.state.playerTargetY}, 0);
                }else {
                    this.stopMovement(this.getPlayerCurPos());
                }
                
            }
        });
        
        

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