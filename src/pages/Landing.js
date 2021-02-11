import React, { useEffect, useRef } from 'react';
import './Landing.css'

import Game from '../components/Game/Game'
import LeftSection from '../components/LeftSection/LeftSection'
import RightSection from '../components/RightSection/RightSection'

import {useRecoilState} from "recoil";
import {userState} from "../recoil/atoms"
import {gameState} from "../recoil/atoms"
import {userPoints} from "../recoil/atoms"

import AuthModel from "../models/auth";


function Landing() {

    const [user,setUser] = useRecoilState(userState);
    const [gameStatus,setGameStatus] = useRecoilState(gameState);
    const [points,setPoints] = useRecoilState(userPoints);

    // const prevStatusRef = useRef();
    // useEffect(() => {
    //     prevStatusRef.current = gameStatus;
    // });
    // const prevStatus = prevStatusRef.current;

    // useEffect(function () {   
    //     console.log(prevStatus, gameStatus)
    //     if (prevStatus !== gameStatus) {     
    //         console.log("checking user")
    //         // if (localStorage.uid) {//if local storage already has a token
    //         //     AuthModel.show().then(json => {//verify
    //         //         setUser(json.curUser);//and set the global user state
    //         //     });
    //         // }
    //     }
    //   }, [gameStatus]);

      useEffect(function () {   
        
        if (localStorage.uid) {//if local storage already has a token
            AuthModel.show().then(json => {//verify
                setUser(json.curUser);//and set the global user state
            });
        }

      }, []);



    return (
        <div className="landing">
            <LeftSection />
            <Game />
            <RightSection user={user} gameStatus={gameStatus} points={points}/>
        </div>
    )
    
}

export default Landing;