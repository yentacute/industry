import { v4 as uuidv4 } from "uuid";
import { defineStore } from "pinia";
import { ref } from "vue";
import apiRequest from "../../helpers/api/folderApi";
import { debounce } from "lodash";
import { methods_map, data as dataMapMain } from "./data_map.js";
import { fitBounds } from "../../common/map/function_map.js";
import {
  isValidWmsBbox,
  getfilterWmsFromGeom,
} from "../../utils/gisFunctionState";
import {
  getGeomHighlight,
  getMap4dDraw,
  getGeomBounds,
} from "../../utils/gisFunctionState";

let kcnName = `kcn-song-cong-2`;
let projectModelName = `duan`;
const wmsUrl = "https://mapservice.gishub.vn/geoserver/wms";

export const usePublicLayerStore = defineStore("publicLayers", () => {
  const filterDataStore = useFilterDataStore();

  const modalShowType = ref(0);

  const isMining = ref(false);

  // Search | Filter data
  const searchField = ref("");
  const searchValue = ref("");
  const isDateFieldSearch = ref(false);
  // Các thông tin highlight
  const hightlightLayers = ref([]);
  const handleHighlightMapLayers = ref([]);
  const highlightBounds = ref([]);
  const isShowHighlightPannel = ref(false);

  const isGetMethod = ref(true);

  // Danh sách layers và đối tượng layer hiện tại được chọn để xem bảng dữ liệu
  const groupLayers = ref([]);
  const selectedLayer = ref(null);

  // Layer info
  const tableStructor = ref([]);
  const tableData = ref([]);
  const nameDisplay = ref(``);
  const apiDatabase = ref("");
  const wmsInfo = ref({});
  const queryFilterStr = ref("");

  /**
   * Paginator Các biến hỗ trợ phân trang dữ liệu
   *  */
  const currentPage = ref(0);
  const nextPage = ref(0);
  const prevPage = ref(0);
  const totalObject = ref(0);
  const totalPages = ref(0);

  const getBoundaryDetail = async (boundaryName, boundaryId) => {
    const { data } = await apiRequest.get(`/${boundaryName}/${boundaryId}`);
    return data;
  };

  const isSearchingOnDateField = (fieldName) => {
    const foundedField = tableStructor.value.find(
      (field) => field.name === fieldName
    );
    return foundedField.data_type == "date" ? true : false;
  };

  /**
   * [searchDataPublic Tìm kiếm dữ trong bảng dữ liệu]
   * @return None
   */
  const searchDataPublic = debounce(async function () {
    // handle search field is date
    if (isSearchingOnDateField(searchField.value))
      isDateFieldSearch.value = true;
    else isDateFieldSearch.value = false;
    if (searchField.value !== "" || searchField.value !== "undefined") {
      queryFilterStr.value = `?${searchField.value.toLowerCase()}=${searchValue.value
        }`;
      getLayerDataModel(null, apiDatabase.value + queryFilterStr.value);
    }
  }, 500);

  const filterDataPublicByGeom = debounce(async function (geom) {
    const data = geom;
    getLayerDataModel(null, null, true, data);
  });

  /**
   * [filterDataPublic Lọc dữ liệu trong bảng theo ranh giới]
   * @return None
   */
  const filterDataPublicByBoundary = debounce(async function (queryStr) {
    queryFilterStr.value = queryStr;
    getLayerDataModel(null, apiDatabase.value + queryFilterStr.value);
  }, 500);

  const getAllProvince = async () => {
    const { data } = await apiRequest.get(`/Province/?per_page=9999`);
    return data;
  };

  const getDistrictByProvinceId = async (provinceId) => {
    const { data } = await apiRequest.get(
      `/District/?matinh=${provinceId}&per_page=9999`
    );
    return data;
  };

  const getCommuneByDistrictId = async (disctrictId) => {
    const { data } = await apiRequest.get(
      `/Commune/?mahuyen=${disctrictId}&per_page=9999`
    );
    return data;
  };

  /**
   * [zoomToHighlightLayer Phóng tới 1 đối tượng đang xem highlight chỉ định]
   * @return None
   */
  function zoomToHighlightLayer(layer) {
    const zoomBounds = getGeomBounds(layer.geom.type, layer.geom.coordinates);
    fitBounds(zoomBounds, dataMapMain.map);
  }

  /**
   * [addLayerHighlight Thêm đối tượng vào danh sách highlight]
   * Khi người dùng checked
   * @return None
   */
  function addLayerHighlight(layer) {
    const index = hightlightLayers.value.indexOf(layer);
    if (index === -1) hightlightLayers.value.push(layer);
  }

  /**
   * [removeLayerHightlight Xóa bỏ đối tượng trong danh sách người dùng chọn để highlight]
   * Khi người dùng uncheck
   * @return None
   */
  function removeLayerHightlight(layer) {
    const index = hightlightLayers.value.indexOf(layer);
    if (index > -1) {
      hightlightLayers.value.splice(index, 1);
    }
  }

  /**
   * [hightlightLayersOnMap hiện các đối tượng người dùng cần nổi bật lên bản đồ]
   * @return None
   */
  function hightlightLayersOnMap() {
    hightlightLayers.value.forEach((layer) => {
      const geom = getGeomHighlight(layer.geom.type, layer.geom.coordinates);
      const map4dDraw = getMap4dDraw(geom.type, geom.geom);
      const bounds = getGeomBounds(layer.geom.type, layer.geom.coordinates);

      // Ở đây concat giữa mảng các dữ liệu bounds đã tồn tại trong mảng và bounds mới
      // Tuy nhiên sử dụng: Spread operator
      if (layer.geom.type.toLowerCase() == "point") {
        highlightBounds.value = [...highlightBounds.value, bounds];
      } else {
        highlightBounds.value = [...highlightBounds.value, ...bounds];
      }
      handleHighlightMapLayers.value.push(map4dDraw);

      map4dDraw.setMap(dataMapMain.map);
    });
    if (typeof highlightBounds.value[0] === typeof 102.33314) {
      fitBounds([highlightBounds.value], dataMapMain.map);
    } else {
      if (highlightBounds.value.length) {
        fitBounds(highlightBounds.value, dataMapMain.map);
      }
    }

    // Hiển thị bảng điều khiển của highlight
    isShowHighlightPannel.value = true;
  }

  function removeOlderHighlight() {
    handleHighlightMapLayers.value.forEach((layerMap) => {
      layerMap.setMap(null);
    });
    handleHighlightMapLayers.value = [];
  }

  /**
   * [destroyhighlightLayersOnMap Xóa bỏ hết thông tin nổi bật đối tượng trên bản đồ]
   * @return None
   */
  function destroyhighlightLayersOnMap() {
    handleHighlightMapLayers.value.forEach((layerMap) => {
      layerMap.setMap(null);
    });

    // // Uncheck all el checkbox
    // listElCheckedHighlight.value.forEach(el => {
    //     el.click()
    // })

    // listElCheckedHighlight.value = []

    // Set null bounds highlight
    highlightBounds.value = [];
    handleHighlightMapLayers.value = [];
    hightlightLayers.value = [];

    tableData.value.forEach((rowData) => (rowData.active = false));

    // Ẩn bảng điều khiển của highlight
    // isShowHighlightPannel.value = false
    // console.log(isShowHighlightPannel.value)
  }

  async function getIndustrialBySlug(slug) {
    const { data } = await apiRequest.get(`/industrial-area?slg=${slug}`);
  }

  /**
   * [loadLayerOverlay wms layer của lớp dữ liệu hiện tại lên bản đồ]
   * @return None
   */
  async function getAllLayersPublic(kcnSlug = null, mapId = null, callback = null) {
    kcnName = kcnSlug;
    const { data } = await apiRequest.get(
      `/${kcnSlug}/group-layer-map/?map_id=${mapId}`
    );
    for (let idex_group in data.results) {
      data.results[idex_group].layers = data.results[idex_group].layers.map(
        (layer) => {
          return { ...layer, actice: false };
        }
      );
    }
    groupLayers.value = data.results;
    if (callback) {
      callback()
    }
  }

  async function getLayerMiningData(kcnSlug = null, layerId = null) {
    kcnName = kcnSlug !== null ? kcnSlug : "kcn-song-cong-2";
    const { data } = await apiRequest.get(`/${kcnName}/layer/${layerId}/`);

    const groupLayer = {
      id: uuidv4(),
      layers: [{ ...data, actice: true, layer_id: data.id }],
      name: "Khai thác dữ liệu",
      is_active: true,
    };
    const tileLayerStore = useTileLayerStore();
    groupLayer.layers.forEach((layer) => {
      tileLayerStore.addlayerToOverlay(layer);
    });
    groupLayers.value = [groupLayer];
  }
  async function getLayerMiningFolder(kcnSlug = null, folderId = null) {
    kcnName = kcnSlug !== null ? kcnSlug : "kcn-song-cong-2";
    const { data } = await apiRequest.get(`/${kcnName}/folder/${folderId}/`);
    const layers = data.children.map((item) => ({
      ...item,
      active: false,
      layer_id: item.id,
    }));
    const groupLayer = {
      id: uuidv4(),
      layers: layers,
      name: "Khai thác dữ liệu",
      is_active: true,
    };
    groupLayers.value = [groupLayer];
  }

  /**
   * [getLayerStructor Lấy về thông tin cấu trúc và thông tin liên quan của layer được chọn]
   * @return None
   */
  async function getLayerStructor() {
    if (selectedLayer.value?.layer_id == undefined) return;
    const { data } = await apiRequest.get(
      `/${kcnName}/layer/${selectedLayer.value?.layer_id}/`
    );
    tableStructor.value = data.construct.fields;
    nameDisplay.value = data.name_display;
    apiDatabase.value = data?.data_model;
    wmsInfo.value = data?.wms_info;
    queryFilterStr.value = "";
    const geomFilter = filterDataStore.getGeomFilter();

    // Trường hợp xử dụng
    if (geomFilter !== null) {
      getLayerDataModel(null, null, geomFilter !== null, geomFilter);
    } else {
      const queryStr = filterDataStore.getQueryStrFilter();
      queryFilterStr.value = queryStr;
      getLayerDataModel();
    }
  }

  /**
   * [getLayerDataModel Lấy về thông tin dữ liệu của lớp dữ liệu được chọn]
   * @return None
   */
  async function getLayerDataModel(
    page = null,
    searchUrl = null,
    postMethod = false,
    formData = false
  ) {
    // Nếu có tham số page (chuyển sang trang tiếp để xem)
    // Thay đổi url thêm tham số page
    // Post method using when post an geom to filter data
    if (!postMethod) {
      isGetMethod.value = true;
      let url = `/${apiDatabase.value}` + queryFilterStr.value;
      if (page !== null)
        url = url.includes("?") ? `${url}&page=${page}` : `${url}?page=${page}`;

      if (searchUrl !== null) url = searchUrl;
      const { data } = await apiRequest.get(url);
      tableData.value = data.results;
      let rowsData = [];
      tableData.value.forEach((rowData) => {
        const founded = hightlightLayers.value.find(
          (layer) => layer.id == rowData.id
        );
        const active = founded?.id == rowData.id;
        rowData = { ...rowData, active: active };
        rowsData.push(rowData);
      });
      tableData.value = rowsData;
      currentPage.value = data.current_page_number;
      nextPage.value = data.next;
      prevPage.value = data.previous;
      totalObject.value = data.total_objects;
      totalPages.value = data.total_pages;
    } else {
      isGetMethod.value = false;
      let url = `/${apiDatabase.value}?geom`;
      if (page !== null)
        url = url.includes("?") ? `${url}&page=${page}` : `${url}?page=${page}`;
      if (searchUrl !== null) url = searchUrl;

      const { data } = await apiRequest.post(url, formData);
      tableData.value = data.results;
      let rowsData = [];
      tableData.value.forEach((rowData) => {
        const founded = hightlightLayers.value.find(
          (layer) => layer.id == rowData.id
        );
        const active = founded?.id == rowData.id;
        rowData = { ...rowData, active: active };
        rowsData.push(rowData);
      });
      tableData.value = rowsData;
      currentPage.value = data.current_page_number;
      nextPage.value = data.next;
      prevPage.value = data.previous;
      totalObject.value = data.total_objects;
      totalPages.value = data.total_pages;
    }
  }

  /**
   * [pageChanged Chuyển page]
   * @return None
   */
  async function pageChanged(page) {
    getLayerDataModel(page);
  }

  return {
    getBoundaryDetail,
    // Check Mining
    isMining,
    getLayerMiningData,
    getLayerMiningFolder,
    // Boundary
    getAllProvince,
    getDistrictByProvinceId,
    getCommuneByDistrictId,

    modalShowType,

    // Search | Filter
    searchField,
    searchValue,
    isDateFieldSearch,
    isGetMethod,

    // Search | Filter methods
    searchDataPublic,
    filterDataPublicByBoundary,
    filterDataPublicByGeom,

    // Highlight
    hightlightLayers,
    isShowHighlightPannel,

    // Highlight methods
    zoomToHighlightLayer,
    addLayerHighlight,
    removeLayerHightlight,
    hightlightLayersOnMap,
    destroyhighlightLayersOnMap,
    removeOlderHighlight,
    // Layers total
    groupLayers,
    selectedLayer,

    // Layer detail
    tableStructor,
    tableData,
    nameDisplay,
    apiDatabase,
    wmsInfo,

    // Layer detail Pagination
    currentPage,
    nextPage,
    prevPage,
    totalObject,
    totalPages,

    // Data layer methods
    getAllLayersPublic,
    getLayerStructor,
    getLayerDataModel,
    pageChanged,
    getIndustrialBySlug,
  };
});

