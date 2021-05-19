import React from "react";

import './Game.css'

import Player from "../Player/Player";
import PlatformContainer from "../Platform/PlatformContainer";
import DeathZone from "../DeathZone/DeathZone";

import GetGameState from "../../recoil/components/GetGameState";

class Game extends React.Component {

    state = {
        gameStatus:true,

        playerTargetY: 0,
        playerTargetX: 0,
        // playerRotation: 0,

        playerLanded: true,
        playerJumping: false,
        playerFalling: false,

        speed:0,
        jumpGauge: 5,
        gauge: null,

        curPlatform: null,

        isScrolling: false,
        scrollingFunc: 0,
        scrollingSpeed: 5,
        scrollingAdjustment: 5,

        points:0,

        // testing
        movementToggle: false,
        movementFunc: 0

    }

    /* LIFECYCLE COMPONENT METHODS */

    componentDidMount () {
        const playerMeasurement = this.getPlayerCurPos();
        // sets player initial position
        const initPosX = window.innerWidth/2 - playerMeasurement.width/2; //at the middle of the x AXIS
        const initPosY = window.innerHeight - playerMeasurement.height; //at the bottom of the screen// the subtration of 18 is to take in account the playr height
        this.setState({playerTargetX: initPosX, playerTargetY: initPosY});
        this.handleKeyboardMovement();

    }

    componentDidUpdate (prevState, prevProps) {
        console.log("testingsorry");
        console.log(this.props.reset);
        if(this.props.reset) {
            console.log("reset");
            if(!this.state.gameStatus)this.resetGame()
        }
        
        
        if (this.state.isScrolling) {
            const playerCurPos = this.getPlayerCurPos();
            if (playerCurPos.y + playerCurPos.height >= window.innerHeight - 25) {
                console.log("should stop; didupdate bottomdeath");
                return this.gameOver()
            }

        }

        // console.log("update");

        if(this.state.speed <= 0.2) {//if the speed was increase for fixing position
            
            if(prevState.playerTargetX === window.innerWidth || prevState.playerTargetX === 0){// and the player was moving 
                this.setState({speed: 1.5, playerTargetX: prevState.playerTargetX})//set the movement back to normal
            }
        }

        if (this.state.curPlatform !== null) {//if the player is on top of a platform
            const playerCurPos = this.getPlayerCurPos();
            const platformPos = this.state.curPlatform.getBoundingClientRect()
            // after a movement check to see if he is still on top  of said platform
            if ((
                playerCurPos.x > platformPos.left &&     
                playerCurPos.x < platformPos.right
                ) || (
                playerCurPos.x + playerCurPos.width > platformPos.left && 
                playerCurPos.x + playerCurPos.width < platformPos.right
                )) {
                // console.log("should not fall");
            } else {//if they are not on top make them fall and check possible landings 
                if(!this.state.playerFalling && !this.state.playerJumping && this.state.playerLanded) {
                    // console.log("should fall")
                    this.setState({playerFalling: true, playerLanded: false})
                    // this.checkAllPlatforms();
                    this.land(this.checkAllPlatforms());
                }
            }
        }
    }

    /* PLAYER MOVEMENT FUCNTIONS */

    // gets the player position current position on screen
    getPlayerCurPos = () => {
        const playerEl = document.getElementById('player');
        if(playerEl === null) return {x:0,y:0,height:0,width:0};
        const playerCurPos = playerEl.getBoundingClientRect();
        // console.log(playerCurPos);
        return playerCurPos;
    }

    // they way movement works is by setting the target at either far right or far left on key down
    //then on key up set the target to the players current position making them stop
    lateralMove = (movementTarget) => {
        this.setState({playerTargetX: movementTarget, speed: 1.5})
    }

    stopMovement = (pos, speed=1.5) => {
        this.setState({playerTargetX: pos.x, speed});
    }

