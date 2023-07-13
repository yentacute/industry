import { defineStore } from "pinia";
import { ref } from "vue";
import apiRequest from "../../helpers/api/folderApi";
import { successToast, errorToast } from "../../helpers/api/toastStyle";
import { v4 as uuidv4 } from "uuid";
import { methods_map, data as dataMapMain } from "./data_map.js";
import { isValidWmsBbox } from "../../utils/gisFunctionState";
import { fitBounds } from "../../common/map/function_map";

const currentUrlServer = "https://api-kcntest.gishub.vn";

export const useStaticData2d = defineStore("useStaticData2d", () => {
  const urlUpload2d = "/upload-2d-object";
  const localStorageName = "listData2dObject";

  const listData2dObject = ref([]);

  const listFeatureHighlight = ref([]);
  const listManageFeatureHighlight = ref([]);

  function getPolygon(object) {

    return object.geom.features[0].geometry.coordinates
  }

  function zoomTo2dObject(object2d) {
    const found = listData2dObject.value.find((obj) => obj.id == object2d.id);
    if (found) {
      const bbox = found.bbox;
      // Nếu bbox là đúng thì zoom tới vị trí đó
      if (isValidWmsBbox(bbox)) {
        const listBounds = [
          [bbox["maxx"], bbox["maxy"]],
          [bbox["minx"], bbox["miny"]],
        ];
        fitBounds(listBounds, dataMapMain.map);
      } else {
      }
    }
  }

  function getDetail(objectId) {
    const found = listData2dObject.value.find((obj) => obj.id == objectId);
    return found
  }

  function remove2dObject(object2d) {
    removeFeatureShow(object2d);
    const found = listData2dObject.value.find((obj) => obj.id == object2d.id);
    const index = listData2dObject.value.indexOf(found);
    if (index > -1) {
      listData2dObject.value.splice(index, 1);
    }
  }

  function getBoundingBox(data) {
    var bounds = {},
      coords,
      point,
      latitude,
      longitude;

    for (var i = 0; i < data.features.length; i++) {
      coords = data.features[i].geometry.coordinates[0];

      for (var j = 0; j < coords.length; j++) {
        longitude = coords[j][0];
        latitude = coords[j][1];
        console.log(longitude, latitude);
        bounds.minx = bounds.minx < longitude ? bounds.minx : longitude;
        bounds.maxx = bounds.maxx > longitude ? bounds.maxx : longitude;
        bounds.miny = bounds.miny < latitude ? bounds.miny : latitude;
        bounds.maxy = bounds.maxy > latitude ? bounds.maxy : latitude;
      }
    }

    return bounds;
  }

  function addFeatureShow(object2d) {
    const found = listData2dObject.value.find((obj) => obj.id == object2d.id);
    const index = listManageFeatureHighlight.value.indexOf(found);
    if (index > -1) return;
    if (found) {
      const geom = found.geom;
      const geomStringify = JSON.stringify(geom);
      const features = dataMapMain.map.data.addGeoJson(geomStringify);

      listFeatureHighlight.value.push(features);
      listManageFeatureHighlight.value.push(found);
    } else {
      errorToast("Lỗi, không thể phóng tới đối tượng đã chọn!");
    }
  }

  function removeFeatureShow(object2d) {
    const found = listData2dObject.value.find((obj) => obj.id == object2d.id);

    const index = listData2dObject.value.indexOf(found);
    if (index > -1) {
      const features = listFeatureHighlight.value[index];
      if (features !== undefined) {
        features.forEach((feature) => {
          dataMapMain.map.data.remove(feature);
        });
      }
      listFeatureHighlight.value.splice(index, 1);
      listManageFeatureHighlight.value.splice(index, 1);
    } else {
      errorToast("Không thể xóa đối tượng đã chọn!");
    }
  }

  function changeOpacityFeature(opacity, object2d) {
    const found = listData2dObject.value.find((obj) => obj.id == object2d.id);
    const index = listData2dObject.value.indexOf(found);
    //Đổi Opacity
    if (found) {
      const geom = found.geom;
      geom.features[0].properties = {
        // stroke: "#dc3545",
        "stroke-opacity": 1,
        // "stroke-width": 0,
        fill: "#ccc",
        "fill-opacity": opacity,
      };
      const geomStringify = JSON.stringify(geom);
      const features = dataMapMain.map.data.addGeoJson(geomStringify);

      listFeatureHighlight.value.push(features);
      listManageFeatureHighlight.value.push(found);
    } else {
      errorToast("Lỗi, không thể phóng tới đối tượng đã chọn!");
    }
    // Xoá feature
    if (index > -1) {
      const features = listFeatureHighlight.value[index];
      if (features !== undefined) {
        features.forEach((feature) => {
          dataMapMain.map.data.remove(feature);
        });
      }
      listFeatureHighlight.value.splice(index, 1);
      listManageFeatureHighlight.value.splice(index, 1);
      return;
    }
  }

  function loadDataFromLocalStorage() {
    const localStorageList = localStorage.getItem(localStorageName);
    const json_ = JSON.parse(localStorageList);
    if (json_ !== null) {
      listData2dObject.value = json_;
    }
  }

  function addObject2dToList(object2d) {
    const obj = { ...object2d, id: uuidv4() };
    listData2dObject.value.push(obj);
    saveDataToLocalStorage();
  }

  function saveDataToLocalStorage() {
    try {
      localStorage.setItem(
        localStorageName,
        JSON.stringify(listData2dObject.value)
      );
    } catch {
      errorToast("Dữ liệu quá lớn hoặc đã lưu quá nhiều object!");
    }
  }
  /**
   * [uploadStaticData Tải lên dữ liệu tĩnh để ]
   * @return None
   */
  async function uploadStaticData(formData, name) {
    const { data } = await apiRequest.post(urlUpload2d, formData);
    const status = data.status;

    if (status == "ok") {
      const jsonData = data.json;
      const bbox = getBoundingBox(jsonData);
      console.log(bbox);
      const obj = {
        name: name,
        geom: jsonData,
        is_active: false,
        bbox: bbox,
      };
      addObject2dToList(obj);
    } else {
      const msg = data.msg;
      errorToast(msg);
      return;
    }
  }
  return {
    listData2dObject,
    uploadStaticData,
    loadDataFromLocalStorage,

    addFeatureShow,
    zoomTo2dObject,
    removeFeatureShow,
    remove2dObject,
    changeOpacityFeature,
    getDetail,
    getPolygon
  };
});

