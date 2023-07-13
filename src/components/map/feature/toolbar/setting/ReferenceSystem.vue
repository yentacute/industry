<script setup>
import { useRouter } from "vue-router";
import { ref, inject, toRefs } from "vue";
import { listMui3VN2000 } from "./danh_sach_mui_chieu.js";
import proj4 from "proj4";
import { vn2000HN, utm_axis } from "../../../../../utils/wgs84vn2000";
import {
  heToaDo,
  dataHe84,
  dataHe200,
} from "../../../../../state/map_control/data_map.js";
import useLocalStorage from "../../../../../utils/useLocalStorage";

const router = useRouter();

var crs_4326 = "+proj=longlat +datum=WGS84 +no_defs ";

var crs_32648 = "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs ";
var crs_32649 = "+proj=utm +zone=49 +datum=WGS84 +units=m +no_defs ";

var crs_3405 =
  "+proj=utm +zone=48 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs ";

var crs_3406 =
  "+proj=utm +zone=49 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs ";

const listMui3VN2000Custom = listMui3VN2000.map((item) => {
  return {
    ...item,
    value:
      parseFloat(parseFloat(item.axis_meridian.split("-")[0])) +
      parseFloat(parseFloat(item.axis_meridian.split("-")[1]) / 60),
  };
});

const handleChangMui3VN2000 = ($e) => {
  dataHe200.muiChieu = $e.target.value;
  handleChangeHeToaDo();
};

// const showLuoi = ref(false);
// const handleClickToggleShowLuoi = () => {
//   showLuoi.value = !showLuoi.value;
// };

const data = inject("map");

const { map } = toRefs(data);

const camera_in_url = ref(map.value.getCamera());

const handleChangeHeToaDo = async () => {
  let camera = map.value.getCamera();
  let lat = parseFloat(camera.target.lat).toFixed(6);
  let lng = parseFloat(camera.target.lng).toFixed(6);
  let zoom = parseFloat(camera.zoom).toFixed(2);
  let tilt = parseFloat(camera.tilt).toFixed(2);
  let bearing = parseFloat(camera.bearing).toFixed(2);
  let maptype = map.value.getMapType();
  if (!lat || !zoom || !tilt || !bearing || !lng) return;
  switch (heToaDo.value) {
    case "wgs84":
      useLocalStorage.setItem("referenceLocation", {
        heToaDo: heToaDo.value,
        muiChieu: dataHe84.muiChieu,
      });
      if (dataHe84.muiChieu == 0) {
        camera_in_url.value = `${lat},${lng},${zoom},${tilt},${bearing},${maptype}`;
        break;
      }
      var wgs84_location = proj4(crs_4326, utm_axis(dataHe84.muiChieu), [
        camera.target.lng,
        camera.target.lat,
      ]);
      camera_in_url.value = `${wgs84_location[1]},${wgs84_location[0]},${zoom},${tilt},${bearing},${maptype}`;
      break;
    case "vn2000":
      useLocalStorage.setItem("referenceLocation", {
        heToaDo: heToaDo.value,
        muiChieu: dataHe200.muiChieu,
        loaiMuiChieu: dataHe200.loaiMuiChieu,
      });
      var vn2000_location = await proj4(
        crs_4326,
        vn2000HN(dataHe200.muiChieu, dataHe200.loaiMuiChieu),
        [camera?.target?.lng, camera?.target?.lat]
      );
      camera_in_url.value = `${vn2000_location[1]},${vn2000_location[0]},${zoom},${tilt},${bearing},${maptype}`;
      break;
    default:
  }
  router.push({
    query: { camera: camera_in_url.value },
  });
};
</script>

<template>
  <div
    class="card-body m-t-10 w-100 pt-1 mt-3"
    style="box-shadow: rgb(102, 102, 102) 0px 0px 2px; border-radius: 3px"
  >
    <div class="d-flex justify-content-between">
      <div class="w-100">
        <!-- <p class="mb-0 mt-2" style="font-weight: 700; color: black">
          Hệ quy chiếu
        </p> -->
        <!-- <p></p>
        <div>
          <button
            :class="{ 'text-bg-danger': showLuoi }"
            class="btn btn-sm btn-primary"
            @click="handleClickToggleShowLuoi"
          >
            {{ (showLuoi ? "Ẩn" : "Hiện") + " lưới địa lý " + heToaDo }}
          </button>
        </div> -->
        <div class="w-100 pt-2">
          <div class="align-items-center justify-content-center">
            <label for="" class="form-label">Hệ tọa độ</label>
            <select
              class="form-select"
              v-model="heToaDo"
              @change="handleChangeHeToaDo"
            >
              <option value="wgs84">Hệ tọa độ WGS84</option>
              <option value="vn2000">Hệ tọa độ VN2000</option>
            </select>
            <!---->
            <div v-if="heToaDo === 'wgs84'">
              <p></p>
              <label class="form-label">Múi chiếu</label>
              <select
                class="form-select"
                v-model="dataHe84.muiChieu"
                @change="handleChangeHeToaDo"
              >
                <option value="0">Mặc định</option>
                <option value="48">Múi chiếu 48 - 105</option>
                <option value="49">Múi chiếu 49 - 111</option>
              </select>
            </div>
            <div v-else>
              <p></p>
              <label for="" class="form-label">Loại múi chiếu</label>
              <select v-model="dataHe200.loaiMuiChieu" class="form-select">
                <option value="3">Múi chiếu 3</option>
                <option value="6" selected="selected">Múi chiếu 6</option>
              </select>
              <p></p>
              <label for="" class="form-label"><span>Múi chiếu</span></label>
              <select
                v-if="dataHe200.loaiMuiChieu == 6"
                v-model="dataHe200.muiChieu"
                class="form-select"
                @change="handleChangeHeToaDo"
              >
                <option value="64">Múi 48 - 105-00</option>
                <option value="65">Múi 49 - 111-00</option>
              </select>
              <select
                v-else
                class="form-select"
                @change="($e) => handleChangMui3VN2000($e)"
              >
                <option
                  v-for="item in listMui3VN2000Custom"
                  :key="item.id"
                  :value="item.value"
                >
                  {{ item.city + " " + item.axis_meridian }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