    // on key down the jump gauge starts at 5 and goes up to 10 depending when release//key up
    // then similar to lateral movement the jump sets the target to a distance equivalent to the top of the screen
    //(in this case 840px so if the player is at a platform the jump will be set at -840 from that position) and
    // starts a timeout with the duration being multiplied by the gauge set on keydown so
    // that instead of reaching the top of the screen when the timeout runs the procese of falling starts
    jump = (amount) => {
        // if not jumping or in the ground
        if (this.state.playerJumping === false && this.state.playerLanded === true) {
            
            // then similar to lateral movement the jump sets the target to a distance equivalent to the top of the screen
            const playerTarget = this.state.playerTargetY + amount;
            this.setState({playerTargetY: playerTarget, speed: 1.5, playerJumping: true, playerLanded: false});

            // starts a timeout with the duration being multiplied by the gauge set on keydown
            setTimeout(() => {
                // this.checkAllPlatforms()//check all platform to define where player should land including the bottom
                
                this.land(this.checkAllPlatforms());//sets event Listener to confirm the landing
            }, 48 * this.state.jumpGauge)

        }
    }

    //sets event Listener to confirm the landing
    land = (curPlatform) => {
        const playerEl = document.getElementById('player');
                playerEl.addEventListener('transitionend', () => {
                    console.log("touchedfloorDown");
                    if (curPlatform) {
                        console.log("did land1")
                        this.setState({playerJumping: false, playerFalling: false, playerLanded: true, curPlatform, speed: 1.5});
                        if (curPlatform.getAttribute("id") > 2 && !this.state.isScrolling) {
                            this.startScrolling();
                        }
                    }else {
                        console.log("did land2")
                        if (this.state.curPlatform) {
                            
                            // if (this.state.curPlatform.getAttribute("id") > 2 && this.state.isScrolling) {
                            //     console.log("should stop; landfunc bottomdeath");
                            //     this.gameOver();
                            // }
                            this.setState({playerJumping: false, playerFalling: false, playerLanded: true, speed: 1.5});
                        }
                        this.setState({playerJumping: false, playerFalling: false, playerLanded: true, curPlatform: null, speed: 1.5});
                        console.log(this.state.playerFalling);
                    }
                   
                }, {once: true});
    }

    checkLanding = (platformEl) => {

        const playerCurPos = this.getPlayerCurPos();
        const platformPos = platformEl.getBoundingClientRect();
        
        // console.log((playerCurPos.y + playerCurPos.height) <= platformPos.y);
        // console.log(playerCurPos.x > platformPos.left); 
        // console.log(playerCurPos.x < platformPos.right);
        // console.log(playerCurPos.x + playerCurPos.width > platformPos.left );
        // console.log(playerCurPos.x + playerCurPos.width < platformPos.right);
        if ((playerCurPos.y + playerCurPos.height) <= platformPos.y) {//if the player is above the platform
            //and the player is within the platform space
            if ((
                playerCurPos.x > platformPos.left &&     
                playerCurPos.x < platformPos.right
                ) || (
                playerCurPos.x + playerCurPos.width > platformPos.left && 
                playerCurPos.x + playerCurPos.width < platformPos.right
                )) {
                // console.log("should land");
                const landPos = (platformPos.top - (playerCurPos.height));//set the landing at the platform taking + the player height//read body
                
                const distance = landPos - playerCurPos.y;
                if (distance < 100) {// if the distance between the player and where he is landing is small increase the veloctiy of landing
                    // console.log("faster" + distance);
                    // this.setState({playerTargetY: landPos, speed: (distance < 30 ? 0.5 : 0.75 ), curPlatform: platformEl, playerFalling: true, playerJumping: false});
                    // this.setState({playerTargetX: playerCurPos.x, playerTargetY: landPos, speed: ((distance/100)+0.1), playerFalling: true, playerJumping: false});
                    this.setState({playerTargetX: playerCurPos.x, playerTargetY: landPos, speed: (0.2), playerFalling: true, playerJumping: false});
                    return platformEl
                }//if not just land normally
                this.setState({playerTargetY: landPos, curPlatform: platformEl, speed: 1.0, playerFalling: true, playerJumping: false})
                return platformEl
            }
            return false //if the player is not landing on platform return false
        }
        return false //if the player is not landing on platform return false
    }