export const useTileLayerStore = defineStore("tileLayers", () => {
  // Handle các đối tượng đang được tile overlay trên bản đồ
  // Các đối tượng tileoverlayer trên map4d được quản lý tại đây
  const isGetInfo = ref(false);
  const overlays = ref([]);
  const objectLocation = ref(null);

  // Các đối tượng để quản lý các Tile
  // Chủ yếu xử dụng để khi xóa lớp overlay
  // Khi xóa sẽ lấy về index của layer trong layerShowTile và xóa đối tượng overlayers với index tương ứng
  // Bởi vì người dùng không thể truyền vào tham số overlay mà chỉ là tham số layer
  // Hy vọng sẽ có cách xử lý khác. Hiện tại chỉ nghĩ ra cách này thui
  const layersShowTile = ref([]);
  const detailLayerMap = ref([]);

  const layerDetailMap4dDraw = ref([]);
  const layerDetailDraw = ref([]);
  const filerCqlQuery = ref(null);
  const cqlObjectFilter = ref({});
  const filterCqlPolygonOverLay = ref(null);
  const locationSelected = ref({});

  const highlightResultSearchGeom = (geom) => {
    return getMap4dDraw(geom.type, geom.coordinates);
  };

  const restAllFilter = function () {
    removeFilterCqlPolygon();
    filerCqlQuery.value = null;
    cqlObjectFilter.value = [];
    filterCqlGeomOverlay();
  };

  const changeFilterCqlPolygon = function () {
    if (filterCqlPolygonOverLay.value != null) {
      filterCqlPolygonOverLay.value.setMap(null);
    }

    const filterDataStore = useFilterDataStore();

    if (filterDataStore.currentFilter.type == "drawCircle") {
      const lat = filterDataStore.currentFilter.draw.circle.center.split(', ')[0]
      const lng = filterDataStore.currentFilter.draw.circle.center.split(', ')[1]
      filterCqlPolygonOverLay.value = new map4d.Circle({
        center: { lat: lat, lng: lng },
        fillOpacity: 0.1,
        strokeWidth: 1,
        strokeColor: "#F24C3D",
        userInteractionEnabled: true,
        radius: filterDataStore.currentFilter.draw.circle.radius,
      })
    } else {
      filterCqlPolygonOverLay.value = new map4d.Polygon({
        fillOpacity: 0.1,
        userInteractionEnabled: true,
        paths: cqlObjectFilter.value,
      });
      //  Polygon vào bản đồ
    }
    filterCqlPolygonOverLay.value.setMap(dataMapMain.map);

  };

  const removeFilterCqlPolygon = function () {
    if (filterCqlPolygonOverLay.value != null) {
      filterCqlPolygonOverLay.value.setMap(null);
    }
  };

  const getfilterWmsWithGeom = function (geometry = null) {
    const filterDataStore = useFilterDataStore()
    if (filterDataStore.currentFilter.type == "drawCircle") {
      const centerCircle = filterDataStore.currentFilter.draw.circle.center
      filerCqlQuery.value = `DWITHIN(geom, POINT(${centerCircle.split(',')[1]} ${centerCircle.split(',')[0]}), ${filterDataStore.currentFilter.draw.circle.radius}, meters)`
      console.log(filerCqlQuery.value)
    }
    else {
      if (geometry.type.toLowerCase() == "polygon") {
        cqlObjectFilter.value = geometry.coordinates;
      } else if (geometry.type.toLowerCase() == "multipolygon") {
        cqlObjectFilter.value = geometry.coordinates[0];
      }
      const filterDataStore = useFilterDataStore()
      filerCqlQuery.value = `INTERSECTS(geom, POLYGON((${getfilterWmsFromGeom(geometry)})))`;

    }

    return filerCqlQuery.value;
  };

  const filterCqlGeomOverlay = (
    isBoundaryFilter = false,
    boundaryFilter = null
  ) => {
    if (!isBoundaryFilter) {
      layersShowTile.value.forEach((layer, index) => {
        // Hủy overlay map
        try {
          overlays.value[index].setMap(null);
          overlays.value[index] = null;
        } catch (err) { }

        // Xóa layer khỏi danh sách quản lý layer overlay
        layersShowTile.value[index] = null;
        const wmsInfo = layer.wms_info;
        // add overlay vào bản đồ
        const overlay = methods_map.overlayTile(
          wmsInfo.layer,
          wmsInfo.workspace,
          wmsUrl,
          dataMapMain.map,
          null,
          filerCqlQuery.value
        );
        layersShowTile.value[index] = layer;
        overlays.value[index] = overlay;
      });
    } else {
      layersShowTile.value.forEach((layer, index) => {
        // Hủy overlay map
        try {
          overlays.value[index].setMap(null);
          overlays.value[index] = null;
        } catch (err) { }

        // Xóa layer khỏi danh sách quản lý layer overlay
        layersShowTile.value[index] = null;
        const wmsInfo = layer.wms_info;
        // add overlay vào bản đồ
        const overlay = methods_map.overlayTile(
          wmsInfo.layer,
          wmsInfo.workspace,
          wmsUrl,
          dataMapMain.map,
          null,
          null,
          boundaryFilter
        );
        layersShowTile.value[index] = layer;
        overlays.value[index] = overlay;
      });
    }
  };

  /**
   * [changePositionLayer Hàm thay đổi vị trí layer]
   * @return None
   */
  const changePositionLayer = function () {
    reloadAllOverlays();
    overlayLayersShowTile();
  };

  /**
   * [reloadAllOverlays Hàm huỷ tất cả overlay hiện tại vẫn giữ lại các layerShowTile]
   * @return None
   */
  const reloadAllOverlays = function () {
    overlays.value.forEach((overlay) => {
      overlay.setMap(null);
    });
    overlays.value = [];
  };

  /**
   * [removeAllLayerShowTile Hàm huỷ tất cả overlay và layerShowTile]
   * @return None
   */
  const removeAllLayerShowTile = function () {
    overlays.value.forEach((overlay) => {
      overlay.setMap(null);
    });
    overlays.value = [];
    layersShowTile.value = [];
  };

  function openALlLayer(groupLayer) {
    groupLayer.layers.forEach((layer) => {
      addOverLayer(layer);
    });
  }

  /**
   * [overlayLayersShowTile Hàm thêm tất cả các LayerShowTile thành overlay]
   * @return None
   */
  const overlayLayersShowTile = function () {
    layersShowTile.value.forEach((layer) => {
      const opacity = layer["opacity"] != null ? layer["opacity"] : 1;
      addOverlay(layer, opacity);
    });
  };

  /**
   * [addLayerDetailDraw Thêm draw cho 1 layer khi xem detail]
   * @return None
   */
  const addLayerDetailDraw = (layer) => {
    const index = layerDetailDraw.value.findIndex((el) => el.id == layer.id);

    // Nếu layer này chưa được add dữ liệu vào trong danh sách thì mới thêm
    if (index === -1) {
      const _geom = layer.detail.data.record.geom;
      const geomType = _geom.type;
      const geom = _geom.coordinates;
      const map4dDraw = getMap4dDraw(geomType, geom);

      if (map4dDraw) {
        map4dDraw.setMap(dataMapMain.map);
        layerDetailDraw.value.push(layer);
        layerDetailMap4dDraw.value.push(map4dDraw);
      }
    }
  };

  /**
   * [removeLayerDetailDraw Xóa draw của 1 đối tượng xác định]
   * @return None
   */
  const removeLayerDetailDraw = (layer) => {
    const index = layerDetailDraw.value.findIndex((el) => el.id == layer.id);

    // Nếu layer này chưa được add dữ liệu vào tronh danh sách thì mới thêm
    if (index > -1) {
      layerDetailMap4dDraw.value[index].setMap(null);
      layerDetailMap4dDraw.value.splice(index, 1);
      layerDetailDraw.value.splice(index, 1);
    }
  };

  /**
   * [resetAllMapDetail Xóa hết các đối tượng xem detail trên bản đồ]
   * @return None
   */
  const resetAllMapDetail = () => {
    layerDetailDraw.value.forEach((layer) => {
      removeLayerDetailDraw(layer);
    });

    // Loại bỏ marker
    methods_map.SetNullMarker();
  };

  /**
   * [addlayerToOverlay Thêm overlay (geoserver) vào bản đồ]
   * Hàm xử lý khi người dùng muốn thêm 1 lớp layer vào bản đồ để xem
   * @return None
   */
  const addlayerToOverlay = (layer, opacity = null) => {
    zoomToLayerOverlay(layer);
    addOverLayer(layer, opacity);
  };

  /**
  * [addLayerIdToOverLay Thêm overlay (geoserver) vào bản đồ]
  * Hàm xử lý khi người dùng muốn thêm 1 lớp layer vào bản đồ để xem
  * @return None
  */
  const addLayerIdToOverLay = (layerId, opacity = null) => {
    console.log(layerId)
    let layer = null
    const publicLayerStore = usePublicLayerStore()
    publicLayerStore.groupLayers.forEach((group) => {
      console.log(group)
      group.layers.forEach(layerO => {
        console.log(`${layerId} == ${layerO.id}`, layerId == layerO.id)
        if (layerId == layerO.id) {
          layer = layerO
          layerO.actice = true
        }
      })
    })
    if (layer) {
      addOverLayer(layer)
    }
    // const wmsInfo = layer.wms_info;
    // // add overlay vào bản đồ
    // const overlay = methods_map.overlayTile(
    //   wmsInfo.layer,
    //   wmsInfo.workspace,
    //   wmsUrl,
    //   dataMapMain.map,
    //   opacity,
    //   filerCqlQuery.value
    // );
    // layersShowTile.value.push(layer);
    // overlays.value.push(overlay);
  };

  /**
   * [addOverLayer Hàm thêm overlay vào danh sách + thêm vào layersShowTile]
   * @return None
   */
  const addOverLayer = (layer, opacity = null) => {
    const wmsInfo = layer.wms_info;
    // add overlay vào bản đồ
    const overlay = methods_map.overlayTile(
      wmsInfo.layer,
      wmsInfo.workspace,
      wmsUrl,
      dataMapMain.map,
      opacity,
      filerCqlQuery.value
    );
    layersShowTile.value.push(layer);
    overlays.value.push(overlay);
  };

  /**
   * [addOverLayer Hàm thêm overlay vào danh sách không thêm vào layersShowTile]
   * @return None
   */
  const addOverlay = (layer, opacity = null) => {
    const wmsInfo = layer.wms_info;
    // add overlay vào bản đồ
    const overlay = methods_map.overlayTile(
      wmsInfo.layer,
      wmsInfo.workspace,
      wmsUrl,
      dataMapMain.map,
      opacity
    );
    overlays.value.push(overlay);
  };

  const zoomToLayerOverlay = (layer) => {
    const wmsInfo = layer.wms_info;
    const wmsBbox = wmsInfo.bbox;
    const bbox = wmsBbox;
    // Kiểm tra bbox để zoom tới vị trí của bbox layer
    // Nếu bbox (geoserver bbox) là đúng thì zoom tới vị trí đó
    if (isValidWmsBbox(bbox)) {
      const listBounds = [
        [bbox["maxx"], bbox["maxy"]],
        [bbox["minx"], bbox["miny"]],
      ];
      fitBounds(listBounds, dataMapMain.map);
    }
  };

  /**
   * [removeLayerOverlay Xóa overlay (geoserver) khỏi bản đồ]
   * Hàm xử lý khi người dùng muốn hủy xem lớp layer đã chọn
   * @return None
   */
  const removeLayerOverlay = (layer) => {
    const index = layersShowTile.value.findIndex((el) => el.id == layer.id);

    if (index > -1) {
      // Hủy overlay map
      console.log(overlays.value[index]);
      try {
        overlays.value[index].setMap(null);
        overlays.value.splice(index, 1);
      } catch (err) {
        console.log(err);
      }

      // Xóa layer khỏi danh sách quản lý layer overlay
      layersShowTile.value.splice(index, 1);
    }
  };

  /**
   * [getLayerDetailByLocation Lấy về thông tin của layer theo vị trí đã chọn]
   * @return None
   */
  const getLayerDetailByLocation = (locationObject = null) => {
    if (!locationObject) {
      if (!isGetInfo.value) return;
      detailLayerMap.value = [];
      if (layersShowTile.value.length > 0) {
        if (dataMapMain.location == undefined) return;
        // Cần xóa hết các detail cũ của người dùng khi người dùng chọn 1 vị trí mới để xem chi tiết
        resetAllMapDetail();
        methods_map.MarkerMap(dataMapMain.location);
        objectLocation.value = dataMapMain.location;

        layersShowTile.value.forEach(async (layer) => {
          locationSelected.value = dataMapMain.location;
          const layerId = layer.layer_id;
          const { data } = await apiRequest.get(
            `/${kcnName}/layer/${layerId}/get-info-record/?p=${locationSelected.value.lat},${locationSelected.value.lng}`
          );

          if (data["msg"] === undefined) {
            layer["detail"] = {
              status: "ok",
              data: data,
            };
            detailLayerMap.value.push(layer);
          } else {
            layer["detail"] = {
              status: "err",
              msg: "Không tìm thấy dữ liệu phù hợp!",
            };
            detailLayerMap.value.push(layer);
          }
        });
        return true;
      } else {
        return false;
      }
    }
    else {
      isGetInfo.value = true
      if (layersShowTile.value.length > 0) {
        resetAllMapDetail();
        methods_map.MarkerMap(locationObject);
        objectLocation.value = locationObject;

        layersShowTile.value.forEach(async (layer) => {
          let location = locationObject;
          const layerId = layer.layer_id;
          const { data } = await apiRequest.get(
            `/${kcnName}/layer/${layerId}/get-info-record/?p=${location.lat},${location.lng}`
          );

          if (data["msg"] === undefined) {
            layer["detail"] = {
              status: "ok",
              data: data,
            };
            detailLayerMap.value.push(layer);
          } else {
            layer["detail"] = {
              status: "err",
              msg: "Không tìm thấy dữ liệu phù hợp!",
            };
            detailLayerMap.value.push(layer);
          }
        });
        return true;
      } else {
        return false;
      }
    }

  };

  const changeOpacityLayer = (layer, opacity) => {
    const index = layersShowTile.value.findIndex((el) => el == layer);

    if (index > -1) {
      // Hủy overlay map
      try {
        overlays.value[index].setMap(null);
        overlays.value[index] = null;
      } catch (err) {
        console.log(err);
      }

      // Xóa layer khỏi danh sách quản lý layer overlay
      layersShowTile.value[index] = null;
      const wmsInfo = layer.wms_info;
      // add overlay vào bản đồ
      const overlay = methods_map.overlayTile(
        wmsInfo.layer,
        wmsInfo.workspace,
        wmsUrl,
        dataMapMain.map,
        opacity,
        filerCqlQuery.value
      );
      layersShowTile.value[index] = layer;
      layersShowTile.value[index]["opacity"] = opacity;
      overlays.value[index] = overlay;
    }
  };

  return {
    locationSelected,
    highlightResultSearchGeom,
    isGetInfo,
    overlays,
    layersShowTile,
    objectLocation,
    filerCqlQuery,
    addLayerIdToOverLay,
    getfilterWmsWithGeom,
    filterCqlGeomOverlay,
    changeFilterCqlPolygon,
    removeFilterCqlPolygon,
    restAllFilter,
    removeAllLayerShowTile,
    openALlLayer,

    detailLayerMap,
    layerDetailMap4dDraw,
    layerDetailDraw,

    // Các function sử dụng với layer
    addlayerToOverlay,
    removeLayerOverlay,
    zoomToLayerOverlay,
    changeOpacityLayer,

    // Các function sử dụng với từng record trong 1 layers
    getLayerDetailByLocation,
    addLayerDetailDraw,
    removeLayerDetailDraw,
    resetAllMapDetail,
    changePositionLayer,
  };
});

