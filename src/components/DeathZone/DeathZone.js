import React from "react"
import fogo from '../../assets/Fogo-Animado-png.gif';
import "./DeathZone.css"

function DeathZone(props) {

    return (
        <div className="deathzone" style ={(props.display ? {display: "flex"}: {display: "none"})}>
            <div><img src={fogo}/></div>
            <div><img src={fogo}/></div>
            <div><img src={fogo}/></div>
            <div><img src={fogo}/></div>
            <div><img src={fogo}/></div>
            <div><img src={fogo}/></div>
        </div>
    )
    
}

export default DeathZone;