    checkAllPlatforms = () => {
        let platform = null;
        const platformEls = document.querySelectorAll('.platform');
        let isLandingOnPlatform = false;
        for (let i = 0; i < platformEls.length; i++) {//for all the platforms
            platform = this.checkLanding(platformEls[i]);//if it finds a platform it returns the html element of the platform
            if (platform) {//check if the player should land on them and if so make it the target
                // console.log("chekc platforms");
                isLandingOnPlatform = true;
                break
            }
        }
        if (!isLandingOnPlatform) {//if it didnt found a platform set landing to ground
            const playerCurPos = this.getPlayerCurPos();
            const towerBottom = window.innerHeight - playerCurPos.width;
            const distance = towerBottom - playerCurPos.y;
            if (distance < 100) {// if the distance between the player and where he is landing is small increase the veloctiy of landing
                console.log("faster" + distance);
                // this.setState({playerTargetY: towerBottom, speed: ((distance/100)+0.1), playerFalling: true, playerJumping: false});
                this.setState({playerTargetY: towerBottom, speed: (0.1), playerFalling: true, playerJumping: false});
                // this.setState({playerTargetY: towerBottom, speed: (distance < 30 ? 0.5 : 0.75 ), curPlatform: null, playerFalling: true, playerJumping: false});
                // console.log(this.state); 
                return false 
            } else {//if not just land normally
                // console.log("slower" + distance);
                this.setState({playerTargetY: towerBottom, speed: 1.5, playerFalling: true, playerJumping: false});
                return false
            } 
        }
        return platform

    }

    startScrolling = () => {
        // this.setState({isScrolling: true})
        const scroll = document.querySelector(".game");
  
        // console.log("test1");
        if(!this.state.isScrolling) {

            const levelScrolling = setInterval(() => {
                if(scroll.scrollTop === 0) {
                    // console.log("test2");
                    clearInterval(this.state.scrollingFunc);
                    this.setState({movementToggle: false});
                    return
                }
                scroll.scrollTop -=this.state.scrollingSpeed
                if (this.state.playerJumping) {
                    
                } else if (this.state.playerFalling) {
                    const playerCurPos = this.getPlayerCurPos();
                    const distance = (this.state.playerTargetY + this.state.scrollingAdjustment) - playerCurPos.y;
                    if (distance < 20) {//changed from 10 to 20; works better now
                        // console.log("faster" + distance);
                        this.setState({playerTargetY: this.state.playerTargetY + this.state.scrollingAdjustment, speed: 0.1, playerTargetX: playerCurPos.x })
                        return
                    }
                    this.setState({playerTargetY: this.state.playerTargetY + this.state.scrollingAdjustment})
                } else {
                    const playerCurPos = this.getPlayerCurPos();
                    this.setState({playerTargetY: this.state.playerTargetY + this.state.scrollingAdjustment, speed: 0, playerTargetX: playerCurPos.x })
                }
                
            }, 100);
            this.setState({isScrolling: true, scrollingFunc: levelScrolling}); 
        }
         
        console.log("scrolling");
    }

    gameOver = () => {
        const playerEl = document.getElementById('player');
        // playerEl.style.color="blue";
        clearInterval(this.state.scrollingFunc);
        playerEl.style.display="none";
        console.log("gameOver");
        this.setState({gameStatus: false, points: (this.state.curPlatform ? (this.state.curPlatform.getAttribute("id")*1000) : 0)})

    }

