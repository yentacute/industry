<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import BuildStyles from "./feature/build_data_layer/BuildStyles.vue";
import BaseMap from "./feature/base_map/BaseMap.vue";

function setItem(name, classIcon, active = false, component) {
  return { name: name, icon: classIcon, active: active, component: component };
}
const MENU = reactive([
  setItem("Lớp bản đồ", "ri-stack-line", true, BuildStyles),
  // setItem("Công cụ", "bx bx-bar-chart-square"),
  // setItem("Tương tác", "bx bx-pointer"),
  // setItem("Chú giải", "bx bx-spreadsheet"),
  setItem("Bản đồ nền", "bx bx-map-alt", false, BaseMap),
]);
const onClickChangeMenu = function (_index) {
  MENU.forEach(function (item, index) {
    item.active = _index === index;
  });
};

const show = ref(true);

let elCloseNav;
const handleCloseNav = () => {
  setTimeout(
    () => {
      show.value = !show.value;
    },
    show.value ? 0 : 200
  );
};
onMounted(() => {
  elCloseNav = document.getElementById("topnav-hamburger-icon");
  elCloseNav.addEventListener("click", handleCloseNav);
});
onUnmounted(() => {
  elCloseNav.removeEventListener("click", handleCloseNav);
});
</script>
<template>
  <div v-show="show" class="w-100 h-100 px-2">
    <div class="py-2 mt-1">
      <!-- <button type="button" class="btn-close float-end fs-12 ms-2"></button> -->
      <h6 class="card-title mb-0 ellipsis fs-14">Xây dựng bản đồ</h6>
    </div>
    <div class="pt-2">
      <div
        class="d-flex justify-content-between align-items-center"
        style="line-height: 28px"
      >
        <div
          v-for="(item, index) in MENU"
          :key="index"
          :title="item.name"
          :class="{ 'border-bottom-ridge': item.active }"
          :style="{ width: `${100 / MENU.length}%` }"
          @click="onClickChangeMenu(index)"
          class="d-flex justify-content-center align-items-center gap-2 cursor-pointer mx-1"
          style="height: 28px"
        >
          <i :class="item.icon" class="text-primary"></i>
          <span v-if="MENU.length < 4" class="ellipsis">{{ item.name }}</span>
        </div>
      </div>
      <div v-for="(item, index) in MENU" class="mt-3" :key="index">
        <component v-if="item.active" :is="item.component"></component>
      </div>
    </div>
  </div>
</template>
