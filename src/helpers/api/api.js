import {BASE_URL} from "./axiosHttp.js";
import {toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const PROXY = BASE_URL + "/api";
export const UerCustomer = JSON.parse(localStorage.getItem('auth'));

export const useFetch = async function (url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${UerCustomer}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
export const usePost = async function (url, dataPost) {
    try {
        const response = await fetch(`${PROXY}/${url}/`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${UerCustomer}`,
            },
            body: dataPost,
        });
        /*const data = await response.json();
        return data;*/
        return response;
    } catch (error) {
        console.log(error);
    }
};
export const usePatch = async function (url, dataPost) {
    try {
        const response = await fetch(`${PROXY}/${url}/`, {
            method: "PATCH",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${UerCustomer}`,
            },
            body: dataPost,
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const fetchGet = async function (url) {
    try {
        const response = await fetch(`${PROXY}/${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${UerCustomer}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
export const fetchDelete = async function (url, toast = '') {
    try {
        const response = await fetch(`${PROXY}/${url}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${UerCustomer}`,
            },
        });
        if (!toast) {
            if (response.ok) {
                toast.success("Xoá thành công!", {
                    theme: 'colored',
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } else {
                toast.error("Xoá thất bại!", {
                    theme: 'colored',
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        }
        return response;
    } catch (error) {
        console.log(error);
    }
};
export const postAPI = async function (url, dataPost) {
    try {
        const response = await fetch(`${PROXY}/${url}`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${UerCustomer}`,
            },
            body: dataPost,
        });
        if (response.ok) {
            toast.success("Đã thêm thành công!", {
                theme: 'colored',
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } else {
            toast.error("Error: Chưa thể thêm mới!", {
                theme: 'colored',
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
export const updateAPI = async function (url, dataPut) {
    try {
        const response = await fetch(`${PROXY}/${url}`, {
            method: "PATCH",
            headers: {
                "Accept": "*/*",
                "Authorization": `Bearer ${UerCustomer}`,
            },
            body: dataPut,
        });
        if (response.ok) {
            toast.success("Cập nhật thành công!", {
                theme: 'colored',
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } else {
            toast.error("Cập nhật thất bại!", {
                theme: 'colored',
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};