export const useProjectViewStore = defineStore("projectView", () => {
  const projects = ref([]);
  const currentProject = ref(null);
  const isShowDetail = ref(false);
  const projectDraw = ref(null);

  const getAllProjects = async (callback = null) => {
    const { data } = await apiRequest.get(
      `/${kcnName}/${projectModelName}/?per_page=99999`
    );
    projects.value = { ...data, active: false };
    if (callback) {
      callback()
    }
    return data;
  };

  const clearAllDrawProject = function () {
    projects.value.results.forEach((project) => (project.active = false));
    if (projectDraw.value !== null) {
      projectDraw.value.setMap(null);
      projectDraw.value = null;
    }
  };

  const addDrawProject = function (project) {
    clearAllDrawProject();

    if (project.exactly.geom !== null) {
      const geomType = project.exactly.geom.type;
      const geom = project.exactly.geom.coordinates;
      const map4dDraw = getMap4dDraw(geomType, geom);
      map4dDraw.setMap(dataMapMain.map);
      projectDraw.value = map4dDraw;
      const bounds = getGeomBounds(geomType, geom);
      fitBounds(bounds, dataMapMain.map);
    }
  };

  const searchProjects = debounce(async function (queryStr) {
    const { data } = await apiRequest.get(
      `/${kcnName}/${projectModelName}/?per_page=99999&&ten=${queryStr}`
    );
    projects.value = { ...data, active: false };
  }, 500);
  const getDetailProject = async (projectId) => {
    const { data } = await apiRequest.get(
      `/${kcnName}/${projectModelName}/${projectId}/?vicinity`
    );
    currentProject.value = data;
    addDrawProject(currentProject.value);
    return data;
  };
  return {
    projects,
    isShowDetail,
    searchProjects,
    currentProject,
    getAllProjects,
    getDetailProject,
    clearAllDrawProject,
  };
});

