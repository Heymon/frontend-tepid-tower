const URL =process.env.REACT_APP_API_URL

class LeaderboardModel {

    static showGlobal = () => {
        return fetch(`${URL}/leaderboard/global`, {
            method: "GET",
            // headers: {
            //     // "Content-Type": "application/json",
            //     authorization: `Bearer ${localStorage.uid}`,
            // },
            // body:JSON.stringify(data),
        }).then(response => response.json());

    };
}//TODO create rejection handler for when fetch doesnt work

export default LeaderboardModel;