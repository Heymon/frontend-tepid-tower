import React from "react"

import "./DeathZone.css"

function DeathZone(props) {

    return (
        <div className="deathzone" style ={(props.display ? {display: "block"}: {display: "none"})}>
            death
        </div>
    )
    
}

export default DeathZone;