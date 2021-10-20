import React from 'react';

import './GameOverModal.css';


class GameOverModal extends React.Component {


    render () {
        return(
            <div className={(this.props.highscore === true ? "gameover--modal highscore modal" : "gameover--modal score modal" )}>

                {/* {(this.props.highscore === true ? "gameover--highscore--modal modal" : "gameover--score--modal modal" )} */}
                <div>
                    <h2 className={"h2--title"}>THE TOWER HAS YOU NOW!</h2>
                    <div>
                        {(this.props.highscore === true ? <h3>HIGHSCORE: {this.props.points}</h3>: <h3>SCORE: {this.props.points}</h3> )}
                        <button className="playagain" onClick={this.props.playAgainFunc}>PLAY AGAIN</button>
                    </div>
                </div>

                {(this.props.user === null ? 
                <div>
                    <h2>SIGN UP TO ADD YOU SCORE!</h2>
                    <div>
                        <button onClick={this.props.signUpFunc}>SIGNUP/LOGIN</button>
                    </div>
                </div> : 
                <div>
                    <h2>You are logged in as {this.props.user.profile.username} !</h2>
                </div> )}

            </div>
        )
    }
}

export default GameOverModal;