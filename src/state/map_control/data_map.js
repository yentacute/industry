import { reactive, toRefs, ref } from "vue";
import {
  mapFitBoundsLayerGeoJson,
  mapFitBoundsDirect,
  decodePolyline,
  keyMap,
  mapFitBoundsPoligon,
} from "../../common/map/function_map.js";
import useLocalStorage from "../../utils/useLocalStorage.js";
import API from "../../helpers/api/useAxios.js";
// import { listMui3VN2000 } from "../../components/map/feature/toolbar/setting/danh_sach_mui_chieu.js";
import { utm_axis, vn2000HN, crs_4326 } from "../../utils/wgs84vn2000.js";
import proj4 from "proj4";

const data = reactive({
  map: null,
  location: null,
  listLocations: [],
  building: {
    mapbuilding: null,
    newbuilding: null,
  },
  references: {
    marker: null,
    polyline: null,
    feature: null,
    overlay: null,
    polygon: null,
  },
  referencesList: {
    marker: [],
    polyline: [],
    feature: [],
    overlay: [],
    polygon: [],
  },
  baseMapOSM: {
    overlay: null,
  },
  baseMapGG: {
    overlay: null,
  },
  baseMapHC: {
    overlay: null,
  },
});

//osm overlay
var OPTIONOVERLAYOSM = {
  getUrl: function (x, y, zoom, is3dMode) {
    return `https://tile.openstreetmap.de/${zoom}/${x}/${y}.png`;
  },
  visible: true,
  zIndex: 1,
};
//osm Google Hybrid
var OPTIONGOOGLEHYBRID = {
  getUrl: function (x, y, z, is3dMode) {
    return `https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`;
  },
  visible: true,
  zIndex: 1,
};
const referenceLocalStorage = useLocalStorage.getItem("referenceLocation");
const heToaDo = ref(referenceLocalStorage?.name ?? "wgs84");
const dataHe84 = reactive({
  muiChieu: referenceLocalStorage?.muiChieu ?? 0,
});
const dataHe200 = reactive({
  loaiMuiChieu: referenceLocalStorage?.loaiMuiChieu ?? 6,
  muiChieu: referenceLocalStorage?.muiChieu ?? 64,
});

export { heToaDo, dataHe84, dataHe200 };

