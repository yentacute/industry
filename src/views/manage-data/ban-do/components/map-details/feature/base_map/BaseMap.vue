<script setup>
import { ref } from "vue";
import MapType4D from "./MapType4D.vue";
import OSMType from "./OSMType.vue";
import BDHCType from "./BDHCType.vue";
import API from "../../../../../../../helpers/api/useAxios";
import {
  errorToast,
  successToast,
} from "../../../../../../../helpers/api/toastStyle";

const setBaseMap = (name, img, active = false, component) => {
  return { name: name, img: img, active: active, component: component };
};
const mapBase = ref([
  setBaseMap(
    "Map4D",
    require("@/assets/images/logo/logo-map4d-new-1x1.png"),
    true,
    MapType4D
  ),
  setBaseMap(
    "Bản đồ khác",
    require("@/assets/images/maptype/osm.png"),
    false,
    OSMType
  ),
  setBaseMap(
    "Hành chính",
    require("@/assets/images/maptype/bdhc.png"),
    false,
    BDHCType
  ),
]);

const baseMap = ref("");
const handleChangBaseMap = (base) => {
  baseMap.value = base;
};
const handleSaveBaseMap = () => {
  if (!baseMap.value) return;
  API()
    .patch(
      `${location.pathname.split("/")[1]}/map/${
        location.pathname.split("/")[4]
      }/`,
      {
        base_map: { base: baseMap.value },
      }
    )
    .then((res) => {
      if (res) {
        successToast("Đã cập nhật lớp bản đồ");
        return;
      }
      errorToast(
        "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
      );
    });
};

const handleClickChangeBaseMap = (_index) => {
  mapBase.value.forEach((item, index) => {
    if (_index === index) {
      item.active = true;
    } else {
      item.active = false;
    }
  });
};
</script>

<template>
  <div>
    Base map
    <div class="mt-2 d-flex">
      <div class="p-1" v-for="(item, index) in mapBase" :key="index">
        <div
          :title="item.name"
          @click="handleClickChangeBaseMap(index)"
          class="cursor-pointer"
          style="border-radius: 8px"
        >
          <div
            class="d-flex flex-column align-items-center position-relative overflow-hidden"
            style="width: 65px; height: 65px; border-radius: 8px"
            :style="{
              border: item.active ? '2px solid #508ff4' : '1px solid #ccc',
            }"
          >
            <img
              :src="item.img"
              :alt="item.name"
              style="width: 62px; height: 62px; object-fit: cover"
            />
            <div
              class="position-absolute text-white d-flex justify-content-center align-items-center ellipsis"
              style="
                inset: 0;
                top: 50%;
                background: transparent
                  linear-gradient(180deg, #ffffff00 0%, #000000b5 100%) 0% 0%
                  no-repeat padding-box;
              "
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-for="(item, index) in mapBase">
      <component
        :key="index"
        v-if="item.active"
        :is="item.component"
        @change-base-map="handleChangBaseMap"
      ></component>
    </template>
    <div class="d-flex justify-content-between align-items-center mt-3 me-1">
      <p></p>
      <button class="btn btn-primary" @click="handleSaveBaseMap">
        Lưu lại
      </button>
    </div>
  </div>
</template>
