import React from "react"

import "./ControlsModal.css"

function ControlsModal(props) {

    return (

        <div className="controls--modal modal">

            {/* {(this.state.curUser ? <h2>{this.state.curUser.profile.highscore}</h2>: "" )} */}
            <div>
                <h2>CONTROLS</h2>
                <div>
                    <h3>USE THE ARROWS KEY TO MOVE</h3>

                    <div>imageofarrowskeys</div>

                </div>
            </div>

            <div>
                <h3>USE SPACEBAR TO JUMP... THE LONGER YOU HOLD, THE HIGHER YOU WILL JUMP</h3>

                <div>imageofspacebar</div>
                
            </div>

        </div>
    )
    
}

export default ControlsModal;