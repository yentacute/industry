import { ref } from "vue";
import router from "../../router/index.js";
import { useTileLayerStore } from "./publicLayer.js";

const tileLayerStore = useTileLayerStore();

const setMenu = function (
  title,
  classIcon,
  bgColor,
  emit,
  notify = [],
  func_handle = () => {}
) {
  return {
    title: title,
    icon: classIcon,
    color: bgColor,
    emit: emit,
    notify: notify,
    handle: func_handle,
  };
};

const menuDefaut = ref([
  // setMenu("Lớp dữ liệu", "ri-price-tag-3-fill", "#f7b84b", "data-layer"),
  setMenu(
    "Layer style",
    "bx bx-layer",
    "#405189",
    "style-layer",
    tileLayerStore.layersShowTile
  ),
  setMenu("Chỉ đường", "ri-direction-fill", "#3577f1", "direct"),
  setMenu(
    "Chi tiết lớp bản đồ",
    "ri-list-unordered",
    "#f06548",
    "details-layer"
  ),
  setMenu(
    "Chiều thời gian",
    "mdi mdi-timer-cog-outline",
    "#405189",
    "time-dimension"
  ),
]);

const menu = ref([
  // setMenu("Bảng điều khiển", "bx bxs-dashboard", "#299cdb", ""),
  setMenu("Chú thích", "ri-price-tag-3-fill", "#0ab39c", "data-e"),
  setMenu(
    "So sánh thông tin",
    "mdi mdi-compare",
    "#299cdb",
    "map-compare",
    [],
    (camera) => {
      router.push({ name: "MapCompareMap", query: { camera: camera } });
    }
  ),
  setMenu(
    "Tìm kiếm nâng cao",
    "ri-search-line search-icon",
    "#405189",
    "change-type-search"
  ),
  // setMenu("Chọn", "mdi mdi-pencil-ruler", "#405189", ""),
  setMenu("Dữ liệu tĩnh", "mdi mdi-upload", "#405189", "static-data"),
  setMenu("Xem thông tin dự án", "mdi mdi-office-building", "#405189", "project-view"),
  setMenu("Cài đặt", "ri-settings-3-line", "#405189", "setting"),
]);

export { menu, menuDefaut };
