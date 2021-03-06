const URL =process.env.REACT_APP_API_URL

class AuthModel {
    static register = data => {
        return fetch(`${URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => response.json());
      };

    static login = data => {
        return fetch(`${URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(data),
        }).then(response => response.json());

    };

    static show = () => {
        return fetch(`${URL}/profile`, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.uid}`,
            },
            // body:JSON.stringify(data),
        }).then(response => response.json());

    };

    static edit = data => {
        return fetch(`${URL}/profile/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.uid}`,

            },
            body:JSON.stringify(data),
        }).then(response => response.json());

    };

    static addScore = data => {
        return fetch(`${URL}/profile/addscore`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.uid}`,

            },
            body:JSON.stringify(data),
        }).then(response => response.json());

    };

    static addFriend = data => {
        return fetch(`${URL}/profile/addfriend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.uid}`,

            },
            body:JSON.stringify(data),
        }).then(response => response.json());

    };

    static delete = data => {
        return fetch(`${URL}/user/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.uid}`,

            },
            body:JSON.stringify(data),
        }).then(response => response.json());

    };

}

export default AuthModel;