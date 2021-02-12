import React, { useEffect, useRef } from 'react';
import './Landing.css'

import Game from '../components/Game/Game'
import LeftSection from '../components/LeftSection/LeftSection'
import RightSection from '../components/RightSection/RightSection'

import {useRecoilState} from "recoil";
import {resetState, userState} from "../recoil/atoms"
import {gameState} from "../recoil/atoms"
// import {resetState} from "../recoil/atoms"
import {userPoints} from "../recoil/atoms"

import AuthModel from "../models/auth";


function Landing() {

    const [user,setUser] = useRecoilState(userState);
    const [gameStatus,setGameStatus] = useRecoilState(gameState);
    const [resetStatus,setResetStatus] = useRecoilState(resetState);
    const [points,setPoints] = useRecoilState(userPoints);

    console.log(resetStatus);

    // const prevStatusRef = useRef();
    // useEffect(() => {
    //     prevStatusRef.current = gameStatus;
    // });
    // const prevStatus = prevStatusRef.current;

    // useEffect(function () {   
    //     console.log(resetStatus, gameStatus)
    //     // if (prevStatus !== gameStatus) {     
    //         console.log("landing user")
    //         // if(resetStatus) resetStatus = false
    //         // if (localStorage.uid) {//if local storage already has a token
    //         //     AuthModel.show().then(json => {//verify
    //         //         setUser(json.curUser);//and set the global user state
    //         //     });
    //         // }
    //     // }
    //   }, [resetStatus]);

      useEffect(function () {   
        console.log(gameStatus);
        if (localStorage.uid) {//if local storage already has a token
            AuthModel.show().then(json => {//verify
                setUser(json.curUser);//and set the global user state
            });
        }

      }, []);



    return (
        <div className="landing">
            <LeftSection />
            <Game reset={resetStatus}/>
            <RightSection user={user} gameStatus={gameStatus} points={points} />
        </div>
    )
    
}

export default Landing;