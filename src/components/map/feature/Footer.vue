<script setup>
import { defineEmits, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { menuDefaut, menu } from "../../../state/map_control/menu-footer.js";

const useQuery = useRoute();
const show = ref(false);

const classMobile = computed(() => {
  if (show.value) {
    return {};
  }
  return {
    height: "48px",
    overflow: "hidden",
    "overflow-y": "hidden !important",
  };
});

const emit = defineEmits([
  "style-layer",
  "direct",
  "data-layer",
  "details-layer",
  "static-data",
  "setting",
  "data-e",
]);

const handleClickIcon = function (item) {
  switch (item.emit) {
    case "map-compare":
      item.handle(useQuery.query.camera);
      break;
    default:
      item.handle();
  }
  emit(item.emit);
};

const handleViewFooter = function () {
  show.value = !show.value;
};
</script>

<template>
  <div
    class="layout-footer hover-overflow-none"
    :class="{ 'layout-custom hover-overflowY-scroll': menu.length > 7 }"
    :style="classMobile"
  >
    <div class="w-100">
      <ul class="h-100 d-flex gap-2 align-items-center px-2 w-100">
        <li
          v-for="(item, index) in menuDefaut"
          :title="item.title"
          :key="index"
          :style="{ 'background-color': item.color }"
          @click="handleClickIcon(item)"
          class="position-relative"
        >
          <div
            class="w-100 h-100 rounded-pill px-3 d-flex align-items-center justify-content-center cursor-pointer"
          >
            <i :class="item.icon" class="text-light"></i>
          </div>
          <!-- notify -->
          <div
            v-if="item.notify.length > 0"
            class="position-absolute"
            style="top: -3px; right: -2px"
          >
            <div
              style="height: 12px; width: 12px; border-radius: 50%"
              class="text-bg-danger d-flex justify-content-center align-content-center"
            >
              <span style="line-height: 12px; font-size: 8px">{{
                item.notify.length
              }}</span>
            </div>
          </div>
        </li>
        <li class="menu-more">
          <div>
            <ul class="h-100 w-100 d-flex gap-2 align-items-center m-0">
              <li
                v-for="(item, index) in menu"
                :title="item.title"
                :key="index"
                :class="{ 'd-none': !show }"
                :style="{ 'background-color': item.color }"
                @click="handleClickIcon(item)"
                class="position-relative"
              >
                <div
                  class="w-100 h-100 rounded-pill px-3 d-flex align-items-center justify-content-center cursor-pointer"
                >
                  <i :class="item.icon" class="text-light"></i>
                </div>
              </li>
              <li
                style="background-color: #afafaf"
                @click="handleViewFooter"
                title="Xem thêm"
              >
                <div
                  class="w-100 h-100 rounded-pill px-3 d-flex align-items-center justify-content-center cursor-pointer mobile-icon"
                >
                  <i
                    class="ri-arrow-left-s-fill text-light fs-24"
                    :style="{ transform: show ? '' : 'rotate(180deg)' }"
                  ></i>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.layout-footer {
  position: fixed;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 4px #666;
  border-radius: 5px;
  max-width: 80vw;
}
.layout-footer ul li {
  width: 38px;
  height: 38px;
  border-radius: 5px;
  box-shadow: 0px 3px 6px #00000029;
}
.menu-more {
  width: fit-content !important;
  box-shadow: none !important;
}
@media screen and (max-width: 575px) {
  /* .layout-custom {
    bottom: 10px;
    right: 10px;
    width: 50px;
    left: auto;
    overflow: hidden;
    height: fit-content;
    max-height: 60vh;
    padding-block: 5px;
    transform: translateX(0);
    align-items: start;
    transition: height linear 0.3s;
  } */

  .layout-footer ul {
    /* flex-direction: column;
    justify-content: start; */

    width: fit-content !important;
  }
  .mobile-icon {
    /* transform: rotate(90deg); */
  }
}
</style>
