import React from "react"

import "./LeaderboardModal.css"

function LeaderboardModal(props) {

    return (

        <div className="leaderboard--modal modal">
                <h2>LEADERBOARDS</h2>
                <div>
                    <table>
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Country</th>
                        </tr>
                        <tr>
                            <td>January</td>
                            <td>$100</td>
                            <td>$100</td>
                        </tr>
                        <tr>
                            <td>February</td>
                            <td>$80</td>
                            <td>$80</td>
                        </tr>
                    </table>
                </div>
        </div>
    )
    
}

export default LeaderboardModal;