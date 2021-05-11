import React, {useEffect, useRef} from 'react';
import { useRecoilCallback } from 'recoil';

import {useRecoilState} from 'recoil';
import {userState} from "../atoms"


function GetUserState(props) {

    const [user, setUser] = useRecoilState(userState);

    // const prevUserRef = useRef();
    // useEffect(() => {
    //     prevUserRef.current = user;
    // });
    // const prevUser = prevResetRef.current;
    
    useEffect (function () {
        console.log(user);
        console.log(props.user);
        if (user !== props.user) {
            console.log("setttt");
            setUser(props.user); 
        }
    },[props])

    return null
}

export default GetUserState;