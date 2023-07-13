<script setup>
import { inject, reactive, ref, defineEmits } from "vue";

const emit = defineEmits(["change-base-map"]);
const setTypeMap4d = (nameShow, name, img, active = false) => {
  return { nameShow: nameShow, name: name, img: img, active: active };
};
const methods_map = inject("draw-map");

const dataMap4D = reactive({
  mapType: null,
});
const mapTypeMap4d = ref([
  setTypeMap4d(
    "Bản đồ 3d",
    "map3d",
    require("@/assets/images/maptype/map3d.png")
  ),
  setTypeMap4d(
    "Bản đồ giao thông (vector)",
    "roadmap",
    require("@/assets/images/maptype/roadmap.png")
  ),
  setTypeMap4d(
    "Bản đồ giao thông (raster)",
    "raster",
    require("@/assets/images/maptype/raster.png")
  ),
  setTypeMap4d(
    "Bản đồ vệ tinh",
    "satellite",
    require("@/assets/images/maptype/satellite.png")
  ),
]);
const handleSetMapType = () => {
  methods_map.setMapType(dataMap4D.mapType);
  emit("change-base-map", dataMap4D.mapType);
};
</script>

<template>
  <div class="mt-2 p-1">
    <span>Map4D IOTLink</span>
    <div
      v-for="(item, index) in mapTypeMap4d"
      :key="index"
      class="nav-link fs-13 mb-0 border mt-2 bg-white p-1"
    >
      <div class="d-flex align-items-center" style="min-height: 55px">
        <div class="d-flex w-100">
          <div class="d-flex justify-content-center align-items-center ps-1">
            <div
              class="avatar-title rounded bg-soft-warning text-warning overflow-hidden"
              style="border-radius: 8px"
            >
              <img
                :src="item.img"
                :alt="item.name"
                style="width: 52px; height: 52px; object-fit: cover"
              />
            </div>
          </div>
          <div class="flex-grow-1 ms-3 d-flex align-items-center">
            <span class="fw-semibold" :title="item.nameShow">
              {{ item.nameShow }}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="text-reset mx-1 border-0 bg-transparent justify-content-end cursor-pointer"
        >
          <input
            class="cursor-pointer"
            :value="item.name"
            v-model="dataMap4D.mapType"
            type="radio"
            @change="handleSetMapType"
          />
        </button>
      </div>
      <!--v-if-->
    </div>
  </div>
</template>
