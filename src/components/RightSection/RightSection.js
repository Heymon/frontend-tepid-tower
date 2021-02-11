import React from 'react';
import './RightSection.css'

import AuthModel from "../../models/auth";


class RightSection extends React.Component {

    state = {
        username: "",
        email: "",
        country: "",
        password: ""
    }


    handleUserOpt = (event) => {
        // event.preventDefault();
        //sends user info to be registered
        event.stopPropagation();
        console.log(event.target);
        const popUp = document.querySelector(".user--modal");
        if (popUp.style.display === "flex") {
            
            return popUp.style.display = "none";
        }

        popUp.style.display = "flex";
      }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log(event.target.getAttribute("class"));

        if (event.target.getAttribute("class")==="signup") {
            
            AuthModel.register(this.state).then(json => {
                console.log(json);
            });
        } else {
            AuthModel.login({email:this.state.email, password: this.state.password}).then(json => {
                console.log(json);
            })
        }
          
      }

    render () {
        return (

            <section className="section--right">
                {/* <h2>options</h2> */}
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

                <div className="user--modal">
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

            </section>
                
        )
    }
    
}

export default RightSection;