export const useActivityStore = defineStore("activityStore", () => {
  const recordId = ref(null);
  const dataDetails = ref([]);

  const getObjectActivity = async function () {
    const { data } = await apiRequest.get(
      `/${kcnName}/activity/?id_record=${recordId.value}`
    );
    dataDetails.value = data.results;
    return data;
  };
  return {
    recordId,
    dataDetails,
    getObjectActivity,
  };
});

export const useFilterDataStore = defineStore("filterDataStore", () => {
  // Đùng để quản lý và load lại dữ liệu lọc hiện tại khi người dùng chuyển tab hoặc đóng tab rồi bật lại
  const currentFilter = ref({
    type: "project", // project | boundary | drawData | uploadData
    boundary: {
      provinceId: "CHOSE",
      districtId: "CHOSE",
      communeId: "CHOSE",
      queryStr: "",
    },
    uploadId: "CHOSE",
    upload: {
      uploadPolygon: [],
    },
    projectId: "CHOSE",
    project: {
      queryStr: "",
    },
    draw: {
      drawPolygon: [],
      drawPolyStr: "{}",
      queryCircle: "",
      circle: {
        center: "",
        radius: 100,
      },
    },
  });

  const resetFilter = () => {
    currentFilter.value = {
      type: "project",
      boundary: {
        provinceId: "CHOSE",
        districtId: "CHOSE",
        communeId: "CHOSE",
        queryStr: "",
      },
      uploadId: "CHOSE",
      upload: {
        uploadPolygon: [],
      },
      projectId: "CHOSE",
      project: {
        queryStr: "",
      },
      draw: {
        drawPolygon: [],
        drawPolyStr: "{}",
        queryCircle: "",
        circle: {
          center: "",
          radius: 100,
        },
      },
    };
  };

  // Lấy về thông tin filter hiện tại
  const getGeomFilter = () => {
    if (currentFilter.value.type == "drawData") {
      return currentFilter.value.draw.drawPolygon;
    } else if (currentFilter.value.type == "uploadData") {
      return currentFilter.value.upload.uploadPolygon;
    } else return null;
  };

  const getQueryStrFilter = () => {
    if (currentFilter.value.type == "boundary") {
      return currentFilter.value.boundary.queryStr;
    } else if (currentFilter.value.type == "project") {
      return currentFilter.value.project.queryStr;
    } else if (currentFilter.value.type == "drawCircle") {
      return currentFilter.value.draw.queryCircle;
    }
  };

  return {
    currentFilter,
    resetFilter,
    getGeomFilter,
    getQueryStrFilter,
  };
});
