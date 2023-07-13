<script setup>
import { inject, reactive, ref, defineEmits } from "vue";

const emit = defineEmits(["change-base-map"]);
const setTypeMap = (nameShow, name, img, active = false) => {
  return { nameShow: nameShow, name: name, img: img, active: active };
};
const methods_map = inject("draw-map");

const dataMapBDHC = reactive({
  mapType: null,
});
const mapTypeMapBDHC = ref([
  setTypeMap(
    "Bản đồ hành chính",
    "bdhc",
    require("@/assets/images/maptype/bdhc.png")
  ),
]);
const handleSetMapType = () => {
  methods_map.setMapType("bdhc");
  emit("change-base-map", "bdhc");
};
</script>

<template>
  <div class="mt-2 p-1">
    <span>Bản đồ nền hành chính</span>
    <div
      v-for="(item, index) in mapTypeMapBDHC"
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
            v-model="dataMapBDHC.mapType"
            type="radio"
            @change="handleSetMapType"
          />
        </button>
      </div>
      <!--v-if-->
    </div>
  </div>
</template>