    resetGame = () => {
        const playerEl = document.getElementById('player');
        playerEl.style.display="block";
        const playerMeasurement = this.getPlayerCurPos();
        // sets player initial position
        const initPosX = window.innerWidth/2 - playerMeasurement.width/2; //at the middle of the x AXIS
        console.log(playerMeasurement.height);
        console.log(window.innerHeight - playerMeasurement.height);
        const initPosY = window.innerHeight - playerMeasurement.height; //at the bottom of the screen// the subtration of 18 is to take in account the playr height
        this.setState({
            gameStatus: true,
            playerTargetX: initPosX,
            playerTargetY: initPosY,
            
            playerLanded: true,
            playerJumping: false,
            playerFalling: false,

            speed:0,
            jumpGauge: 5,
            gauge: null,

            curPlatform: null,

            isScrolling: false,
            scrollingFunc: 0,
            scrollingSpeed: 5,
            scrollingAdjustment: 5,

            points:0,
        });

        // const playerEl = document.getElementById('player');
        // playerEl.style.display="block";

    }

    /* EVENT LISTENERS */

    handleKeyboardMovement = () => {

        document.addEventListener('keydown', (e) => {
            // console.log(e.code);
            if(e.code === "Space") {
                e.preventDefault();//so that page doesnt scroll down
                if (this.state.gauge === null) {//if gauge havent already started aka if the player isnt already holding the key down
                    this.setState({gauge: setInterval(() => {// set the interval to increase the gauge every 250ms
                        if (this.state.jumpGauge < 10) {
                            this.setState(prevState => {
                                return {
                                    jumpGauge: prevState.jumpGauge + 1
                                }
                            })
                        }
                    }, 250)})
                }
            } else if(e.code === "ArrowRight") {
                    //get the right border of the playable area in screen location
                    const rightBorder = (window.innerWidth/2) + (320/2);// half of the screen plus halfof the playable area
                    // console.log(rightBorder);
                    const curPos = this.getPlayerCurPos();
                    // this is not working to well //couldnt figure out why; solution if they touch wall they die
                    if( curPos.x + curPos.width >= rightBorder){//if the player reachs the border 
                        console.log("should stop; down rightwalldeath");
                        this.gameOver();
                        // console.log("touch wall die") //start some event here to say game over
                        this.stopMovement({x: rightBorder - curPos.width, y: this.state.playerTargetY}, 0);//stop them there and raise the flag on the rightborder
                        
                        
                    } else {
                        this.lateralMove(window.innerWidth);// start to move right
                    }
            } else if(e.code === "ArrowLeft") {
                    const leftBorder = (window.innerWidth/2) - (320/2);
                    // console.log(leftBorder);
                    const curPos = this.getPlayerCurPos();
                    if (curPos.x <= leftBorder) {
                        console.log("should stop; down leftwalldeath");
                        this.gameOver();
                        // console.log("touch wall die")// start some event here to say gameover
                        this.stopMovement({x: leftBorder, y: this.state.playerTargetY}, 0);//stop them there and raise the flag on the leftborder
                        
                    } else {  
                        this.lateralMove(0);// start to move left
                    }

            }
        });

        document.addEventListener('keyup', (e) => {
            // console.log(e.code);
            if(e.code === "Space") {//when they let go of space 
                clearInterval(this.state.gauge);//stop the intervals and the gauge
                this.jump(-840);//do the jump
                this.setState({gauge: null, jumpGauge: 5})//set the gauge to initial value
            } else if(e.code === "ArrowRight") {
                
                const rightBorder = (window.innerWidth/2) + (320/2);
                const curPos = this.getPlayerCurPos();
                if( curPos.x + curPos.width >= rightBorder){
                    console.log("should stop; up rightwalldeath");
                    this.gameOver();
                    this.stopMovement({x: rightBorder - curPos.width, y: this.state.playerTargetY}, 0);

                } else {
                    this.stopMovement(this.getPlayerCurPos());
                }
                if(this.state.playerFalling === true ){
                    this.checkAllPlatforms();

                }
               
            } else if(e.code === "ArrowLeft") {
                const leftBorder = (window.innerWidth/2) - (320/2);
                const curPos = this.getPlayerCurPos();
                if (curPos.x <= leftBorder) {
                    console.log("should stop; up lefttwalldeath");
                    this.gameOver();
                    return this.stopMovement({x: leftBorder, y: this.state.playerTargetY}, 0);
                }else {
                    this.stopMovement(this.getPlayerCurPos());
                }
                if(this.state.playerFalling === true ){
                    this.checkAllPlatforms();

                }
            }
        });

        /* commented testing no longer necessary
        // this is just for testing if press right click screen toggle going down
        document.addEventListener('contextmenu', () => {
            // console.log("desceu");
            const scroll = document.querySelector(".game");
  
            if(!this.state.movementToggle){ 
                // console.log("test1");
                const levelMovement = setInterval(() => {
                    if(scroll.scrollTop === 0) {
                        // console.log("test2");
                        clearInterval(this.state.movementFunc)
                        this.setState({movementToggle: false});
                        return
                    }
                    scroll.scrollTop -=0.1
                    if (this.state.playerJumping) {
                        
                    } else if (this.state.playerFalling) {
                        const playerCurPos = this.getPlayerCurPos();
                        const distance = (this.state.playerTargetY + 1) - playerCurPos.y;
                        if (distance < 10) {
                            // console.log("faster" + distance);
                            this.setState({playerTargetY: this.state.playerTargetY + 1, speed: 0.2, playerTargetX: playerCurPos.x })
                            return
                        }
                        this.setState({playerTargetY: this.state.playerTargetY + 1})
                    } else {
                        const playerCurPos = this.getPlayerCurPos();
                        this.setState({playerTargetY: this.state.playerTargetY + 1, speed: 0, playerTargetX: playerCurPos.x })
                    }
                    
                }, 200);
                this.setState({movementToggle: true, movementFunc: levelMovement}); 
            } else {
                // console.log("test2");
                clearInterval(this.state.movementFunc)
                this.setState({movementToggle: false});
            }
                    
          }); */

    }

