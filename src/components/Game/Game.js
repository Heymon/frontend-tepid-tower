import React from "react";
import {AbsoluteOrientationSensor} from "motion-sensors-polyfill";

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
        playerIsLanding: false,

        speed:0,
        jumpGauge: 5,
        gauge: null,

        curPlatform: null,

        isScrolling: false,
        scrollingFunc: 0,
        scrollingSpeed: 5,
        scrollingAdjustment: 5,//FIXME bug on phone the velocity is not enough for when scrolling so player never reachs platform; 5.3 works on phone for some reason

        points:0,

        //for testing
        movementToggle: false,
        movementFunc: 0,

    }

    /* FUNCTIONAL METHODS */

    /**
     * regex from detectmobilebrowsers.com to check if it is a mobile 
     *   */
    mobileCheck = () => { 
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
    
    /** 
     * source https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
     * 
      */
    quaternionToEuler = (quaternion) => {
        // let eulerAngles = [];
        let roll = 0;
        let pitch = 0;
        let yaw = 0;

        // roll (x-axis rotation)
        let sinr_cosp = 2 * (quaternion[3] * quaternion[0] + quaternion[1] * quaternion[2]);
        let cosr_cosp = 1 - 2 * (quaternion[0] * quaternion[0] + quaternion[1] * quaternion[1]);
        roll = Math.atan2(sinr_cosp, cosr_cosp);

        // pitch (y-axis rotation)
        let sinp = 2 * (quaternion[3] * quaternion[1] - quaternion[2] * quaternion[0]);
        if (Math.abs(sinp) >= 1){

            pitch = ((Math.PI/2)*Math.sign(sinp)); // use 90 degrees if out of range
        }
        else{

            pitch = Math.asin(sinp);
        }

        // yaw (z-axis rotation)
        let siny_cosp = 2 * (quaternion[3] * quaternion[2] + quaternion[0] * quaternion[1]);
        let cosy_cosp = 1 - 2 * (quaternion[1] * quaternion[1] + quaternion[2] * quaternion[2]);
        yaw = Math.atan2(siny_cosp, cosy_cosp);

        // console.log(`roll ${roll.toFixed(3)} pitch ${pitch.toFixed(3)} yaw ${yaw.toFixed(3)}`);

        return pitch.toFixed(3);
    }

    /* LIFECYCLE COMPONENT METHODS */

    componentDidMount () {
        if(this.mobileCheck()){
            // from https://developer.mozilla.org/en-US/docs/Web/API/RelativeOrientationSensor
            Promise.all([navigator.permissions.query({ name: "accelerometer"}), 
                        navigator.permissions.query({ name: "gyroscope"})])
                    .then(results => {
                        if (results.every(result => result.state === "granted")) {
                            console.log('Permission to use Accelerometer & Gyroscope sensor granted.');

                            let sensor = new AbsoluteOrientationSensor({frequency: 30, referenceFrame: 'device'});

                            sensor.start();

                            sensor.onreading = () => {//NOTE maybe use roll to check if it is to backwards or not
                                // if (!this.state.isInitQuaternionSet) this.setState({initialQuaternion: sensor.quaternion.map(x => x.toFixed(3)), isInitQuaternionSet: true})
                                // console.log("Relative orientaion " + sensor.quaternion.map(x => x.toFixed(3)));//more tha 45 ->  less than 35 <-
                                let pitch = this.quaternionToEuler(sensor.quaternion);
                                // console.log(`intial ${this.state.initialQuaternion[1]}`);
                                // console.log(`current ${sensor.quaternion[1]}`);
                                // if(Math.abs(sensor.quaternion[1]) - Math.abs(this.state.initialQuaternion[1]) <= -0.05){
                                // let stop = (pitch >= -0.3 && pitch <= 0.3) ? true : false;
                                // console.log("heyyyyyyyyyyy ",stop)
                                if((pitch >= -0.3 && pitch <= 0.3)){//TODO after adding a recoil state for isModalOn check to stop movement
                                    
                                    /* const rightBorder = (window.innerWidth/2) + (320/2);
                                    const leftBorder = (window.innerWidth/2) - (320/2);
                                    const curPos = this.getPlayerCurPos();
                                    if( curPos.x + curPos.width >= rightBorder || curPos.x <= leftBorder){
                                        console.log("should stop; up rightwalldeath");
                                        this.gameOver();
                                        this.stopMovement({x: rightBorder - curPos.width, y: this.state.playerTargetY}, 0);

                                    } else {
                                        this.stopMovement(this.getPlayerCurPos());
                                    }
                                    if(this.state.playerFalling === true ){
                                        this.checkAllPlatforms();

                                    } */

                                    if (this.state.playerTargetX === window.innerWidth) {
                                        this.controllerMovementRight(false);
                                        return;
                                    }
                                    if (this.state.playerTargetX === 0) {
                                        this.controllerMovementRight(false);
                                        return;
                                    }

                                // } else if(Math.abs(sensor.quaternion[1]) - Math.abs(this.state.initialQuaternion[1]) >= 0.05) {
                                } else if(pitch > 0.3){
                                    // console.log("Relative orientaion pointing right");//more tha 45 ->  less than 35 <-
                                    this.controllerMovementRight(true);
                                } else if(pitch < -0.3) {
                                    // console.log("Relative orientaion pointing left");//more tha 45 ->  less than 35 <-
                                    this.controllerMovementLeft(true);
                                }  
                            }

                            sensor.onerror = event => console.log(event.error.name, event.error.message);
                            this.handleMobileJump();
                        }
                    })
        } else {
            // TODO handle keyboard
        };
        

        const playerMeasurement = this.getPlayerCurPos();
        // sets player initial position
        const initPosX = window.innerWidth/2 - playerMeasurement.width/2; //at the middle of the x AXIS
        const initPosY = window.innerHeight - playerMeasurement.height; //at the bottom of the screen// the subtration of 18 is to take in account the playr height
        this.setState({playerTargetX: initPosX, playerTargetY: initPosY});
        this.handleKeyboardMovement();

    }

    componentDidUpdate (prevState, prevProps) {
        console.warn("testingsorry");
        console.log(this.props.reset);
        if(this.props.reset) {
            console.log("reset");
            if(!this.state.gameStatus)this.resetGame()
        }
        
        if (this.state.isScrolling) {
            const playerCurPos = this.getPlayerCurPos();
            if (playerCurPos.y + playerCurPos.height >= window.innerHeight - 25) {//NOTE maybe in the future instead of this create a event for when the animation ends, i.e when the animation ends at the bottom or when the animaton ends at the side wall (on phone the side wall is the playerTargetX)
                console.log("should stop; didupdate bottomdeath");
                return this.gameOver()
            }
        }

        if(this.state.speed <= 0.2) {//if the speed was increase for fixing position//NOTE this might be the reason why the speed is not picking up on mobile so if instead we create a listener for when the faster animation is over to sow down again that might work
            console.log("slowing");
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
        console.log("how many times");
        this.setState({playerTargetX: movementTarget, speed: 1.5})
    }

    stopMovement = (pos, speed=1.5) => {
        this.setState({playerTargetX: pos.x, speed});
    }

    // on key down the jump gauge starts at 5 and goes up to 10 depending when release//key up
    // then similar to lateral movement the jump sets the target to a distance equivalent to the top of the screen
    //(in this case 840px so if the player is at a platform the jump will be set at -840 from that position) and
    // starts a timeout with the duration being multiplied by the gauge set on keydown so
    // that instead of reaching the top of the screen when the timeout runs the process of falling starts
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
        if (!this.state.playerIsLanding) {
            playerEl.addEventListener('transitionend', () => {
                console.log("touchedfloorDown");
                if (this.state.curPlatform) {
                    console.log("did land1")
                    this.setState({playerJumping: false, playerFalling: false, playerLanded: true, playerIsLanding: false, speed: 1.5});
                    if (this.state.curPlatform.getAttribute("id") > 2 && !this.state.isScrolling) {
                        console.log(curPlatform); 
                        this.startScrolling();
                    }
                }else {
                    console.log("did land2")
                    this.setState({playerJumping: false, playerFalling: false, playerLanded: true, playerIsLanding: false, speed: 1.5});
                    console.log(this.state.playerFalling);
                }
               
            }, {once: true});
            this.setState({playerIsLanding: true});
        }
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
                //NOTE this is where I am try the new fake physics experiment
                if (distance < 100) {// if the distance between the player and where he is landing is small increase the veloctiy of landing
                    // console.log("faster" + distance);
                    // this.setState({playerTargetY: landPos, speed: (distance < 30 ? 0.5 : 0.75 ), curPlatform: platformEl, playerFalling: true, playerJumping: false});
                    // this.setState({playerTargetX: playerCurPos.x, playerTargetY: landPos, speed: ((distance/100)+0.1), playerFalling: true, playerJumping: false});
                    this.setState({playerTargetX: playerCurPos.x, playerTargetY: landPos, curPlatform: platformEl, speed: (0.2), playerFalling: true, playerJumping: false});//FIXME bug where if player find landing while still moving it cause a frozen movement between turning velocity 0.2 here and back to 1.5 on lateral movement; maybe create a if(falling true && speed 0.2) dont do anything
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
            const towerBottom = window.innerHeight - playerCurPos.height;
            const distance = towerBottom - playerCurPos.y;
            if (distance < 50) {// if the distance between the player and floor is small increase the veloctiy of landing
                console.log("faster" + distance);
                // this.setState({playerTargetY: towerBottom, speed: ((distance/100)+0.1), playerFalling: true, playerJumping: false});
                this.setState({playerTargetY: towerBottom, curPlatform: null, speed: (0.1), playerFalling: true, playerJumping: false});
                // this.setState({playerTargetY: towerBottom, speed: (distance < 30 ? 0.5 : 0.75 ), curPlatform: null, playerFalling: true, playerJumping: false});
                // console.log(this.state); 
                return false 
            } else {//if not just land normally
                // console.log("slower" + distance);
                this.setState({playerTargetY: towerBottom, curPlatform: null, speed: 1.5, playerFalling: true, playerJumping: false});
                return false
            } 
        }
        return platform

    }

    startScrolling = () => {
        const scroll = document.querySelector(".game");
        if(!this.state.isScrolling) { //if it is not already scrolling

            const levelScrolling = setInterval(() => {
                /* if(scroll.scrollTop === 0) { THIS IS FOR TESTING SCROLLING, FOR STOPPING WHEN REACHING THE END
                    // console.log("test2");
                    clearInterval(this.state.scrollingFunc);
                    this.setState({movementToggle: false});
                    return
                } */
                scroll.scrollTop -=this.state.scrollingSpeed // scroll the game by the right amount
                if (this.state.playerJumping) {//if the player is jumping up 
                    //dont do anything
                } else if (this.state.playerFalling) {// if the player is falling
                    const playerCurPos = this.getPlayerCurPos();
                    const distance = (this.state.playerTargetY + this.state.scrollingAdjustment) - playerCurPos.y;//the new distance of the moving platform
                    if (distance < 20) {//changed from 10 to 20; works better now
                        // console.log("faster" + distance);
                        this.setState({playerTargetY: this.state.playerTargetY + this.state.scrollingAdjustment, speed: 0.1, playerTargetX: playerCurPos.x })//NOTE this might be the problem with bug number 6; which happens if i put this.land on holding the key for movement, it stop the player lateral movement and finding a landing; it is setting the targetx to the current position but is not setting back the target for movement after landing
                        return;
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

    /* GAME STATES METHODS */

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
            playerIsLanding: false,

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

    /* PLAYER MOVEMENT CONTROLLER METHODS */

    controllerJump = (isBeginningPress) => {
        if (isBeginningPress) {
            this.setState({gauge: setInterval(() => {// set the interval to increase the gauge every 250ms
                if (this.state.jumpGauge < 10) {
                    this.setState(prevState => {
                        return {
                            jumpGauge: prevState.jumpGauge + 1
                        }
                    })
                }
            }, 250)})
        }else {
            clearInterval(this.state.gauge);//stop the intervals and the gauge
            this.jump(-840);//do the jump
            this.setState({gauge: null, jumpGauge: 5})//set the gauge to initial value
        }
    }

    controllerMovementRight = (isBeginningPress) => {
        if (isBeginningPress) {
            //get the right border of the playable area in screen location
            const rightBorder = (window.innerWidth/2) + (320/2);// half of the screen plus halfof the playable area
            const curPos = this.getPlayerCurPos();
            // this is not working to well //couldnt figure out why; solution if they touch wall they die
            if( curPos.x + curPos.width >= rightBorder){//if the player reachs the border 
                console.log("should stop; down rightwalldeath");
                this.gameOver();
                this.stopMovement({x: rightBorder - curPos.width, y: this.state.playerTargetY}, 0);//stop them there and raise the flag on the rightborder
            } else {
                this.lateralMove(window.innerWidth);// start to move right
                //FIXME bug number 6: where if player is holding the right or left key when landing on platform it doesnt check for landing and goes through it; adding this.land here might be the solution but it also lands player prematurely 
            }
        }else {
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
                this.land(this.checkAllPlatforms());
            }
        }
    }
    
    controllerMovementLeft = (isBeginningPress) => {
        if (isBeginningPress) {
            const leftBorder = (window.innerWidth/2) - (320/2);
            // console.log(leftBorder);
            const curPos = this.getPlayerCurPos();
            if (curPos.x <= leftBorder) {
                console.log("should stop; down leftwalldeath");
                this.gameOver();
                // console.log("touch wall die")// start some event here to say gameover
                this.stopMovement({x: leftBorder, y: this.state.playerTargetY}, 0);//stop them there and raise the flag on the leftborder  
            } else {  
                if(this.state.playerFalling === true ){
                    this.land(this.checkAllPlatforms());
                }
                this.lateralMove(0);// start to move left
            }      
        }else {
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
                if(this.state.playerFalling === true ){
                    this.land(this.checkAllPlatforms());
                }
                this.land(this.checkAllPlatforms());
            }
        }
    }

    /* EVENT LISTENERS */

    handleMobileJump = () => {
        document.querySelector(".game").addEventListener('touchstart', (e) =>{
            if (this.state.gauge === null && e.target.nodeName !== "I") {//if gauge havent already started aka if the player isnt already holding the key down
                this.controllerJump(true);
            }
        });
 
        document.querySelector(".game").addEventListener('touchend', (e) =>{
            console.log(e);
            if (e.target.nodeName !== "I") {//if player is not pressing one of the icons
                this.controllerJump(false);
            }
        });
        
        document.querySelector(".game").addEventListener('touchmove', (e) =>{// so that the page wont scroll while holding for jump 
            e.preventDefault();
        });
    }

    handleKeyboardMovement = () => {
        document.addEventListener('keydown', (e) => {
            // console.log(e.code);
            if(document.activeElement.nodeName !== "INPUT"){//if an input is not on focus
                if(e.code === "Space") {
                    e.preventDefault();//so that page doesnt scroll down
                    if (this.state.gauge === null) {//if gauge havent already started aka if the player isnt already holding the key down
                        this.controllerJump(true);
                    }
                } else if(e.code === "ArrowRight") {
                    this.controllerMovementRight(true);
                } else if(e.code === "ArrowLeft") {
                    this.controllerMovementLeft(true);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            // console.log(e.code);
            if(document.activeElement.nodeName !== "INPUT"){//if an input is not on focus
                if(e.code === "Space") {//when they let go of space 
                    this.controllerJump(false);
                } else if(e.code === "ArrowRight") {
                    this.controllerMovementRight(false);
                } else if(e.code === "ArrowLeft") {
                    this.controllerMovementLeft(false);
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

    render(){
        return(
            <>
            <GetGameState status={this.state.gameStatus} points={this.state.points}/>
            <Player playerInfo={this.state}/>
            <section className='game'>
                <h1 className="inTitle">Tepid Tower</h1>
                <div className="hamburguer--menu" ><i className="fa fa-bars" ></i></div>
                {/* <div className="hamburguer--menu" onTouchStart={this.handleHamburguerMenu} ><i class="fa fa-bars" ></i></div> */}
                <DeathZone display={this.state.isScrolling}/>
                <PlatformContainer status={this.state.gameStatus} curPlatform={(this.state.curPlatform ? this.state.curPlatform.getAttribute("id") : 0)} reset={this.props.reset}/>
            </section>
            </> 
        )
    }
}

export default Game;