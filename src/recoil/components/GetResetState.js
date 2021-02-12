import React, { useEffect, useRef }  from 'react';

import {gameState} from "../../recoil/atoms"
import {useRecoilState} from "recoil";
import {resetState} from "../../recoil/atoms"


function GetResetState(props) {

    const [gameStatus,setGameStatus] = useRecoilState(gameState);
    const [reset,setResetStatus] = useRecoilState(resetState);

    const prevResetRef = useRef();
    useEffect(() => {
        prevResetRef.current = reset;
    });
    const prevReset = prevResetRef.current;


    useEffect(function () {
        // setPoints(props.reset);
        console.log(reset);
        setResetStatus(props.reset);
        console.log("reseting game", prevReset, props, reset);
        
    },[props]);

    return null

}

export default GetResetState;