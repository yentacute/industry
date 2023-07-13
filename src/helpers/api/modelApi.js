import http from "./axiosHttp";
// const getAll = () => {
//     return http.get("/folder");
// };

const get = (id, slug) => {
    return http.get(`/${slug}/layer/${id}/`);
};

const create = (url, data) => {
    return http.post(url, data);
};

const update = (url, data) => {
    return http.put(url, data);
};

// const remove = id => {
//     return http.delete(`/folder/${id}`);
// };


export default {
    create,
    get,
    update
};