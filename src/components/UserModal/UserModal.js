import React from'react';
import './UserModal.css'

import AuthModel from "../../models/auth";

import GetUserState from "../../recoil/components/GetUserState"

class UserModal extends React.Component {

    state = {

        curUser: undefined,

        friendEmail:"",

        username: "e",
        email: "",
        country: "",
        password: ""
    }

    componentDidUpdate (prevProps, prevState) {
        console.log(this.props.user);
        console.log(prevState);

        if (this.state.curUser === undefined && this.props.user !== null) {
            console.log("setttt");
            this.setState({
                curUser: this.props.user, 
                country: this.props.user.profile.country,
                username: this.props.user.profile.username,
                password: ""
            })   
        }

        if(this.state.curUser){
            if(document.querySelector(".user--modal--logged").style.display === "none"){
                if(this.state.curUser.profile.username !== this.state.username || this.state.curUser.profile.country !== this.state.country){
                    this.setState({username: this.state.curUser.profile.username, country: this.state.curUser.profile.country})
                }
            }

            if (this.props.user) {
                
                if (this.props.user.profile.highscore !== this.state.curUser.profile.highscore) {
                    this.setState({curUser: this.props.user});
                }
            }
        }
    }

    createResponseMessage = (json) => {
        console.log(json);
        let element = document.createElement("p");
        element.appendChild(document.createTextNode(json.message));
        element.setAttribute("class", `${json.type} message`);
        return element;
    }

    clearInput = (className, inputName) => {//it finds the input elements in the html and sets their input value to empty, so that it will match with the state variables

        // const inputEl = document.querySelector(`.${className} > * > input`);
        const elInputList = document.querySelectorAll(`.${className} > * > input`);
        console.log(elInputList);
        for( let index = 0; index<elInputList.length; index++){
            console.log(elInputList[index]);
            if (inputName) {//for specific input
                
                if (elInputList[index].name === inputName) {
                    elInputList[index].value = elInputList[index][`${elInputList[index].name}`] = "";
                    // TODO add break here so it doesnt go unnecessarly thru the whole loop
                }
                continue;
            }
            elInputList[index].value = elInputList[index][`${elInputList[index].name}`] = "";
            // instead of cleaning here another solution would be setting the state equal to whatever is in the input
        }
        
        //inputEl.value = inputEl[`${inputEl.name}`] = "";

    }

    handleSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log(event.target.getAttribute("class"));
        
        if (event.target.getAttribute("class")==="signup") {

            const form =this.state;
            delete form.friendEmail;
            delete form.curUser;
            AuthModel.register(form).then(json => {
                console.log(json);
                const responseMessage = document.querySelector(".message");
                if(responseMessage) responseMessage.remove();
                if (json.field) {
                    const form = document.querySelector(".signup");
                    return form.appendChild(this.createResponseMessage(json));
                }
            });
            this.setState({password: ""});
            this.clearInput("signup", "password");
        } else if(event.target.getAttribute("class")==="login"){
            AuthModel.login({email:this.state.email, password: this.state.password}).then(json => {
                console.log(json);
                const responseMessage = document.querySelector(".message");
                if(responseMessage) responseMessage.remove();
                if (json.field) {
                    const form = document.querySelector(".login");
                    return form.appendChild(this.createResponseMessage(json));
                }

                this.setState({
                    curUser: json.foundUser, 
                    country: json.foundUser.profile.country,
                    username: json.foundUser.profile.username,
                    password: ""
                })
                this.clearInput("login");
                this.clearInput("signup");
                localStorage.setItem("uid", json.signedJwt);
                //DONE if is on gameOver add score and restart the game
                if(!this.props.gameStatus && !this.props.isReseting) {
                    console.log(this.props.points);
                    AuthModel.addScore({score: this.props.points}).then(json => {
                        console.log(json);
                        // this.setState({curUser: json.updatedUser});
                        return this.props.changeModal("user--modal--logged");
                        // return this.userModal("user--modal--logged");
                    });
                    this.props.playAgainFunc(null);
                    return
                    // return this.userModal(""); 
                }
                return this.props.changeModal("user--modal--logged");
                // return this.userModal("user--modal--logged");
            })
        } else if(event.target.getAttribute("class")==="edit--user"){
            const responseMessage = document.querySelector(".message");
            if(responseMessage) responseMessage.remove();

            if(this.state.curUser.profile.username === this.state.username && this.state.curUser.profile.country === this.state.country) {
                const form = document.querySelector(".edit--user");
                return form.appendChild(this.createResponseMessage({type:"error", message:"Profile has no changes."}));
            }
            AuthModel.edit({username: this.state.username, country: this.state.country}).then(json => {
                console.log(json);
                if (json.field) {
                    const form = document.querySelector(".edit--user");
                    form.appendChild(this.createResponseMessage(json));
                    if(json.status !== 200)return;
                }
                this.setState({
                    curUser: json.updatedUser, 
                    country: json.updatedUser.profile.country,
                    username: json.updatedUser.profile.username,
                });
                return
            })

        } else if(event.target.getAttribute("class")==="add--friend"){

            const responseMessage = document.querySelector(".message");
            if(responseMessage) responseMessage.remove();

            if (this.state.friendEmail === this.state.curUser.email) {
                const form = document.querySelector(".add--friend");
                return form.appendChild(this.createResponseMessage({type:"error", message:"Please enter different email."}));
            }
            AuthModel.addFriend({friendEmail: this.state.friendEmail}).then(json => {
                console.log(json);

                if (json.field) {
                    if (json.status===200) {
                        console.log("hey")
                        // const test = document.querySelector(".add--friend > * > input");
                        // test.setAttribute("value", "");
                        // test.value = test.friendEmail = "";
                        this.clearInput("add--friend");
                        this.setState({friendEmail: ""})
                    }
                    const form = document.querySelector(".add--friend");
                    return form.appendChild(this.createResponseMessage(json));
                }
                return
            })

        }else if(event.target.classList.contains("logout")) {
            this.props.changeModal("");
            // this.userModal();
            // this.clearInput("login");// just noticed i shouldnt clean when they go back but the moment they login
            // this.clearInput("signup");
            // instead of cleaning here another solution would be setting the state variables equal to whatever is in the input
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
                    return form.appendChild(this.createResponseMessage(json));
                }
                this.props.changeModal("");
                // this.userModal();
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

    render () {
        return (
            <>
            {this.state.curUser !== undefined ? <GetUserState user={this.state.curUser}/> : ""}
            

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
                            <h3>ADD A FRIEND TO YOUR FRIEND'S LEADERBOARD</h3>
                            <input
                            type="email"
                            name="friendEmail"
                            placeholder="friend@mail.com"
                            required
                            onChange={e => this.setState({friendEmail: e.target.value})}
                            value={this.friendEmail}
                            />
                        </div>
                        
                        <input type="submit" value="ADD A FRIEND" />
                    </form>
                    <div>
                        <div className="delete icon" onClick={this.handleSubmit}><i className="delete fa fa-trash"></i></div>
                        <div className="logout icon" onClick={this.handleSubmit}><i className="logout  fa fa-sign-out"></i></div>
                    </div>
                </div>
                </>

        )
    }
}

export default UserModal;