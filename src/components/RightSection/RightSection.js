import React from 'react';
import './RightSection.css';

import AuthModel from "../../models/auth";

import GetResetState from "../../recoil/components/GetResetState";
import ControlsModal from "../ControlsModal/ControlsModal";
import LeaderboardModal from "../LeaderboardModal/LeaderboardModal";
import GameOverModal from "../GameOverModal/GameOverModal";


class RightSection extends React.Component {

    state = {
        reset: false,

        curUser:null,

        friendEmail:"",

        highscore:0,

        username: "e",
        email: "",
        country: "",
        password: ""
    }

    componentDidMount() {
        
    }

    componentDidUpdate(prevProps) {
        console.log("humm");
        console.log(this.props.user);
        console.log(prevProps.user);
        if (this.props.user !== prevProps.user) {
            console.log("humm");
            this.setState({
                curUser: this.props.user,
                curUser: this.props.user, 
                country: this.props.user.profile.country,
                username: this.props.user.profile.username,
                password: ""
                })   
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
            if (this.state.curUser) {
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
                if (json.field) {
                    const form = document.querySelector(".signup");
                    return form.appendChild(this.createErrorMessage(json.message));
                }
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
                    const error = document.querySelector(".error--message");
                    if(error) error.remove();
                    // break
                } else {
                    // console.log(popUps[i])
                    popUps[i].style.display = "flex";
                }
                // break
            } else {
                // console.log(popUps[i])
                // console.log(popUps[i].style.display)
                // if (popUps[i].style.display === "flex") {
                    
                //     popUps[i].style.display = "none";
                //     break
                // }
                popUps[i].style.display = "none";
                const error = document.querySelector(".error--message");
                if(error) error.remove();
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
        if (this.state.curUser) {
            
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

    createErrorMessage = (message) => {

        let element = document.createElement("p");
        element.appendChild(document.createTextNode(message));
        element.setAttribute("class", "error--message");
        return element;
    }

    handleSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(event.target.getAttribute("class"));
        
        if (event.target.getAttribute("class")==="signup") {

            const form =this.state;
            delete form.highscore;
            delete form.friendEmail;
            delete form.curUser;
            delete form.reset;
            AuthModel.register(form).then(json => {
                console.log(json);
                if (json.field) {
                    const form = document.querySelector(".signup");
                    return form.appendChild(this.createErrorMessage(json.message));
                }
            });
            this.setState({password: ""});
        } else if(event.target.getAttribute("class")==="login"){
            AuthModel.login({email:this.state.email, password: this.state.password}).then(json => {
                console.log(json);
                const error = document.querySelector(".error--message");
                if(error) error.remove();
                if (json.field) {
                    const form = document.querySelector(".login");
                    return form.appendChild(this.createErrorMessage(json.message));
                }

                this.setState({
                    curUser: json.foundUser, 
                    country: json.foundUser.profile.country,
                    username: json.foundUser.profile.username,
                    password: ""
                    })
                localStorage.setItem("uid", json.signedJwt);
                return this.userModal("user--modal--logged");
            })
        } else if(event.target.getAttribute("class")==="edit--user"){
            AuthModel.edit({username: this.state.username, country: this.state.country}).then(json => {
                console.log(json);
                const error = document.querySelector(".error--message");
                if(error) error.remove();
                if (json.field) {
                    const form = document.querySelector(".edit--user");
                    return form.appendChild(this.createErrorMessage(json.message));
                }
                this.setState({
                    curUser: json.updatedUser, 
                    country: json.updatedUser.profile.country,
                    username: json.updatedUser.profile.username,
                });
                return
            })

        } else if(event.target.getAttribute("class")==="add--friend"){
            AuthModel.addFriend({friendEmail: this.state.friendEmail}).then(json => {
                console.log(json);
                const error = document.querySelector(".error--message");
                if(error) error.remove();

                if (json.field) {
                    if (json.status===200) {
                        console.log("hey")
                        const test = document.querySelector(".add--friend > * > input");
                        test.setAttribute("value", "");
                        test.value = test.friendEmail = "";
                        console.log(test);
                        this.setState({friendEmail: ""})
                    }
                    const form = document.querySelector(".add--friend");
                    return form.appendChild(this.createErrorMessage(json.message));
                }
                return
            })

        }else if(event.target.classList.contains("logout")) {
            
            this.userModal();
            this.setState({
                curUser: null, 
                country: "",
                username: "",
                email: "",
                password: ""
                })
            localStorage.removeItem("uid");

        } else if(event.target.classList.contains("delete")) {
            AuthModel.delete().then(json => {
                console.log(json);
                if (json.field) {
                    const form = document.querySelector(".edit--user");
                    return form.appendChild(this.createErrorMessage(json.message));
                }
                this.userModal();
                this.setState({
                    curUser: null, 
                    country: "",
                    username: "",
                    email: "",
                    password: ""
                    })
                localStorage.removeItem("uid");
            })
        }
          
    }

    handleGameOverModal = (event) => {
        event.stopPropagation();
        event.preventDefault(); //dont think i need this

        console.log(event.target);
        // console.log(event.target.getAttribute("class"));
        
        if (event.target.getAttribute("class")==="playagain") {
            this.setState({reset: true})
            this.userModal("");
            console.log(this.state.reset)
        }   

    }

    render () {
        return (

            <section className="section--right">
                <aside className="aside--top">
                    <div className="icon"><i class="fa fa-cog"></i></div>
                    <div className="icon" onClick={this.handleLeaderboardOpt} ><i class="fa fa-trophy"></i></div>
                    <div className="icon" onClick={this.handleControlsOpt} ><i class="fa fa-gamepad fa-lg"></i></div>
                </aside>
                <aside className="aside--bottom">
                    <div className="icon" onClick={this.handleUserOpt}>
                    <i class="fa fa-user"></i>
                    </div>
                </aside>
                
                <GetResetState reset={this.state.reset} />

                <LeaderboardModal />
                <ControlsModal />








                {/* USER MODALS TO BE MADE INTO COMPONENTS */}
                <div className="user--modal modal">
                    <form className="signup" onSubmit={this.handleSubmit}>
                        <div className="form--input">
                            <label>USERNAME</label>
                            <input
                            type="text"
                            name="username"
                            required
                            onChange={e => this.setState({username: e.target.value})}
                            value={this.username}
                            />
                        </div>

                        <div className="form--input">
                            <label>EMAIL</label>
                            <input
                            type="email"
                            name="email"
                            required
                            onChange={e => this.setState({email: e.target.value})}
                            value={this.email}
                            />
                        </div>

                        <div className="form--input">
                            <label>COUNTRY</label>
                            <input
                            type="text"
                            name="country"
                            required
                            onChange={e => this.setState({country: e.target.value})}
                            value={this.country}
                            />
                        </div>

                        <div className="form--input">
                            <label>PASWORD</label>
                            <input
                            type="password"
                            name="password"
                            required
                            onChange={e => this.setState({password: e.target.value})}
                            value={this.password}
                            />
                        </div>

                        <input type="submit" value="Register" />
                    </form>

                    <form className="login" onSubmit={this.handleSubmit}>

                        <div className="form--input">
                            <label>EMAIL</label>
                            <input
                            type="email"
                            name="email"
                            required
                            onChange={e => this.setState({email: e.target.value})}
                            value={this.email}
                            />
                        </div>

                        <div className="form--input">
                            <label>PASWORD</label>
                            <input
                            type="password"
                            name="password"
                            required
                            onChange={e => this.setState({password: e.target.value})}
                            value={this.password}
                            />
                        </div>
                        
                        <input type="submit" value="Login" />
                    </form>
                </div>

                <div className="user--modal--logged modal">

                    {(this.state.curUser ? <h2>HIGHSCORE: {this.state.curUser.profile.highscore}</h2>: "" )}
                    <form className="edit--user" onSubmit={this.handleSubmit}>

                        <div className="form--input">
                            <label>USERNAME</label>
                            <input
                            type="text"
                            name="username"
                            required
                            onChange={e => this.setState({username: e.target.value})}
                            value={this.state.username}
                            />
                        </div>

                        <div className="form--input">
                            <label>COUNTRY</label>
                            <input
                            type="text"
                            name="country"
                            required
                            onChange={e => this.setState({country: e.target.value})}
                            value={this.state.country}
                            />
                        </div>

                        
                        <input type="submit" value="EDIT INFO" />
                    </form>

                    <form className="add--friend" onSubmit={this.handleSubmit}>

                        <div className="form--input">
                        <h3>ADD A FRIEND TO YOUR FRIEND'S LIST</h3>
                            <label>FRIEND's EMAIL</label>
                            <input
                            type="email"
                            name="friendEmail"
                            required
                            onChange={e => this.setState({friendEmail: e.target.value})}
                            value={this.friendEmail}
                            />
                        </div>
                        
                        <input type="submit" value="ADD A FRIEND" />
                    </form>

                    <div className="delete icon" onClick={this.handleSubmit}><i class="delete fa fa-trash"></i></div>
                    <div className="logout icon" onClick={this.handleSubmit}><i class="logout  fa fa-sign-out"></i></div>
                    
                </div>

                <GameOverModal points={this.props.points} highscore={this.state.highscore} user={this.state.curUser} playAgainFunc={this.handleGameOverModal} signUpFunc={() => this.userModal("user--modal")} />


            </section>
                
        )
    }
    
}

export default RightSection;