import React from 'react';


import {userState} from "../../recoil/atoms"
import {useRecoilState} from "recoil";



function GetUserState(props) {

    const [user,setUser] = useRecoilState(userState);

    console.log(user);
    setUser(props.user);
    console.log(user);

    console.log("this.works");
    



    return null
}

export default GetUserState;