export const useStaticData3d = defineStore("useStaticData3d", () => {
  const urlUpload3d = "/upload-3d-object";
  const localStorageName = "listData3dObject";

  const listData3dObject = ref([]);

  const listFeatureHighlight = ref([]);

  function isContainBuildingOption(obj) {
    if (obj.building.position.lat == 0 && obj.building.position.lng == 0)
      return false;
    else return true;
  }
  function zoomTo3dObject(obj) {
    if (isContainBuildingOption(obj)) {
      const bounds = [[obj.building.position.lng, obj.building.position.lat]];
      fitBounds(bounds, dataMapMain.map);
    }
  }

  function change3dObjectShow(
    obj,
    lat = null,
    lng = null,
    scale = null,
    bearing = null
  ) {
    // Nếu object đang được highlight thì sẽ chỉnh sửa thông số của building
    // Nếu đang không bật thì sẽ không làm gì cả
    const found = listFeatureHighlight.value.find(
      (object) => object.properties.name == obj.id
    );
    console.log(found);
    if (found !== undefined) {
      if (lat !== null) {
        const position = {
          lat: lat,
          lng: found.properties.location.lng,
        };
        found.setPosition(position);
      }
      if (lng !== null) {
        const position = {
          lat: found.properties.location.lat,
          lng: lng,
        };
        found.setPosition(position);
      }
      if (scale !== null) {
        found.setScale(scale);
      }
      if (bearing !== null) {
        found.setBearing(bearing);
      }
    }
    const objectFounded = listData3dObject.value.find(
      (object3d) => object3d.id == obj.id
    );
    if (lat !== null) {
      objectFounded.building.position.lat = parseFloat(lat.toFixed(6));
    }
    if (lng !== null) {
      objectFounded.building.position.lng = parseFloat(lng.toFixed(6));
    }
    if (scale !== null) {
      objectFounded.building.scale = parseFloat(scale.toFixed(2));
    }
    if (bearing !== null) {
      objectFounded.building.bearing = parseFloat(bearing.toFixed(2));
    }
  }

  function add3dObjectToShow(obj) {
    // Check object3d is exist
    const found = listFeatureHighlight.value.find(
      (object) => object.properties.name == obj.id
    );
    if (found !== undefined) return;

    let buildingOption = {};
    // Check nếu đã tồn tại từ lần show trước đo
    if (obj.building.position.lat == 0 && obj.building.position.lng == 0) {
      // Lấy thông camera hiện tại để làm tọa đổ của obj 3d
      const currentCamera = dataMapMain.map.getCamera().target;
      buildingOption = {
        name: obj.id,
        position: currentCamera,
        bearing: 0,
        scale: 1,
      };
    } else {
      buildingOption = obj.building;
    }

    // Cần chuyển sang chế độ 3d để người dùng có thể xem được đối tượng trên bản đồ
    methods_map.setMapType("map3d");

    let building = new map4d.Building({
      ...buildingOption,
      model: currentUrlServer + obj.obj,
      texture: currentUrlServer + obj.texture,
    });
    // Thêm building vào bản đồ
    building.setMap(dataMapMain.map);

    // Nổi bật đối tượng 3d vừa thêm
    // Cần thêm 1 bước ở trước là hủy nổi bật các đối tượng trước đo
    building.setSelected(true);

    // Thêm vào danh sách quản lý
    listFeatureHighlight.value.push(building);

    // Thêm lại danh sách localStorage
    const objectFounded = listData3dObject.value.find(
      (object3d) => object3d.id == obj.id
    );
    objectFounded.building = buildingOption;
    saveDataToLocalStorage();
  }

  function removeShow3dObject(obj) {
    let currentIndex = null;
    const objectFounded = listFeatureHighlight.value.find((object, index) => {
      if ((object) => object.properties.name == obj.id) {
        currentIndex = index;
        return object;
      }
    });

    if (objectFounded) {
      objectFounded.setMap(null);
      listFeatureHighlight.value.splice(currentIndex, 1);
    }
  }

  function remove3dObject(obj) {
    let currentObjIndex = null;
    const objectFounded = listData3dObject.value.find((object, index) => {
      if (obj.id == object.id) {
        currentObjIndex = index;
        return object;
      }
    });
    if (objectFounded !== undefined) {
      removeShow3dObject(obj);
      listData3dObject.value.splice(currentObjIndex, 1);
      saveDataToLocalStorage();
    }
  }

  function loadDataFromLocalStorage() {
    const localStorageList = localStorage.getItem(localStorageName);
    const json_ = JSON.parse(localStorageList);
    if (json_ !== null) {
      listData3dObject.value = json_;
    }
  }

  function addObjectToList(obj) {
    const _obj = { ...obj, id: uuidv4() };
    listData3dObject.value.push(_obj);
    saveDataToLocalStorage();
  }

  function saveDataToLocalStorage() {
    try {
      localStorage.setItem(
        localStorageName,
        JSON.stringify(listData3dObject.value)
      );
    } catch {
      errorToast("Dữ liệu quá lớn hoặc đã lưu quá nhiều object!");
    }
  }
  /**
   * [uploadStaticData Tải lên dữ liệu tĩnh để ]
   * @return None
   */
  async function uploadStaticData(formData, name) {
    const { data } = await apiRequest.post(urlUpload3d, formData);
    const status = data.status;

    if (status == "ok") {
      const obj = {
        name: name,
        texture: data.texture,
        obj: data.obj,
        is_active: false,
      };
      obj.building = {
        position: {
          lat: 0,
          lng: 0,
        },
        bearing: 0,
        scale: 1,
      };
      addObjectToList(obj);
    } else {
      const msg = data.msg;
      errorToast(msg);
      return;
    }
  }
  return {
    listData3dObject,
    uploadStaticData,
    loadDataFromLocalStorage,
    add3dObjectToShow,
    removeShow3dObject,
    remove3dObject,
    zoomTo3dObject,
    change3dObjectShow,
  };
});
