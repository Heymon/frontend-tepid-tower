import React, { useEffect, useRef }  from 'react';

import {gameState} from "../../recoil/atoms"
import {useRecoilState} from "recoil";
import {userPoints} from "../../recoil/atoms"
import {resetState} from "../../recoil/atoms"


function GetGameState(props) {

    const [gameStatus,setGameStatus] = useRecoilState(gameState);
    const [reset,setResetStatus] = useRecoilState(resetState);
    const [points,setPoints] = useRecoilState(userPoints);
    
    const prevStatusRef = useRef();
    useEffect(() => {
        prevStatusRef.current = gameStatus;
    });
    const prevStatus = prevStatusRef.current;

    useEffect(function () {
        setPoints(props.points);
        console.log(points);
        setGameStatus(props.status);
        
        // console.log("checking user", prevStatus, props, gameStatus);
        
      },[props]);

    // console.log(user);


    console.log("this.works");
    



    return null
}

export default GetGameState;