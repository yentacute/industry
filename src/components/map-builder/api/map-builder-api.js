import http from "../../../../src/helpers/api/axiosHttp";

const apiName = "map"
const apiGroupLayer = "group-layer-map"
const apiLayerMap = "layer-map"

// Viết ở backend thêm api get layer, style theo map id
const getGroupInMap = (kcnSlug, mapId) => {
    return http.get(`/${kcnSlug}/${apiGroupLayer}/?map_id=${mapId}`);
};

/**
 * [addGroup Thêm nhóm (chuyên đề) mới bản đồ]
 * @kcnSlug     Tên slug của KCN (build map dành riêng cho từng KCN)
 * @mapID       Id của bản đồ cần thêm nhóm
 * @groupName   Tên của nhóm cần them
 * @return      response from server
 */
const addGroup = (kcnSlug, mapId, groupName) => {
    const data = {
        "name": groupName,
        "map": mapId
    }
    return http.post(`/${kcnSlug}/${apiGroupLayer}/`, data);
};

/**
 * [renameGroup Sửa tên nhóm (chuyên đề) bản đồ]
 * @kcnSlug     Tên slug của KCN (build map dành riêng cho từng KCN)
 * @groupId     Id của group cần sửa tên
 * @groupName   Tên của mới của nhóm
 * @return      response from server
 */
const renameGroup = (kcnSlug, groupId, groupName)  => {
    const data = {
        "name": groupName
    }
    return http.patch(`/${kcnSlug}/${apiGroupLayer}/${groupId}/`, data);
}

/**
 * [renameGroup Gỡ nhóm (chuyên đề) bản đồ]
 * Khi remove nhóm thì tất cả các layer trong nhóm cũng sẽ bị remove khỏi bản đồ
 * @kcnSlug     Tên slug của KCN (build map dành riêng cho từng KCN)
 * @groupId     Id của group gỡ khỏi bản đồ
 * @return      response from server
 */
const removeGroup = (kcnSlug, groupId)  => {
    return http.delete(`/${kcnSlug}/${apiGroupLayer}/${groupId}/`);
}

/**
 * [addLayerToGroup Thêm Layer vào nhóm (chuyên đề) bản đồ]
 * Thêm từng layer 1, không cần mapId bởi vì GroupLayer đã tham chiếu tới MapID
 * @kcnSlug     Tên slug của KCN (build map dành riêng cho từng KCN)
 * @groupId     Id của group cần thêm lớp 
 * @layerId     Id layer
 * @return      response from server
 */
const addLayerToGroup = (kcnSlug, groupId, layerId)  => {
    const data = {
        "group_layer_display": groupId,
        "layer": layerId
    }
    return http.post(`/${kcnSlug}/${apiLayerMap}/`, data);
}


/**
 * [removeLayer Gỡ lớp khỏi Bản đồ(chuyên đề) bản đồ]
 * @kcnSlug     Tên slug của KCN (build map dành riêng cho từng KCN)
 * @layerMapId  Id layerMapId
 * @return      response from server
 */
const removeLayer = (kcnSlug, layerMapId) => {
    return http.delete(`/${kcnSlug}/${apiLayerMap}/${layerMapId}/`);
}

/**
 * [updateLayerStyle Cập nhật style cho lớp]
 * Đồng thời thay đổi style default của layer trên geoserver
 * @kcnSlug     Tên slug của KCN (build map dành riêng cho từng KCN)
 * @mapID       Id của bản đồ
 * @layerId     Id layer
 * @styleId     Id style
 * @return      response from server
 */
const updateLayerStyle = (kcnSlug, layerMapId, styleId) => {
    const data = {
        "type": "update-style",
        "style": styleId
    }
    return http.patch(`/${kcnSlug}/${apiLayerMap}/${layerMapId}/`, data);
}

export default {
    addGroup,
    renameGroup,
    removeGroup,
    addLayerToGroup,
    removeLay,
    updateLayerStyle,
    getGroupInMap
};