const methods_map = {
  initMap: function (el, map_options) {
    data.map = new map4d.Map(el, map_options);
    data.map.setWeather("live");
    data.map.addListener(
      "click",
      (args) => {
        data.location = args.location;
      },
      {
        location: true,
        mappoi: true,
        mapbuilding: true,
        marker: true,
        polygon: true,
        polyline: true,
        circle: true,
        poi: true,
        building: true,
        place: true,
      }
    );
    data.map.addListener(
      "rightClick",
      (args) => {
        data.location = args.location;
      },
      {}
    );
    // //chọn đối tượng 3D có sẵn từ map4D
    // data.map.addListener(
    //   "click",
    //   (args) => {
    //     data.building.mapbuilding = args.building;
    //     // data.building.setSelected(true)
    //     console.log(args);
    //   },
    //   { mapbuilding: true }
    // );
    // data.map.addListener(
    //   "click",
    //   (args) => {
    //     data.building.newbuilding = args.building;
    //     data.building.newbuilding.setSelected(true);
    //     // data.building.newbuilding.setDraggable(true);
    //   },
    //   { building: true }
    // );
  },
  setMapType: (mapTypeCurrent, srcImg = false) => {
    if (data.baseMapOSM.overlay) {
      data.baseMapOSM.overlay.setMap(null);
    }
    if (data.baseMapGG.overlay) {
      data.baseMapGG.overlay.setMap(null);
    }
    if (data.baseMapHC.overlay) {
      data.baseMapHC.overlay.setMap(null);
    }
    switch (mapTypeCurrent) {
      case "map3d":
        data.map.setMapType(map4d.MapType.map3d);
        if (!srcImg) break;
        srcImg.title = "3D";
        srcImg.src = require("@/assets/images/maptype/map3d.png");
        break;
      case "roadmap":
        data.map.setMapType(map4d.MapType.roadmap);
        if (!srcImg) break;
        srcImg.title = "roadmap";
        srcImg.src = require("@/assets/images/maptype/roadmap.png");
        break;
      case "raster":
        data.map.setMapType(map4d.MapType.raster);
        if (!srcImg) break;
        srcImg.title = "raster";
        srcImg.src = require("@/assets/images/maptype/raster.png");
        break;
      case "satellite":
        data.map.setMapType(map4d.MapType.satellite);
        if (!srcImg) break;
        srcImg.title = "Vệ tinh";
        srcImg.src = require("@/assets/images/maptype/satellite.png");
        break;
      case "osm":
        data.map.setMapType(map4d.MapType.roadmap);
        data.baseMapOSM.overlay = new map4d.TileOverlay(OPTIONOVERLAYOSM);
        data.baseMapOSM.overlay.setMap(data.map);
        if (!srcImg) break;
        srcImg.title = "OSM";
        srcImg.src = require("@/assets/images/maptype/osm.png");
        break;
      case "google":
        data.map.setMapType(map4d.MapType.roadmap);
        data.baseMapGG.overlay = new map4d.TileOverlay(OPTIONGOOGLEHYBRID);
        data.baseMapGG.overlay.setMap(data.map);
        if (!srcImg) break;
        srcImg.title = "google";
        srcImg.src = require("@/assets/images/maptype/google.png");
        break;
      case "bdhc":
        data.map.setMapType(map4d.MapType.roadmap);
        data.baseMapHC.overlay = methods_map.overlayTile(
          "ranh_gioi_viet_nam",
          "SIPM_TEST_BETA"
        );
        if (!srcImg) break;
        srcImg.title = "Bản đồ hành chính";
        srcImg.src = require("@/assets/images/maptype/bdhc.png");
        break;
      default:
      // code block
    }
  },
  changeMapType: function (mapTypeCurrent, srcImg = false) {
    if (data.baseMapOSM.overlay) {
      data.baseMapOSM.overlay.setMap(null);
    }
    if (data.baseMapGG.overlay) {
      data.baseMapGG.overlay.setMap(null);
    }
    if (data.baseMapHC.overlay) {
      data.baseMapHC.overlay.setMap(null);
    }
    switch (mapTypeCurrent) {
      case "map3d":
        data.map.setMapType(map4d.MapType.roadmap);
        mapTypeCurrent = "roadmap";
        if (!srcImg) break;
        srcImg.title = "roadmap";
        srcImg.src = require("@/assets/images/maptype/roadmap.png");
        break;
      case "roadmap":
        data.map.setMapType(map4d.MapType.raster);
        mapTypeCurrent = "raster";
        if (!srcImg) break;
        srcImg.title = "raster";
        srcImg.src = require("@/assets/images/maptype/raster.png");
        break;
      case "raster":
        data.map.setMapType(map4d.MapType.satellite);
        mapTypeCurrent = "satellite";
        if (!srcImg) break;
        srcImg.title = "Vệ tinh";
        srcImg.src = require("@/assets/images/maptype/satellite.png");
        break;
      case "satellite":
        data.map.setMapType(map4d.MapType.roadmap);
        data.baseMapOSM.overlay = new map4d.TileOverlay(OPTIONOVERLAYOSM);
        data.baseMapOSM.overlay.setMap(data.map);
        mapTypeCurrent = "osm";
        if (!srcImg) break;
        srcImg.title = "OSM";
        srcImg.src = require("@/assets/images/maptype/osm.png");
        break;
      case "osm":
        data.map.setMapType(map4d.MapType.roadmap);
        data.baseMapGG.overlay = new map4d.TileOverlay(OPTIONGOOGLEHYBRID);
        data.baseMapGG.overlay.setMap(data.map);
        mapTypeCurrent = "google";
        if (!srcImg) break;
        srcImg.title = "Ranh giới";
        srcImg.src = require("@/assets/images/maptype/google.png");
        break;
      case "google":
        data.map.setMapType(map4d.MapType.roadmap);
        data.baseMapHC.overlay = this.overlayTile(
          "ranh_gioi_viet_nam",
          "SIPM_TEST_BETA"
        );
        mapTypeCurrent = "bdhc";
        if (!srcImg) break;
        srcImg.title = "Bản đồ hành chính";
        srcImg.src = require("@/assets/images/maptype/bdhc.png");
        break;
      case "bdhc":
        data.map.setMapType(map4d.MapType.map3d);
        mapTypeCurrent = "map3d";
        if (!srcImg) break;
        srcImg.title = "3D";
        srcImg.src = require("@/assets/images/maptype/map3d.png");
        break;
      default:
      // code block
    }
    return mapTypeCurrent;
  },
  MannyMakerMap: function (
    arr_location,
    img,
    title = undefined,
    deleteMakerOld = true
  ) {
    if (!arr_location.length) return;
    if (deleteMakerOld) {
      // xoá hết marker cũ
      data.referencesList.marker.forEach((marker) => {
        marker.setMap(null);
      });
      // xét lại mảng ghi nhớ marker
      data.referencesList.marker = [];
      if (data.references.marker) {
        data.references.marker.setMap(null);
        data.references.marker = null;
      }
    }
    arr_location.forEach((args) => {
      this.MarkerMap(
        args,
        false,
        title,
        `<img src="${img}" style=\"width: 20px; height: 20px; background-color: transparent;\"/>`,
        false
      );
    });
  },
  MarkersOderByIndex: function (
    arr_location,
    title = undefined,
    deleteMakerOld = true
  ) {
    if (!arr_location.length) return;
    if (deleteMakerOld) {
      // xoá hết marker cũ
      data.referencesList.marker.forEach((marker) => {
        marker.setMap(null);
      });
      // xét lại mảng ghi nhớ marker
      data.referencesList.marker = [];
      if (data.references.marker) {
        data.references.marker.setMap(null);
        data.references.marker = null;
      }
    }
    arr_location.forEach((args, indexI) => {
      this.MarkerMap(
        args,
        false,
        title,
        `<div class="d-flex justify-content-center align-content-center fw-bold text-bg-danger" style=\"width: 20px; height: 20px; border-radius: 50%; border: 1px soild #000\">${
          indexI + 1
        }</div>`,
        false
      );
    });
  },
  MarkerMap: function (
    args,
    panTo = false,
    title = undefined,
    iconView = undefined,
    deleteMakerOld = true
  ) {
    if (deleteMakerOld) {
      if (data.references.marker !== null) {
        data.references.marker.setMap(null);
      }
    }
    let options = {
      position: args,
    };
    if (title) {
      options = { ...options, title: title };
    }
    if (iconView) {
      options = { ...options, iconView: iconView, anchor: [0.5, 0.5] };
    }
    data.references.marker = new map4d.Marker(options);
    data.referencesList.marker.push(data.references.marker);
    data.references.marker.setMap(data.map);
    if (panTo) data.map.panTo(args);
    return data.references.marker;
  },
  SetDateMap: function (year) {
    data.map.setDate(year);
  },
  creatGeoJson: function (geoJsonStr, fit_bounds = false, type = "Polygon") {
    if (!geoJsonStr) return;
    if (data.references.feature) {
      data.references.feature = null;
    }
    data.referencesList.feature.push(data.map.data.addGeoJson(geoJsonStr));
    if (!fit_bounds) return;
    switch (type) {
      case "MultiPolygon": {
        mapFitBoundsLayerGeoJson(JSON.parse(geoJsonStr), data.map, type);
        break;
      }
      default:
        mapFitBoundsLayerGeoJson(JSON.parse(geoJsonStr), data.map);
    }
  },
  deleteAllDrawingOnMap: function () {
    // xoá hết marker cũ
    data.referencesList.marker.forEach((marker) => {
      marker.setMap(null);
    });
    data.referencesList.polyline.forEach((polyline) => {
      polyline.setMap(null);
    });
    data.referencesList.polygon.forEach((polygon) => {
      polygon.setMap(null);
    });
    // xét lại mảng ghi nhớ marker
    data.referencesList.marker = [];
    data.referencesList.polyline = [];
    data.referencesList.polygon = [];
    if (data.references.polyline) {
      data.references.polyline.setMap(null);
      data.references.polyline = null;
    }
    if (data.references.marker) {
      data.references.marker.setMap(null);
      data.references.marker = null;
    }
    // Xóa tất cả features khỏi data layer
    data.referencesList.feature.forEach((feature) => {
      feature.forEach((item) => {
        data.map.data.remove(item);
      });
    });
    data.referencesList.feature = [];
  },
  creatNewBuildingMap: function (name, model, texture, scale, bearing) {
    const options = {
      name: name,
      position: data.map.getCamera().target,
      model: model,
      texture: texture,
    };
    if (scale) {
      options.scale = scale;
    }
    if (bearing) {
      options.bearing = bearing;
    }
    // Tạo đối tượng Building là một cây cầu từ BuildingOptions với model và texture
    let building = new map4d.Building(options);
    // Thêm building vào bản đồ
    building.setMap(data.map);
    return building;
  },
  create_polyline: function (
    strokeColor = "#0377fc",
    style = "solid",
    path = [...data.listLocations],
    visible = !0,
    strokeWidth = 5,
    strokeOpacity = 1,
    closed = !1
  ) {
    if (data.references.polyline) {
      data.references.polyline.setMap(null);
    }
    data.references.polyline = new map4d.Polyline({
      path: path,
      visible: visible,
      strokeColor: strokeColor,
      strokeWidth: strokeWidth,
      strokeOpacity: strokeOpacity,
      closed: closed,
      style: style,
    });
    data.references.polyline.setMap(data.map);
    data.referencesList.polyline.push(data.references.polyline);
    return data.references.polyline;
  },
  create_polygon: function (path, panTo = false) {
    path = [...path, path[0]];
    if (data.references.polygon) {
      data.references.polygon.setMap(null);
    }
    data.references.polygon = new map4d.Polygon({
      fillOpacity: 0.1,
      userInteractionEnabled: true,
      paths: [path],
    });
    data.references.polygon.setMap(data.map);
    data.referencesList.polygon.push(data.references.polygon);
    if (panTo) {
      mapFitBoundsPoligon(path, data.map);
    }
    return data.references.polygon;
  },
  SetNullMarker: async function () {
    // xét lại mảng ghi nhớ marker
    if (data.references.marker) {
      await data.references.marker.setMap(null);
      data.references.marker = null;
    }
    if (data.referencesList.marker.length) {
      data.referencesList.marker.forEach(async (marker) => {
        await marker.setMap(null);
      });
    }
    data.referencesList.marker = [];
  },
  SetNullPolyline: async function () {
    // xét lại mảng ghi nhớ polyline
    if (data.references.polyline) {
      await data.references.polyline.setMap(null);
      data.references.polyline = null;
    }
    if (data.referencesList.polyline.length) {
      for (let polyline of data.referencesList.polyline) {
        await polyline.setMap(null);
      }
      data.referencesList.polyline = [];
    }
  },
  Directing: async function (listPoints, mode = "car", weighting = 0) {
    await methods_map.SetNullMarker();
    await methods_map.SetNullPolyline();
    data.listLocations = [];
    if (listPoints.length < 2) return;
    const CHECKPOINTED =
      !listPoints[0]?.lat ||
      !listPoints[0]?.lng ||
      !listPoints[1]?.lat ||
      !listPoints[1]?.lng;
    if (CHECKPOINTED) return;
    const origin = [listPoints[0].lat, listPoints[0].lng];
    const destination = [
      listPoints[listPoints.length - 1].lat,
      listPoints[listPoints.length - 1].lng,
    ];
    let points = [];
    if (listPoints.length > 2) {
      for (let i = 1; i < listPoints.length - 1; i++) {
        if (i === 1) {
          points = listPoints[i].lat + "," + listPoints[i].lng;
        } else {
          points = points + ";" + listPoints[i].lat + "," + listPoints[i].lng;
        }
      }
    }
    let _key = keyMap;
    let _origin = origin;
    let _destination = destination;
    let language = "vi";
    let _weighting = weighting;
    let avoid = "";
    let avoidRoad = "";
    let _mode = mode === "disabilities" ? "foot" : mode;
    let distance;
    let duration;
    let directDetails = [];
    let url =
      "https://api.map4d.vn/sdk/route?key=" +
      _key +
      "&origin=" +
      _origin +
      "&destination=" +
      _destination +
      "&points=" +
      points +
      "&mode=" +
      _mode +
      "&language=" +
      language +
      "&weighting=" +
      _weighting +
      "&avoid=" +
      avoid +
      `&avoidRoad=` +
      avoidRoad;

    const { references, referencesList } = toRefs(data);
    await API()
      .call(url)
      .then((reponsive) => {
        if (reponsive) {
          distance = reponsive.result.routes[0].distance.text;
          duration = reponsive.result.routes[0].duration.text;
          if (!reponsive.result.routes[0].legs.length) return;
          for (let steps of reponsive.result.routes[0].legs) {
            steps = steps.steps;
            for (let i = 0; i < steps.length; i++) {
              directDetails = [
                ...directDetails,
                {
                  type: steps[i].maneuver,
                  name: steps[i].htmlInstructions,
                  met: steps[i].distance.text,
                },
              ];
              let line = steps[i].polyline;
              let arrs_step = decodePolyline(line);
              arrs_step.forEach((element) => {
                let tmp = element[0];
                element[0] = element[1];
                element[1] = tmp;
                data.listLocations.push(element);
              });
            }
          }
          // * Foot mode needs to be show dotted style inserted of line style
          if (mode === "foot")
            references.value.polyline = this.create_polyline(
              "#0377fc",
              "dotted"
            );
          else if (mode === "car") {
            references.value.polyline = this.create_polyline(
              "#0377fc",
              "solid"
            );
          } else if (mode === "bike") {
            references.value.polyline = this.create_polyline(
              "#D2691E",
              "solid"
            );
          } else if (mode === "motorcycle") {
            references.value.polyline = this.create_polyline(
              "#00008B",
              "solid"
            );
          }
          referencesList.value.polyline = [
            ...referencesList.value.polyline,
            references.value.polyline,
          ];
          let list_dot_polyline = [
            [[listPoints[0].lng, listPoints[0].lat], data.listLocations[0]],
            [
              data.listLocations[data.listLocations.length - 1],
              [
                listPoints[listPoints.length - 1].lng,
                listPoints[listPoints.length - 1].lat,
              ],
            ],
          ];
          references.value.polyline = this.create_polyline(
            "#aaa",
            "dotted",
            list_dot_polyline[0]
          );
          referencesList.value.polyline = [
            ...referencesList.value.polyline,
            references.value.polyline,
          ];
          references.value.polyline = this.create_polyline(
            "#aaa",
            "dotted",
            list_dot_polyline[1]
          );
          referencesList.value.polyline = [
            ...referencesList.value.polyline,
            references.value.polyline,
          ];
          // Tạo đối tượng marker từ MarkerOption
          this.MarkerMap(
            listPoints[listPoints.length - 1],
            false,
            `Địa điểm kết thúc`,
            undefined,
            false
          );
          this.MarkerMap(
            listPoints[0],
            false,
            `Địa điểm bắt đầu`,
            `<img src="https://map.map4d.vn/mapAppRoot/icon/directionsIcon/from.svg" style=\"width: 16px; height: 16px; background-color: transparent;\"/>`,
            false
          );
          references.value.marker.setMap(data.map);
          // Thêm polyline vào bản đồ
          referencesList.value.polyline.forEach((polyline) => {
            polyline.setMap(data.map);
          });
          mapFitBoundsDirect(data.listLocations, data.map);
        }
      });
    return { long: distance, time: duration, details: directDetails };
  },
  getUrlTileMap: function (
    layerName,
    workspaceName,
    wmsUrl = "https://mapservice.gishub.vn/geoserver/wms",
    opacity = null,
    polygonFilterCql = null,
    boundaryFilter = null
  ) {
    let currentOpacity = 1;
    let currentFilterCql = "";
    if (opacity != null) {
      currentOpacity = opacity;
    }

    if (polygonFilterCql != null) {
      currentFilterCql = `&CQL_FILTER=${polygonFilterCql}`;
    }
    return {
      getUrl: function (x, y, zoom) {
        let projection = new map4d.Projection(data.map);
        let zfactor = Math.pow(2, zoom);

        let top_x = (x * 256) / zfactor;
        let top_y = (y * 256) / zfactor;

        let bot_x = ((x + 1) * 256) / zfactor;
        let bot_y = ((y + 1) * 256) / zfactor;

        let map4d_top_poi = new map4d.Point(top_x, top_y);
        let map4d_bot_poi = new map4d.Point(bot_x, bot_y);
        let latLngCoordinateTop = projection.fromPointToLatLng(map4d_top_poi);
        let latLngCoordinateBot = projection.fromPointToLatLng(map4d_bot_poi);

        let deltaX = 0;
        let deltaY = 0;

        let bbox =
          latLngCoordinateTop.lng +
          deltaX +
          "," +
          (latLngCoordinateBot.lat + deltaY) +
          "," +
          (latLngCoordinateBot.lng + deltaX) +
          "," +
          (latLngCoordinateTop.lat + deltaY);

        let url = `${wmsUrl}?`;
        url += "&REQUEST=GetMap";
        url += "&SERVICE=WMS";
        url += "&VERSION=1.1.0";
        url += "&LAYERS=" + `${workspaceName}:${layerName}`;
        url += "&FORMAT=image/png";
        url += "&BGCOLOR=0xFFFFFF";
        url += "&TRANSPARENT=TRUE";
        url += "&ENV=color:e6704c;name:circle;size:4;opacity:0";
        url += "&OUTLINE=false";
        url += "&SRS=EPSG:4326";
        url += "&BBOX=" + bbox;
        url += "&WIDTH=256";
        url += "&HEIGHT=256";
        url += currentFilterCql;

        if (boundaryFilter != null) {
          url = `${wmsUrl}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES=db_sipm_2023:mautrang,&LAYERS=${boundaryFilter.wmsInfo.workspace}:${boundaryFilter.wmsInfo.layer},${workspaceName}:${layerName}&exceptions=application%2Fvnd.ogc.se_inimage&CQL_FILTER=INCLUDE;INTERSECTS(geom, querySingle('${boundaryFilter.wmsInfo.workspace}:${boundaryFilter.wmsInfo.layer}', 'geom','IN(''${boundaryFilter.wmsInfo.layer}.${boundaryFilter.value}'')'))&SRS=EPSG%3A4326&WIDTH=256&HEIGHT=256&BBOX=${bbox}`;
        }

        return url;
      },
      visible: true,
      zIndex: 1,
      opacity: currentOpacity,
    };
  },
  overlayTile: function (
    layerName,
    workspaceName,
    wmsUrl,
    map = data.map,
    opacity = null,
    polygonFilterCql = null,
    boundaryFilter = null
  ) {
    let tile_layer = this.getUrlTileMap(
      layerName,
      workspaceName,
      wmsUrl,
      opacity,
      polygonFilterCql,
      boundaryFilter
    );
    data.references.overlay = new map4d.TileOverlay(tile_layer);
    data.references.overlay.setMap(map);
    return data.references.overlay;
  },
  handleChangeHeToaDo: async () => {
    let camera_in_url;
    let camera = data.map.getCamera();
    let lat = parseFloat(camera.target.lat).toFixed(6);
    let lng = parseFloat(camera.target.lng).toFixed(6);
    let zoom = parseFloat(camera.zoom).toFixed(2);
    let tilt = parseFloat(camera.tilt).toFixed(2);
    let bearing = parseFloat(camera.bearing).toFixed(2);
    let maptype = data.map.getMapType();
    if (!lat || !zoom || !tilt || !bearing || !lng) return;
    switch (heToaDo.value) {
      case "wgs84":
        if (dataHe84.muiChieu == 0) {
          camera_in_url = `${lat},${lng},${zoom},${tilt},${bearing},${maptype}`;
          break;
        }
        var wgs84_location = proj4(crs_4326, utm_axis(dataHe84.muiChieu), [
          camera.target.lng,
          camera.target.lat,
        ]);
        camera_in_url = `${wgs84_location[1]},${wgs84_location[0]},${zoom},${tilt},${bearing},${maptype}`;
        break;
      case "vn2000":
        var vn2000_location = proj4(
          crs_4326,
          vn2000HN(dataHe200.muiChieu, dataHe200.loaiMuiChieu),
          [camera?.target?.lng, camera?.target?.lat]
        );
        camera_in_url = `${vn2000_location[1]},${vn2000_location[0]},${zoom},${tilt},${bearing},${maptype}`;
        break;
      default:
    }
    return camera_in_url;
  },
};

export { data, methods_map };
