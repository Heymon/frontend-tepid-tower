import React, {useState, useEffect} from "react"

import "./LeaderboardModal.css"

import LeaderboardModel from "../../models/leaderboard";
import { userState } from "../../recoil/atoms"

function LeaderboardModal(props) {

    const [users, setUsers] = useState([]);

    function getUsers() {
        LeaderboardModel.showGlobal().then(json => {
            console.log(json.curUsers)
            const array = json.curUsers;
            array.sort((b,a) => a.profile.highscore - b.profile.highscore)
            setUsers(array);
            console.log(users);
        })
    }

    useEffect(function () {
        getUsers()
    }, [])

    function fetchBoard() {
        getUsers();
    }   

    return (

        <div onClick={() => fetchBoard()} className="leaderboard--modal modal">
                <h2>LEADERBOARDS</h2>
                
                <div>
                    <table>
                        <tr>
                            {/* {users.length ? users[0].email : -1} */}
                            <th>Username</th>
                            <th>Score</th>
                            <th>Country</th>
                        </tr>
                        {users.map((item, index) => {
                                return <tr>
                                            <td>{item.profile.username}</td>
                                            <td>{item.profile.highscore}</td>
                                            <td>{item.profile.country}</td>
                                        </tr>
                            })} 
                    </table>
                </div>
        </div>
    )
    
}

export default LeaderboardModal;