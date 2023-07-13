<script setup>
import { useRoute, useRouter } from "vue-router";
import { provide, toRefs, ref, onMounted, reactive } from "vue";
import {
  data as data_map,
  methods_map,
} from "../../../state/map_control/data_map.js";
import MapIotLink from "../../../components/map/MapIotLink.vue";
import SetDateMap from "../../../components/map/feature/toolbar/SetDateMap.vue";
import MapTypes from "../../../components/map/feature/map_control/MapTypes.vue";
import { pastTime, futureTime } from "../../../common/map/function_map.js";
import { useTileLayerStore } from '../../../state/map_control/publicLayer.js'
const tileLayerStore = useTileLayerStore()


const useQuery = useRoute();
const router = useRouter();
const CAMERA = useQuery.query.camera;

const arrCam = CAMERA.split(",");

const setDateMapControl = ref(null);
const mapFCompare = ref(null);
const dataMapF = reactive({
  map: null,
  pastTime: pastTime,
  futureTime: futureTime,
  year: new Date().getFullYear(),
});
onMounted(() => {
  setDateMapControl.value.show = true;
});

const mapMoundted = async () => {
  data_map.map.setScrollGesturesEnabled(false);
  data_map.map.setZoomGesturesEnabled(false);
  data_map.map.setScrollGesturesEnabled(false);
  data_map.map.setRotateGesturesEnabled(false);
  data_map.map.setTiltGesturesEnabled(false);
  data_map.map.setAllGesturesEnabled(false);
  let options = {
    center: { lat: arrCam[0], lng: arrCam[1] },
    zoom: parseFloat(arrCam[2]),
    mapType: arrCam[5],
    controls: false,
    bearing: parseFloat(arrCam[4]),
    tilt: parseFloat(arrCam[3]),
  };
  dataMapF.map = new map4d.Map(mapFCompare.value, options);
  dataMapF.map.addListener("cameraChanging", async () => {
    data_map.map.moveCamera(dataMapF.map.getCamera());
  });
  dataMapF.map.addListener("idle", async () => {
    router.replace({
      query: { camera: await methods_map.handleChangeHeToaDo() },
    });
  });

  tileLayerStore.layersShowTile.forEach(layer => {
    console.log(layer)
    const wmsInfo = layer.wms_info
    // zoomToLayerOverlay(layer)

    // add overlay vào bản đồ
    methods_map.overlayTile(wmsInfo.layer, wmsInfo.workspace, "https://mapservice.gishub.vn/geoserver/wms", dataMapF.map)
    methods_map.overlayTile(wmsInfo.layer, wmsInfo.workspace, "https://mapservice.gishub.vn/geoserver/wms", data_map.map)
  })

};

const handleChangDimeDimension = function () {
  dataMapF.map.setDate(new Date(dataMapF.year, 0, 1));
};
provide("map", {
  ...toRefs(data_map),
});
provide("draw-map", methods_map);
</script>

<template>
  <div class="position-fixed row text-bg-success" style="inset: 0">
    <div ref="mapFCompare" class="col-12 col-md-6 p-1 position-relative">
      <div class="position-absolute text-bg-light" style="
              top: 10px;
              right: 10px;
              border-radius: 4px;
              box-shadow: 0 3px 1px -2px #00000033, 0 2px 2px 0 #00000024,
                0 1px 5px 0 #0000001f;
              height: 32px;
              padding: 40px 10px 0px 10px;
              display: flex;
              align-items: end;
              justify-content: center;
              width: 216px;
              z-index: 3;
            ">
        <div class="d-flex gap-2 justify-content-center align-items-center">
          <span class="fw-bold">{{ dataMapF.pastTime }}</span>
          <div class="w-100 position-relative">
            <span class="position-absolute fw-bold" style="top: -18px; left: 50%; transform: translateX(-50%)">{{
              dataMapF.year }}</span>
            <input v-model="year" class="w-100 h-100" type="range" :min="pastTime" :max="futureTime"
              @change="handleChangDimeDimension" />
          </div>
          <span class="fw-bold">{{ dataMapF.futureTime }}</span>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 p-1 position-relative">
      <MapIotLink @map-moundted="mapMoundted"></MapIotLink>
      <div class="position-absolute" style="bottom: 10px; right: 20px">
        <MapTypes></MapTypes>
      </div>
      <div class="position-absolute" style="top: 0; right: 0">
        <div class="position-relative" style="top: 120px; right: 120px">
          <SetDateMap ref="setDateMapControl"></SetDateMap>
        </div>
      </div>
    </div>
  </div>
  <div class="position-fixed hover-cricle-bg cursor-pointer" style="
          top: 10px;
          left: 8px;
          z-index: 5;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
    <router-link :to="{ name: 'MapControl' }">
      <i class="mdi mdi-keyboard-backspace fs-22"></i>
    </router-link>
  </div>
</template>
