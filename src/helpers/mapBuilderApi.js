import http from "../../src/helpers/api/axiosHttp";


const path_api = `map`

const addLayers = (kcn_name, mapId, layers) => {

    const data = {
        "layers": layers
    }
    return http.patch(`/${kcn_name}/${path_api}/${mapId}/`, data);
};

// Thêm mới lớp dữ liệu
// Cập nhật lại style dành cho 1 layer
// Remove 1 layer khỏi map
//  
const updateStyleLayer = (kcn_name, mapId, layers) => {

}

// const removeLayer = (kcn_name, mapId, layerName) => {

//     const data = {
//         "layers": layers
//     }
//     return http.patch(`/${kcn_name}/${path_api}/${mapId}/`, data);
// };



export default {
    addLayers,
};