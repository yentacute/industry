import {BASE_URL} from "../api/axiosHttp.js";
import http from "../api/axiosHttp.js";
export const Token = () => {

    function setUser(user) {
        localStorage.setItem('auth', JSON.stringify(user));
    }

    function removeUser() {
        http.post(`/logout/`);
        localStorage.removeItem('auth');
    }

    const getUser = async function (navigate = '') {
        const tokenString = localStorage.getItem('auth');
        const user = JSON.parse(tokenString);
        if (user) {
            let newUser;
            try {
                const res = await fetch(BASE_URL + '/api/user/current-user/', {
                    method: "GET",
                    headers: {
                        "Accept": "*/*",
                        "Authorization": `Bearer ${user}`,
                    },
                });
                if (res.status === 200) {
                    await res.json()
                        .then(res => {
                            newUser = {
                                ...res,
                                token: user,
                            }
                        })
                } else {
                    // if (navigate) {
                    //     location.replace(`/account?next=${navigate}`);
                    // }
                }
            } catch (error) {
                console.log(error);
            }
            return newUser;
        }
    }


    /*const getPermissionRole = async () => {
        const getCurrentUser = getUser();
        console.log(getCurrentUser);
    }*/

    return {
        getUser,
        setUser,
        removeUser,
        /*getPermissionRole*/
    }
}