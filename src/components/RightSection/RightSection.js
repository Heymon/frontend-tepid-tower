import React from 'react';
import './RightSection.css';

import AuthModel from "../../models/auth";

import GetResetState from "../../recoil/components/GetResetState";
import ControlsModal from "../ControlsModal/ControlsModal";
import LeaderboardModal from "../LeaderboardModal/LeaderboardModal";
import UserModal from "../UserModal/UserModal";
import GameOverModal from "../GameOverModal/GameOverModal";


class RightSection extends React.Component {

    state = {
        reset: false,

        curUser:null,

        friendEmail:"",

        highscore:false,

    }

    componentDidMount() {
        document.querySelector(".hamburguer--menu").addEventListener('touchstart', this.handleHamburguerMenu);
    }

    componentDidUpdate(prevProps) {
        // console.log("humm");
        // console.log(this.props.user);
        // console.log(prevProps.user);
        if (this.props.user !== prevProps.user) {
            console.log("humm");
            this.setState({curUser: this.props.user});   
        }

        console.log(this.props);
        console.log(this.state);
        if (!this.props.gameStatus && !this.state.reset) {
            const loggingIn = document.querySelector(".user--modal");
            const stillOver = document.querySelector(".gameover--modal");
            if (loggingIn.style.display === "flex" || stillOver.style.display === "flex") {
                return
            }
            console.log("gameover");
            console.log(this.props.points)
            // if (this.state.curUser) {
            if (this.props.user) {
                AuthModel.addScore({score: this.props.points}).then(json => {
                    console.log(json);

                    if (json.message === "score") {
                        
                        this.setState({highscore: false});
                        // this.userModal("gameover--modal");
                        // console.log(stillOver.style.display);

                    } else if(json.message === "highscore") {

                        this.setState({highscore: true, curUser: json.updatedUser});//i am only updating the user here because of the highscore display on the userModal
                        // this.userModal("gameover--modal");
                    }
                })
            } else  {

                this.setState({highscore: true});
                // this.userModal("gameover--modal");
            
            }
            this.userModal("gameover--modal");
        } else if (this.props.gameStatus && this.state.reset){
            // console.log(this.props)
            // if(this.state.reset === true) {

                this.setState({reset: false});
            // }
        }
    }

    userModal = (class_name) => {
        let isModalOn = false;
        const popUps = document.querySelectorAll(".modal");
        // console.log(popUps);

        if (class_name === "user--modal--logged") {
            AuthModel.show().then(json => {
                console.log(json);
                // if (json.field) {
                //     const form = document.querySelector(".signup");
                //     return form.appendChild(this.createErrorMessage(json.message));
                // }
                this.setState({curUser: json.curUser });
            });
        }

        for(let index = 0; index < popUps.length; index++){
            if (popUps[index].style.display === "flex") {
                console.log("is on");
                isModalOn = true;
                break;
            }
        }
        console.log(class_name);
        for (let i = 0; i < popUps.length; i++) {
            if (popUps[i].classList.contains(class_name)) {
                // console.log("true");
                // console.log(popUps[i])
                // console.log(popUps[i].style.display)
                if (popUps[i].style.display === "flex") {
                    
                    popUps[i].style.display = "none";
                    console.log("off!");
                    document.querySelector(".landing").removeEventListener('click', this.handleMenuOff);
                    const responseMessage = document.querySelector(".message");
                    if(responseMessage) responseMessage.remove();
                    // break
                } else {
                    // console.log(popUps[i])
                    popUps[i].style.display = "flex";
                    //bool that check if there is a modal already up 
                    if(!isModalOn) document.querySelector(".landing").addEventListener('click', this.handleMenuOff);
                }
                // break
            } else {
                // console.log(popUps[i])
                // console.log(popUps[i].style.display)
                popUps[i].style.display = "none";
                const responseMessage = document.querySelector(".message");
                if(responseMessage) responseMessage.remove();
            }
           
        }


    }