    handleHamburguerMenu = (event) =>{
        event.stopPropagation();
        console.log(event.target);
        // console.log(window.getComputedStyle(event.target).display); this is how you get css value that are not declared inline or with javascript
        // console.log(window.getComputedStyle(event.target).getPropertyValue('font-size')); or like this
        // console.log(window.getComputedStyle(event.target));
        
        const hamburguerMenu = event.target.parentElement;
        const hamburguerMenuCSS = window.getComputedStyle(hamburguerMenu);

        console.log(hamburguerMenuCSS.display);

        if(hamburguerMenuCSS.display === "block"){

            hamburguerMenu.style.display = "none";

            const elIconList = document.querySelectorAll(".icon");
            console.log(elIconList);
    
            for (let index = 0; index < elIconList.length; index++) {
                elIconList[index].style.display = "inline";
            
            }

            document.body.addEventListener('touchstart', this.handleMenuOff);
        } 

    }

    handleMenuOff = (event) =>{
        // event.stopPropagation();
        // console.log(event.target.nodeName);
        const hamburguerMenu = document.querySelector(".hamburguer--menu");
        if(event.target.nodeName !== "I"){

            console.log(event.target);
            const elIconList = document.querySelectorAll(".icon");
            console.log(elIconList);
            
            for (let index = 0; index < elIconList.length; index++) {
                elIconList[index].style.display = null;
                
            }
            
            hamburguerMenu.style.display = null;
            document.body.removeEventListener('touchstart', this.handleMenuOff);
        }
    }

    render(){
        return(
            <>
            <GetGameState status={this.state.gameStatus} points={this.state.points}/>
            <Player playerInfo={this.state}/>
            <section className='game'>
                <div className="hamburguer--menu" onTouchStart={this.handleHamburguerMenu} ><i class="fa fa-bars" ></i></div>
                <DeathZone display={this.state.isScrolling}/>
                <PlatformContainer status={this.state.gameStatus} curPlatform={(this.state.curPlatform ? this.state.curPlatform.getAttribute("id") : 0)} reset={this.props.reset}/>
            </section>
            </> 
        )
    }
}

export default Game;