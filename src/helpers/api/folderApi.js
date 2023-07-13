import http from "./axiosHttp";
const getAll = (slug) => {
    return http.get(`/${slug}/folder`);
};

const get = url => {
    return http.get(url);
};

const create = (slug, data) => {
    return http.post(`/${slug}/folder/`, data);
};

const updateFolder = (id, slug, data) => {
    return http.patch(`/${slug}/folder/${id}/`, data);
};

const updateFile = (id, slug, data) => {
    return http.patch(`/${slug}/layer/${id}/`, data);
};
const removeFolder = (id, slug) => {
    return http.delete(`/${slug}/folder/${id}/`);
};
const removeFile = (id, slug) => {
    return http.delete(`/${slug}/layer/${id}/`);
};

const createModel = (url, data) => {
    return http.post(url, data);
}

const post = (url, data) => {
    return http.post(url, data);
}

const update = (url, data) => {
    return http.put(url, data);
}

const remove = (id) => {
    return http.delete(id);
}
const checkExistData = (url) => {
    return http.get(url);
}

const getAllPin = () => {
    return http.get(`/folder/pin/`)
}
const pin = (id) => {
    return http.post(`/folder/${id}/pin/`)
}

const exportExcel = (url) => {
    return http.get(url, { responseType: 'blob' })
}
const importExcel = (url, data) => {
    return http.post(url, data, { responseType: 'blob' })
}
const exportShapeFile = (url) => {
    return http.get(url, { responseType: 'blob' })
}

const addFolderPermission = (data) => {
    return http.post('/permission-folder/', data)
}

const addLayerPermission = (data) => {
    return http.post('/permission-model-dynamic/', data)
}

const editDataStructure = (slug, id, data) => {
    return http.patch(`/${slug}/layer/${id}/field/`, data);
}

export default {
    getAll,
    get,
    create,
    updateFolder,
    updateFile,
    removeFolder,
    removeFile,
    createModel,
    checkExistData,
    pin,
    getAllPin,
    update,
    remove,
    post,
    exportExcel,
    importExcel,
    exportShapeFile,
    addFolderPermission,
    addLayerPermission,
    editDataStructure
};