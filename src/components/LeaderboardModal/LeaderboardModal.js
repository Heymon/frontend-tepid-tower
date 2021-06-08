import React, {useState, useEffect} from "react"

import "./LeaderboardModal.css"

import LeaderboardModel from "../../models/leaderboard";
import { userState } from "../../recoil/atoms"

function LeaderboardModal(props) {

    const [users, setUsers] = useState([]);

    function getUsers() {
        LeaderboardModel.showGlobal().then(json => {
            console.log(json.curProfiles)
            const array = json.curProfiles;
            // array.sort((b,a) => a.profile.highscore - b.profile.highscore)
            setUsers(array);
            console.log(users);
        })
    }

    useEffect(function () {//TODO fix bug so that leadear board loads once the icon is clicked; as of now it only loads if the board is clicked
        getUsers()
        // console.log("load?");
    },[])//here only loads once at mount

    function fetchBoard() {
        getUsers();
    }   

    return (

        <div onClick={() => fetchBoard()} className="leaderboard--modal modal">
                <h2>LEADERBOARDS</h2>
                <div>
                    <div>
                        <table>
                            <colgroup>
                                <col style={{backgroundColor: "blue", width: 22 + "px"}}/>
                                {/* <col style={{backgroundColor: "blue", width: 22 + "px"}}/>
                                <col style={{backgroundColor: "blue", width: 22 + "px"}}/>
                                <col style={{backgroundColor: "blue", width: 22 + "px"}}/> */}
                                {/* <col span="2" style={{width: 15 + "px"}}/> */}
                            </colgroup>
                            <thead>
                                <tr>
                                    {/* {users.length ? users[0].email : -1} */}
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Score</th>
                                    <th>Country</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div>
                        <table>
                            <colgroup>
                                <col span="1" style={{backgroundColor: "blue", width: 22 + "px"}}/>
                                {/* <col span="2" style={{backgroundColor: "blue", width: 22 + "px"}}/>
                                <col span="3" style={{backgroundColor: "blue", width: 22 + "px"}}/>
                                <col span="4" style={{backgroundColor: "blue", width: 22 + "px"}}/> */}

                            </colgroup>
                            <tbody>
                            {users.map((item, index) => {
                                    return <tr key={`L${index}`}>
                                                <td>{index+1}</td>
                                                <td>{item.username}</td>
                                                <td>{item.highscore}</td>
                                                <td>{item.country}</td>
                                            </tr>
                            })}
                            </tbody> 
                        </table>
                    </div>
                </div>
        </div>
    )
    
}

export default LeaderboardModal;