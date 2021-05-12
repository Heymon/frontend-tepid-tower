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

                        this.setState({highscore: true});
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



        for (let i = 0; i < popUps.length; i++) {
            if (popUps[i].classList.contains(class_name)) {
                // console.log("true");
                // console.log(popUps[i])
                // console.log(popUps[i].style.display)
                if (popUps[i].style.display === "flex") {
                    
                    popUps[i].style.display = "none";
                    const responseMessage = document.querySelector(".message");
                    if(responseMessage) responseMessage.remove();
                    // break
                } else {
                    // console.log(popUps[i])
                    popUps[i].style.display = "flex";
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

    render () {
        return (

            <section className="section--right">
                <aside className="aside--top">
                    <div className="icon"><i className="fa fa-cog"></i></div>
                    <div className="icon" onClick={this.handleLeaderboardOpt} ><i className="fa fa-trophy"></i></div>
                    <div className="icon" onClick={this.handleControlsOpt} ><i className="fa fa-gamepad fa-lg"></i></div>
                </aside>
                <aside className="aside--bottom">
                    <div className="icon" onClick={this.handleUserOpt}>
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