    handleUserOpt = (event) => {
        // event.preventDefault();
        //sends user info to be registered
        event.stopPropagation();
        if (!this.props.gameStatus) {
            return//if on game over icon wont work
        }
        // if (this.state.curUser) {
        if (this.props.user) {
            
            console.log(event.target);   
            
            this.userModal("user--modal--logged");
        } else {
            console.log(event.target);   
            
            this.userModal("user--modal");
        }
    }

    handleLeaderboardOpt = (event) => {
        // event.preventDefault();
        //sends user info to be registered
        event.stopPropagation();
        if (!this.props.gameStatus) {
            return//if on game over icon wont work
        } 
        
        this.userModal("leaderboard--modal");
    
    }

    handleControlsOpt = (event) => {
        // event.preventDefault();
        //sends user info to be registered
        event.stopPropagation();
        if (!this.props.gameStatus) {
            return//if on game over icon wont work
        }  
            
        this.userModal("controls--modal");
    
    }

    handleGameRestart = (event) => {
        console.log(event);
        if (event) {
            event.stopPropagation();
            // event.preventDefault(); //dont need this
        }

        // console.log(event.target);
        // console.log(event.target.getAttribute("class"));
        
        // if (event.target.getAttribute("class")==="playagain") { also dont need this
            this.setState({reset: true})
            this.userModal("");
            console.log(this.state.reset)
        // }   

    }

    handleHamburguerMenu = (event) =>{
        event.preventDefault();
        // event.stopImmediatePropagation();
        // event.stopPropagation();
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
            document.querySelector(".landing").addEventListener('click', this.handleMenuOff);
            // document.body.addEventListener('touchstart', this.handleMenuOff);
        } 

    }

    handleMenuOff = (event) =>{
        console.log(event.target.nodeName);
        console.log(event.target.closest(".modal")); //looks upper to find matching element; so if it is inside a modal
        if(event.target.nodeName !== "I" && event.target.closest(".modal") === null){ // if it is not an icon and it is not inside a modal
            const hamburguerMenu = document.querySelector(".hamburguer--menu");
            
            this.userModal("");
            console.log(event.target);
            const elIconList = document.querySelectorAll(".icon--menu");
            console.log(elIconList);
            
            for (let index = 0; index < elIconList.length; index++) {
                elIconList[index].style.display = null;
                
            }
            
            hamburguerMenu.style.display = null;
            // document.body.removeEventListener('touchstart', this.handleMenuOff);
            document.querySelector(".landing").removeEventListener('click', this.handleMenuOff);
            console.log("off?");
        }
    }

    render () {
        return (

            <section className="section--right">
                <aside className="aside--top">
                    <div className="icon icon--menu"><i className="fa fa-cog"></i></div>
                    <div className="icon icon--menu" onClick={this.handleLeaderboardOpt} ><i className="fa fa-trophy"></i></div>
                    <div className="icon icon--menu" onClick={this.handleControlsOpt} ><i className="fa fa-gamepad fa-lg"></i></div>
                </aside>
                <aside className="aside--bottom">
                    <div className="icon icon--menu" onClick={this.handleUserOpt}>
                    <i className="fa fa-user"></i>
                    </div>
                </aside>
                
                <GetResetState reset={this.state.reset} />

                <LeaderboardModal />
                <ControlsModal />

                <UserModal user={this.state.curUser} points={this.props.points} gameStatus={this.props.gameStatus} isReseting={this.state.reset} submitHandler={this.handleSubmit} changeModal={(className) => this.userModal(className)} playAgainFunc={this.handleGameRestart}/>

                <GameOverModal points={this.props.points} highscore={this.state.highscore} user={this.props.user} playAgainFunc={this.handleGameRestart} signUpFunc={() => this.userModal("user--modal")} />


            </section>
                
        )
    }
    
}

export default RightSection;