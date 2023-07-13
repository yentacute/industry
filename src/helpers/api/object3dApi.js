import http from "./axiosHttp";
// const getAll = () => {
//     return http.get("/folder");
// };
const getAllWithPagination = () => {
    return http.get('object3d');
}
const getAll = () => {
    return http.get('object3d/?all');
}
const get = (id) => {
    return http.get(`/object3d/${id}/`);
};

const create = (url, data) => {
    return http.post(url, data);
};

// const update = (id, data) => {
//     return http.put(`/folder/${id}`, data);
// };

// const remove = id => {
//     return http.delete(`/folder/${id}`);
// };


export default {
    getAllWithPagination,
    getAll,
    get
};