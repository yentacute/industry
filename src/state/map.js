import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { TextSearchAPIMap4D, keyMap } from "../common/map/function_map";
import {
  getGeomBounds,
  getMap4dDraw,
  getRectangleCoordinates,
} from "../utils/gisFunctionState";
import { fitBounds } from "../common/map/function_map";
import { debounce } from "lodash";
import { useFolderStore } from "./folder";

export const useMapStore = defineStore("map-store", () => {
  const geomType = ref("");
  const formData = ref(null);
  const listMarker = reactive({
    coordinates: [],
    type: "",
  });
  const clickCount = ref(0);

  const polyMarker = ref([]);
  const draw = reactive({
    rectangle: [],
  });
  const inputData = ref("");
  const geomData = ref(null);
  const map2D = ref(null);
  const map3D = ref(null);
  const mapEditForm = ref(null);
  const mapDetail = ref(null);
  const mapReset = ref(null);
  let mapInitial = ref([]);
  const firstPoint = ref([]);
  const currentPoint = ref([]);
  const lat = ref(null);
  const lng = ref(null);
  const objData = ref("");
  const objName = ref("");
  const objPosition = ref({});
  const objTexture = ref("");
  const objBearing = ref(1);
  const objScale = ref(1);
  const mapAddForm = ref(null);
  const editFormMap = ref(null);
  const mapContain = ref(null);
  const folderStore = useFolderStore();
  const modalEditForm = ref(false);
  const modalAddForm = ref(false);
  const mapEditInit = ref([]);

  function toPascalCase(str) {
    // Split the string into an array of words
    const words = str.split(/\s+/);

    // Capitalize the first letter of each word and combine them into a single word
    const pascalCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    return pascalCase;
  }
  //2d map
  function initMap(el, options) {
    mapAddForm.value = new map4d.Map(document.querySelector(el), options);
    mapAddForm.value.addListener(
      "click",
      (args) => {
        draw2D.location = args.location;
        const lat = args.location.lat;
        const lng = args.location.lng;
        currentPoint.value = [lng, lat];
        // if (geomType.value === "polygon" || geomType.value === "geometry") {
        //   if (clickCount.value === 0) {
        //     // Set the first and last items of the array to the lat and lng values
        //     console.log(firstPoint.value);
        //     firstPoint.value = currentPoint.value;
        //     for (let i = 0; i < 2; i++) {
        //       polyMarker.value.push(currentPoint.value);
        //     }
        //   } else {
        //     polyMarker.value.pop();
        //     polyMarker.value.push(currentPoint.value);
        //     polyMarker.value.push(firstPoint.value);
        //   }
        //   clickCount.value++;
        //   let polygon = new map4d.Polygon({
        //     paths: [polyMarker.value],
        //     fillOpacity: 1,
        //     userInteractionEnabled: true,
        //   });
        //   // Thêm polyline vào bản đồ
        //   polygon.setMap(mapAddForm.value);
        //   mapInitial.value.push(polygon);
        // }
      },
      { location, polygon: true, marker: true, polyline: true }
    );
  }

  const draw2D = reactive({
    location: null,
    circle: null,
    polyline: null,
    marker: null,
    polygon: null,
  });

  const DeleteDraw = () => {
    if (draw2D.circle) {
      draw2D.circle.setMap(null);
    }
    if (draw2D.polyline) {
      draw2D.polyline.setMap(null);
    }
    if (draw2D.marker) {
      draw2D.marker.setMap(null);
    }
    if (draw2D.polygon) {
      draw2D.polygon.setMap(null);
    }
  };

  const handleDrawMap2dManageData = (typeProps) => {
    DeleteDraw();
    const lat = draw2D.location.lat;
    const lng = draw2D.location.lng;
    console.log(currentPoint.value);
    switch (typeProps) {
      case "circle":
        draw2D.circle = new map4d.Circle({
          center: { lat: lat, lng: lng },
          fillColor: "#ccc",
          radius: 100,
          strokeWidth: 2.0,
          strokeColor: "#ff0000",
        });
        draw2D.circle.setMap(mapAddForm.value);
        break;
      case "linestring":
        listMarker.coordinates = [...listMarker.coordinates, [lng, lat]];
        draw2D.polyline = new map4d.Polyline({
          path: listMarker.coordinates,
          strokeColor: "#ff0000",
          strokeOpacity: 1.0,
          strokeWidth: 5,
        });
        // Thêm polyline vào bản đồ
        draw2D.polyline.setMap(mapAddForm.value);
        mapInitial.value.push(draw2D.polyline);
        break;
      case "point":
        listMarker.coordinates.push(lat, lng);
        draw2D.marker = new map4d.Marker({
          position: { lat, lng },
        });
        draw2D.marker.setMap(mapAddForm.value);
        mapInitial.value.push(draw2D.marker);
        break;
      case "polygon":
        if (clickCount.value === 0) {
          // Set the first and last items of the array to the lat and lng values
          console.log(firstPoint.value);
          firstPoint.value = currentPoint.value;
          for (let i = 0; i < 2; i++) {
            polyMarker.value.push(currentPoint.value);
          }
        } else {
          polyMarker.value.pop();
          polyMarker.value.push(currentPoint.value);
          polyMarker.value.push(firstPoint.value);
        }
        clickCount.value++;
        draw2D.polygon = new map4d.Polygon({
          paths: [polyMarker.value],
          fillOpacity: 1,
          userInteractionEnabled: true,
        });
        // Thêm polyline vào bản đồ
        draw2D.polygon.setMap(mapAddForm.value);
        mapInitial.value.push(draw2D.polygon);
        break;
      case "rectangle":
        if (draw.rectangle.length > 2) {
          draw.rectangle = [];
        }
        draw.rectangle = [
          ...draw.rectangle,
          [draw2D.location.lat, draw2D.location.lng],
        ];
        if (draw.rectangle.length !== 2) return;
        var TEMPARR = getRectangleCoordinates(draw.rectangle);
        draw2D.polygon = new map4d.Polygon({
          paths: [TEMPARR],
          fillOpacity: 1,
          userInteractionEnabled: true,
        });
        // Thêm polyline vào bản đồ
        draw2D.polygon.setMap(mapAddForm.value);
        break;
      default:
    }
  };

  //2d map
  function mapEdit(el, options) {
    editFormMap.value = new map4d.Map(document.querySelector(el), options);
    editFormMap.value.addListener(
      "click",
      (args) => {
        const lat = args.location.lat;
        const lng = args.location.lng;
        currentPoint.value = [lng, lat];
        if (geomType.value === "polygon" || geomType.value === "geometry") {
          if (clickCount.value === 0) {
            // Set the first and last items of the array to the lat and lng values
            console.log(firstPoint.value);
            firstPoint.value = currentPoint.value;
            for (let i = 0; i < 2; i++) {
              polyMarker.value.push(currentPoint.value);
            }
          } else {
            polyMarker.value.pop();
            polyMarker.value.push(currentPoint.value);
            polyMarker.value.push(firstPoint.value);
          }
          clickCount.value++;
          let polygon = new map4d.Polygon({
            paths: [polyMarker.value],
            fillOpacity: 1,
            userInteractionEnabled: true,
          });
          // Thêm polyline vào bản đồ
          polygon.setMap(editFormMap.value);
          mapEditInit.value.push(polygon);
        }

        if (geomType.value === "point") {
          // console.log(lat.value, lng.value);
          // const dataGeo = {lat.value, lng.value}

          listMarker.coordinates.push(lat, lng);
          let marker = new map4d.Marker({
            position: { lat, lng },
          });
          marker.setMap(editFormMap.value);
          mapEditInit.value.push(marker);
        }

        if (geomType.value === "linestring") {
          listMarker.coordinates.push([lng, lat]);
          let polyline = new map4d.Polyline({
            path: listMarker.coordinates,
            strokeColor: "#ff0000",
            strokeOpacity: 1.0,
            strokeWidth: 5,
          });
          // Thêm polyline vào bản đồ
          polyline.setMap(editFormMap.value);
          mapEditInit.value.push(polyline);
        }
      },
      { location, polygon: true, marker: true, polyline: true }
    );
  }

  const syncGeom = (typeProps) => {
    switch (typeProps) {
      case "circle":
        break;
      case "linestring":
        listMarker.type = toPascalCase(typeProps);
        inputData.value = JSON.stringify(listMarker);
        geomData.value = listMarker;
        break;
      case "point":
        listMarker.type = toPascalCase(typeProps);
        inputData.value = JSON.stringify(listMarker);
        geomData.value = listMarker;
        break;
      case "polygon":
        listMarker.coordinates.push(polyMarker.value);
        listMarker.type = toPascalCase(typeProps);
        inputData.value = JSON.stringify(listMarker);
        geomData.value = listMarker;
        break;
      case "rectangle":
        listMarker.coordinates.push(getRectangleCoordinates(draw.rectangle));
        listMarker.type = toPascalCase("Polygon");
        inputData.value = JSON.stringify(listMarker);
        geomData.value = listMarker;
        break;
      default:
    }
  };

  const resetMap = (mapInit) => {
    DeleteDraw();
    listMarker.coordinates = []
    mapInit.forEach((item) => {
      item.setMap(null);
      polyMarker.value = [];
      listMarker.coordinates = [];
      listMarker.type = "";
      geomData.value = null;
      inputData.value = "";
      currentPoint.value = [];
      clickCount.value = 0;
    });
  };

  // function initMap3D(el) {
  //     let options = {
  //         center: { lat: 20.570441, lng: 106.584742 },
  //         zoom: 18,
  //         tilt: 50,
  //         bearing: 250,
  //         controls: false,
  //         mapType: 'map3d'
  //     }
  //     map3D.value = new map4d.Map(document.querySelector(el), options);
  //     // Tạo đối tượng Building là một cây cầu từ BuildingOptions với model và texture
  //     let building = new map4d.Building({
  //         name: objName.value,
  //         position:{ lat: 20.570441, lng: 106.584742 },
  //         model: objData.value,
  //         texture:objTexture.value,
  //     })

  //     // Cần thêm 1 bước ở trước là hủy nổi bật các đối tượng trước đo
  //     building.setSelected(true)
  //     // Thêm building vào bản đồ
  //     building.setMap(map3D.value)
  // }

  function initMap3D(el, options) {
    map3D.value = new map4d.Map(document.querySelector(el), options);
  }

  function initDataMap(el, options) {
    mapDetail.value = new map4d.Map(document.querySelector(el), options);
  }

  const drawMap = (type, coordinates, containMap, mapName) => {
    if (containMap !== null) containMap.setMap(null);

    if (type.toLowerCase() === "point") {
      const lat = coordinates[0];
      const lng = coordinates[1];
      containMap = getMap4dDraw(type, { lat, lng });
      const bounds = getGeomBounds(type, [lat, lng]);
      setTimeout(function () {
        fitBounds(bounds, mapName);
      }, 200);
    } else {
      containMap = getMap4dDraw(type, coordinates);
      const bounds = getGeomBounds(type, coordinates);

      setTimeout(function () {
        fitBounds(bounds, mapName);
      }, 200);
    }

    containMap.setMap(mapName);
  };

  const createNewMap = () => {
    resetMap();
  };
  return {
    handleDrawMap2dManageData,
    initMap,
    syncGeom,
    inputData,
    geomData,
    geomType,
    listMarker,
    formData,
    polyMarker,
    mapInitial,
    resetMap,
    initMap3D,
    objName,
    objData,
    objTexture,
    objBearing,
    objScale,
    objPosition,
    initDataMap,
    mapDetail,
    mapAddForm,
    drawMap,
    mapEditForm,
    mapContain,
    createNewMap,
    modalEditForm,
    modalAddForm,
    mapEdit,
    editFormMap,
    mapEditInit,
    DeleteDraw
  };
});
