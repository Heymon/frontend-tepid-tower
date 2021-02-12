import React from 'react';
import './RightSection.css'

import AuthModel from "../../models/auth";

import GetResetState from "../../recoil/components/GetResetState";


class RightSection extends React.Component {

    state = {
        reset: false,

        curUser:null,

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

        console.log(prevProps)
        if (!this.props.gameStatus) {
            const popUp = document.querySelector(".user--modal");
            if (popUp.style.display === "flex") {
                return
            }
            console.log("gameover");
            console.log(this.props.points)
            if (this.state.curUser) {
                AuthModel.addScore({score: this.props.points}).then(json => {
                    console.log(json);
                    if (json.message === "score") {
                        
                        this.userModal("gameover--score--modal");

                    } else if(json.message === "highscore") {

                        this.userModal("gameover--highscore--modal");
                    }
                })
            }
        } else {
            // console.log(this.props)
            if(this.state.reset === true) {

                this.setState({reset: false});
            }
        }
    }

    userModal = (class_name) => {

        const popUps = document.querySelectorAll(".modal");
        console.log(popUps);

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
                // console.log(popUps[i].style.display)
                if (popUps[i].style.display === "flex") {
                    
                    popUps[i].style.display = "none";
                    const error = document.querySelector(".error--message");
                    if(error) error.remove();
                    // break
                } else {

                    popUps[i].style.display = "flex";
                }
                // break
            } else {
                // if (popUps[i].style.display === "flex") {
                    
                //     popUps[i].style.display = "none";
                //     break
                // }
                popUps[i].style.display = "none";
                const error = document.querySelector(".error--message");
                if(error) error.remove();
            }
           
        }

        // if(this.state.curUser === null) {

        //     const popUp = document.querySelector(".user--modal");

        //     if (popUp.style.display === "flex") {
                
        //         popUp.style.display = "none";
        //         const error = document.querySelector(".error--message");
        //         if(error) error.remove();
        //         return
        //     }
            
        //     return popUp.style.display = "flex";
        // } else {
        //     const formPopUp = document.querySelector(".user--modal");
        //     if (formPopUp.style.display === "flex") formPopUp.style.display = "none";

        //     const userPopUp = document.querySelector(".user--modal--logged");
        //     if (userPopUp.style.display === "flex") {
                
        //         userPopUp.style.display = "none";
        //         const error = document.querySelector(".error--message");
        //         if(error) error.remove();
        //         return
        //     }

        //     AuthModel.show().then(json => {
        //         console.log(json);
        //         if (json.field) {
        //             const form = document.querySelector(".signup");
        //             return form.appendChild(this.createErrorMessage(json.message));
        //         }
        //         this.setState({curUser: json.curUser });
        //     });
            
        //     return userPopUp.style.display = "flex";

        // }

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
                if (json.field) {
                    const form = document.querySelector(".edit--user");
                    return form.appendChild(this.createErrorMessage(json.message));
                }
                this.setState({
                    curUser: json.updatedUser, 
                    country: json.updatedUser.profile.country,
                    username: json.updatedUser.profile.username,
                });
                const error = document.querySelector(".error--message");
                if(error) error.remove();
                return
            })

        } else if(event.target.getAttribute("class")==="logout") {
            
            this.userModal();
            this.setState({
                curUser: null, 
                country: "",
                username: "",
                email: "",
                password: ""
                })
            localStorage.removeItem("uid");

        } else if(event.target.getAttribute("class")==="delete") {
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
        event.preventDefault();

        console.log(event.target);
        console.log(event.target.getAttribute("class"));
        
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
                    <div>Settings</div>
                    <div>Trophies</div>
                    <div>Controls</div>
                </aside>
                <aside className="aside--bottom">
                    <div onClick={this.handleUserOpt}>
                        user
                    </div>
                </aside>
                
                <GetResetState reset={this.state.reset} />
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
                            name="email"
                            required
                            // onChange={e => this.setState({username: e.target.value})}
                            // value={this.state.username}
                            />
                        </div>
                        
                        <input type="" value="ADD A FRIEND" />
                    </form>

                    <div className="delete" onClick={this.handleSubmit}>DELETE BUTTON</div>
                    <div className="logout" onClick={this.handleSubmit}>LOG OUT BUTTON</div>
                </div>

                <div className="gameover--highscore--modal modal">

                    {/* {(this.state.curUser ? <h2>{this.state.curUser.profile.highscore}</h2>: "" )} */}
                    <div>
                        <h2>THE TOWER HAS YOU NOW</h2>
                        <div>
                            <h3>HIGHSCORE: {this.props.points}</h3>
                            <button className="playagain" onClick={this.handleGameOverModal}>PLAY AGAIN</button>
                        </div>
                    </div>

                    <div>
                        <h2>SIGN UP TO ADD YOU SCORE!</h2>
                        <div>
                            <button onClick={() => this.userModal("user--modal")}>SIGNUP/LOGIN</button>
                        </div>
                    </div>

                </div>

                <div className="gameover--score--modal modal">

                    {/* {(this.state.curUser ? <h2>{this.state.curUser.profile.highscore}</h2>: "" )} */}
                    <div>
                        <h2>THE TOWER HAS YOU NOW</h2>
                        <div>
                            <h3>SCORE: {this.props.points}</h3>
                            <button className="playagain" onClick={this.handleGameOverModal}>PLAY AGAIN</button>
                        </div>
                    </div>

                    <div>
                        <h2>SIGN UP TO ADD YOU SCORE!</h2>
                        <div>
                            <button onClick={() => this.userModal("user--modal")}>SIGNUP/LOGIN</button>
                        </div>
                    </div>

                </div>

            </section>
                
        )
    }
    
}

export default RightSection;